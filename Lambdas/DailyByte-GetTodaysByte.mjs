import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = "DailyByte-Bytes";

export const handler = async (event) => {
  const USER_ID = event.requestContext.authorizer.jwt.claims.sub;
  // const USER_ID = "1c0e8486-d041-70b8-05cb-c2fc4a01ded3";

  try {
    const command = new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: "userId = :uid",
      ExpressionAttributeValues: { ":uid": USER_ID },
      ScanIndexForward: false,
      Limit: 1,
    });

    const response = await docClient.send(command);
    // const now = new Date().toISOString();

    // var current = null;

    const items = response.Items ?? [];
    // return items;
    const item = items[0];

    if (!item) {
      return {
        statusCode: 404,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "No bytes found." }),
      };
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    };
    
  } catch (err) {
    console.error("DynamoDB error:", err);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Could not fetch today's byte." }),
    };
  }
};
