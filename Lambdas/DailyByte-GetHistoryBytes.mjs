import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = "DailyByte-Bytes";
const MAX_BYTES_PER_DAY = 3;
const NUMBER_OF_DAYS_COVERED = MAX_BYTES_PER_DAY * 20;

export const handler = async (event) => {
  const USER_ID = event.requestContext.authorizer.jwt.claims.sub;
  // const USER_ID = "1c0e8486-d041-70b8-05cb-c2fc4a01ded3";

  try {
    const command = new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: "userId = :uid",
      ExpressionAttributeValues: { ":uid": USER_ID },
      ScanIndexForward: false,
      Limit: NUMBER_OF_DAYS_COVERED,
    });

    const response = await docClient.send(command);

    const pastBytes = [];
    const items = response.Items ?? [];
    for (var i = 0; i < items.length; i++) {
      const item = items[i];
      pastBytes.push(item);
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pastBytes),
    };
  } catch (err) {
    console.error("DynamoDB error:", err);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Could not fetch bytes history." }),
    };
  }
};
