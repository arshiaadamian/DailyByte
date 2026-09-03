import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";
import { SchedulerClient, CreateScheduleCommand } from "@aws-sdk/client-scheduler";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

// Trigger generateSingleByteLambda
const lambdaClient = new LambdaClient({});
const LAMBDA_FUNCTION = "DailyByte-GenerateSingleByte";

// Create EventBridge schedules
const schedulerClient = new SchedulerClient({});
const GENERATE_SINGLE_BYTE_ARN = 'arn:aws:lambda:ca-west-1:992839646265:function:DailyByte-GenerateSingleByte';
const GENERATE_SINGLE_BYTE_ROLE_ARN = "arn:aws:iam::992839646265:role/DailyBytes-DailyByteGenerationScheduler";

const TABLE_NAME = 'DailyBytes-Users';


export const handler = async (event) => {
  // TODO implement

  // data coming from cognito
  const userId = event.request.userAttributes.sub;
  const email = event.request.userAttributes.email;
  const meta = event.request.clientMetadata;
  console.log("metadata is: ", JSON.stringify(meta));
  const selectedTopic = meta.selectedTopic;
  const bytesPerDay = parseInt(meta.bytesPerDay);
  const deliveryTime = JSON.parse(meta.deliveryTime);
  const timeZone = meta.timeZone;

  const now = new Date().toISOString().split("T")[0];
  console.log("request is: ", event.request);

  try 
  {
    const newUser = {
      TableName: TABLE_NAME,
      Item: {
        userId: userId,
        active: true,
        bytesPerDay: bytesPerDay,
        email: email,
        timeZone: timeZone,
        topic: selectedTopic,
        createdAt: now, 
        deliveryTime: deliveryTime
      },
      // This prevents from overwritting a field in the users table, if it already exists
      ConditionExpression: "attribute_not_exists(userId)"
    }

     await docClient.send(new PutCommand(newUser));

     console.log('user successfully created: ', newUser.Item);

     // call the generate single byte lambda for the newly created user
     if(selectedTopic)
     {
      try
      {
        const generateByteInvokeCommand = new InvokeCommand({
          FunctionName: LAMBDA_FUNCTION,
          InvocationType: "Event",
          Payload: JSON.stringify({ userId: userId })
        });
        await lambdaClient.send(generateByteInvokeCommand);

      }
      catch (err)
      {
        console.error("Failed to invoke GenerateSingleByte lambda:", err);
      }
    }
  }
  catch (err)
  {
    if (err.name === "ConditionalCheckFailedException") {
      console.log("User row already exists for", userId);
    } else {
      console.error("Failed to create user row:", err);
    }
  }

  try
  {
    // Create EventBridge schedules
    for (let i = 0; i < bytesPerDay; i++)
    {
      const scheduler = new CreateScheduleCommand({
        Name: userId + "_" + i,
        GroupName: "DailyBytes",
        ScheduleExpression: `cron(${deliveryTime[i].minute} ${deliveryTime[i].hour} * * ? *)`,
        ScheduleExpressionTimezone: timeZone,
        FlexibleTimeWindow: {
          Mode: "OFF", // required
        },
        Target: {
          Arn: GENERATE_SINGLE_BYTE_ARN, // required
          RoleArn: GENERATE_SINGLE_BYTE_ROLE_ARN, // required
          Input: JSON.stringify({ userId }) // userId passed as the payload of the body, which can be used in the GenerateSingleByte, notice { ... } is the event object in the receiving funtion.
        }
      })
      await schedulerClient.send(scheduler);
    }
  }
  catch (err)
  {
    console.error("Failed to create schedule:", err);
  }

  // return is mandatory, Cognito after triggering the lambda, waits for function to return, otherwise it wouldn't complete signup.
  return event;
  
};
