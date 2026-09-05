import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";
import { SchedulerClient, CreateScheduleCommand, DeleteScheduleCommand } from "@aws-sdk/client-scheduler";



const USERS_TABLE = 'DailyBytes-Users';
const GENERATE_FUNCTION = 'DailyByte-GenerateSingleByte'


// DynamoDB
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const lambdaClient = new LambdaClient({});

// Create and Delete EventBridge schedules
const schedulerClient = new SchedulerClient({});
const GENERATE_SINGLE_BYTE_ARN = 'arn:aws:lambda:ca-west-1:992839646265:function:DailyByte-GenerateSingleByte';
const GENERATE_SINGLE_BYTE_ROLE_ARN = "arn:aws:iam::992839646265:role/DailyBytes-DailyByteGenerationScheduler";



export const handler = async (event) => {
  // TODO implement
  // const USER_ID = '0cfee476-4011-706b-585c-c90bcf7bcc3b';
  const USER_ID = event.requestContext?.authorizer?.jwt?.claims?.sub;

  try {
    // get payload body passed to the lambda
    const body = JSON.parse(event.body ?? "{}");

    // get the current preferences on a user
    const dynamoDBCommand = new QueryCommand({
      TableName: USERS_TABLE,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': USER_ID
      },
      ScanIndexForward: false,
      Limit: 1
    });
    
    const dynamoDBResponse = await docClient.send(dynamoDBCommand);
    const user = dynamoDBResponse.Items[0];

    if (!user)
    {
      return {
        statusCode: 404, 
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({"message": "User does not exist (Can't find old preferences)"})
      };
    }

    // handling topic update
    const newTopic = body.topic ?? null;
    if (newTopic)
    {
      // compare the newTopic with the old preference, if not equal then change the topic
      if (newTopic !== user.topic)
      {

        // update user's topic in DynamodDB
        try {  
          const topicUpdateCommand = new UpdateCommand({
            TableName: USERS_TABLE,
            Key: { userId: USER_ID},
            UpdateExpression: "SET topic = :t",
            ExpressionAttributeValues: { ":t": newTopic }
          });

          await docClient.send(topicUpdateCommand);

          console.log("Topic updated to ", newTopic, "for user: ", USER_ID);

          // generate a new byte for the user with their new topic
          const generateByteInvokeCommand = new InvokeCommand({
            FunctionName: GENERATE_FUNCTION,
            InvocationType: "RequestResponse",
            Payload: JSON.stringify({ userId: USER_ID })
          });

          await lambdaClient.send(generateByteInvokeCommand);
        }
        catch (err)
        {
          console.log("Error with updating topic: ", err.message);
          return {
            statusCode: 500,
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({"message": `Problem updating the topic for user. Error: ${err.message}`})
          }
        }
      }
    }

    // handle bytesPerDay update
    const newBytesPerDay = body.bytesPerDay ?? null;
    if (newBytesPerDay)
    {
      if (newBytesPerDay !== user.bytesPerDay)
      {
        
        // check whether newBytesPerDay is within the appropriate range
        if (newBytesPerDay > 3 || newBytesPerDay < 1)
        {
          return {
            statusCode: 400, 
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ "message": "bytesPerDay must be between 1 and 3" })
          };
        }

        try
        {
          const bytesPerDayUpdateCommand = new UpdateCommand({
            TableName: USERS_TABLE,
            Key: { userId: USER_ID},
            UpdateExpression: "SET bytesPerDay = :t",
            ExpressionAttributeValues: { ":t": newBytesPerDay }
          });

          await docClient.send(bytesPerDayUpdateCommand);
          console.log("bytesPerDay updated to ", newBytesPerDay, "for user: ", USER_ID);
        }
        catch (err)
        {
          console.log("Couldn't update bytesPerDay for user.");
          return {
            statusCode: 500,
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({"message": `Could not update bytesPerDay for user with error: ${err.message}`})
          }
        }
      }
    }

    const newDeliveryTime = body.deliveryTime ?? null;
    if (newDeliveryTime)
    {
      // check to see if anything in the schedule changed
      var sameDeliveryTimes = true;

      if (newBytesPerDay != user.bytesPerDay)
      {
        sameDeliveryTimes = false;
      }
      else 
      {
        for (var i = 0; i < newBytesPerDay; i++)
        {
          if (user.deliveryTime[i].hour != newDeliveryTime[i].hour || user.deliveryTime[i].minute != newDeliveryTime[i].minute)
          {
            sameDeliveryTimes = false;
            break;
          }
        }
      }

      // Update preferences in DynamoDB
      try 
      {
        const deliveryTimeUpdateCommand = new UpdateCommand({
          TableName: USERS_TABLE,
          Key: { userId: USER_ID},
          UpdateExpression: "SET deliveryTime = :t",
          ExpressionAttributeValues: { ":t": newDeliveryTime }
        });

        await docClient.send(deliveryTimeUpdateCommand);
        console.log("deliveryTime updated to  ",  newDeliveryTime, "for user: ", USER_ID);
      }
      catch (err)
      {
        console.log("Error updating deliveryTime: ", err.message)
        return {
          statusCode: 500,
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({"message": `Error updating deliveryTime with error: ${err.message}`})
        }
      }

      // kill the existig schedules
      if (sameDeliveryTimes == false)
      {
        for (var i = 0; i < user.bytesPerDay; i++)
        {
          try 
          {
            const deleteScheduleCommand = new DeleteScheduleCommand({
              Name: USER_ID + "_" + i,
              GroupName: "DailyBytes"
            });

            await schedulerClient.send(deleteScheduleCommand);
            console.log("Deleted schedule: ", USER_ID + "_" + i);
          }
          catch (err)
          {
            console.log("Error deleting schedule at index: ",i, err.message);
            return {
              statusCode: 500,
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({"message": `Error with deleting old schedules at index ${i} with error: ${err.message}`})
            }
          }
        }

        // create the new schedules
        for (var i = 0; i < newBytesPerDay; i++)
        {
          try
          {
            const scheduler = new CreateScheduleCommand({
              Name: USER_ID + "_" + i,
              GroupName: "DailyBytes",
              ScheduleExpression: `cron(${newDeliveryTime[i].minute} ${newDeliveryTime[i].hour} * * ? *)`,
              ScheduleExpressionTimezone: user.timeZone,
              FlexibleTimeWindow: {
                Mode: "OFF", // required
              },
              Target: {
                Arn: GENERATE_SINGLE_BYTE_ARN, // required
                RoleArn: GENERATE_SINGLE_BYTE_ROLE_ARN, // required
                Input: JSON.stringify({ userId: USER_ID, notify: true }) // userId passed as the payload of the body, which can be used in the GenerateSingleByte, notice { ... } is the event object in the receiving funtion.
              }
            })
            await schedulerClient.send(scheduler);
          }
          catch (err)
          {
            console.log("Error with creating new schedules at index: ", i, err.message);
            return {
              statusCode: 500,
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({"message": `Error with creating new schedules at index ${i} with error: ${err.message}`})
            }
          }
        }
      }
    }

    // If no change is found among the fields
    if (!newTopic && !newBytesPerDay && !newDeliveryTime)
    {
      console.log("Can't find any changes in the submitted change request");
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ "message": "Can't find any changes in the submitted change request" })
      }
    }
    
    // Successful change
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ "message": "Successfully updated fields for user" })
    }
  }
  catch (err)
  {
    console.log('Error: ', err.message);
    return {
      statusCode: 500,
      headers: {
        "Content-Type":  "application/json"
      },
      body: JSON.stringify({"message": err.message})
    }
  }
};
