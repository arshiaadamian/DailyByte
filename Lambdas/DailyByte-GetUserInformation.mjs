import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = 'DailyBytes-Users';

export const handler = async (event) => {
  // TODO implement
  const USER_ID = event.requestContext.authorizer.jwt.claims.sub;
  // const USER_ID = 'ac6ef4e6-e081-7026-8002-bb8ded79b217';

  try {
    const command = new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: "userId = :uid",
      ExpressionAttributeValues: { ":uid": USER_ID },
      ScanIndexForward: false,
    });

    const response = await docClient.send(command);
    const item = response.Items[0];
    
    const information = {
      active: item.active,
      bytesPerDay: item.bytesPerDay,
      createdAt: item.createdAt,
      email: item.email,
      timeZone: item.timeZone,
      topic: item.topic,
      deliveryTime: item.deliveryTime
    };

    // return information;

    return {
      statusCode: 200,
      headers:
      { 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify( {message: information} )
    };
  }
  catch(err)
  {
    console.log("Error: ", err);
    return {
      statusCode: 500,
      headers: 
      {
        "Content-Type": "application/json"
      },
      body: JSON.stringify( {message: "Internal error getting your information"} )
    }
  }
  
};
