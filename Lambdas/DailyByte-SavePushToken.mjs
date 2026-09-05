import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const USERS_TABLE = 'DailyBytes-Users';

export const handler = async (event) => {
  // TODO implement
  const USER_ID = event.requestContext?.authorizer?.jwt?.claims?.sub;
  console.log("userid is: ", USER_ID);
  console.log("event is ", event.body);
  const newPushToken = JSON.parse(event.body).pushToken;
  console.log("PuhsToken is: ", newPushToken);

  // DynamoDB
  const client = new DynamoDBClient({});
  const docClient = DynamoDBDocumentClient.from(client);

  // update the pushToken preference
  try
  {
    const pushTokenUpdateCommand = new UpdateCommand({
        TableName: USERS_TABLE,
        Key: {userId: USER_ID},
        UpdateExpression: "SET pushToken = :p",
        ExpressionAttributeValues: { ":p": newPushToken }
    });

    await docClient.send(pushTokenUpdateCommand);

    console.log("pushToken updated to: ", newPushToken);
  }
  catch (err)
  {
    console.log("Error updating pushToken to: ", newPushToken);
    return {
        statusCode: 500,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({message: `Problem updating the pushToken value: ${err.message}`})
    }
  }

  console.log("Successfully updated the pushToken.");
  return {
    statusCode: 200,
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({message: "Successfully updated the pushToken value"})
  }
    
};
