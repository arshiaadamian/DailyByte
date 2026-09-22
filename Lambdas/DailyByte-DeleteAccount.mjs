import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, DeleteCommand, QueryCommand, BatchWriteCommand } from "@aws-sdk/lib-dynamodb";
import { SchedulerClient, DeleteScheduleCommand } from "@aws-sdk/client-scheduler";
import { CognitoIdentityProviderClient, AdminDeleteUserCommand } from "@aws-sdk/client-cognito-identity-provider";

// dynamoDB
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

// EventBridge schedules
const schedulerClient = new SchedulerClient({});

// Cognito
const cognitoClient = new CognitoIdentityProviderClient({});

const USER_TABLE = "DailyBytes-Users";
const BYTES_TABLE = "DailyByte-Bytes";
const SCHEDULE_GROUP = "DailyBytes";
const USER_POOL_ID = "ca-west-1_l7hLXLf0O";

// Schedules are named {userId}_{slot}, 0-based, and a user can have at most 3.
// We try every slot rather than reading bytesPerDay first, so a stale or partly
// written row can't leave an orphaned schedule firing forever.
const MAX_SLOTS = 3;

// BatchWriteItem takes at most 25 requests per call.
const BATCH_LIMIT = 25;

export const handler = async (event) => {
  const claims = event.requestContext?.authorizer?.jwt?.claims;
  const USER_ID = claims?.sub ?? event.userId;
  // federated users (Google, Apple) get a prefixed username, e.g. google_1234,
  // which is what AdminDeleteUser needs - `sub` is not accepted here.
  const USERNAME = claims?.["cognito:username"];

  if (!USER_ID)
  {
    return json(401, { message: "Not signed in" });
  }

  // Order matters. Cognito goes last: while the account still exists the user can
  // sign in and retry, but if we removed it first and a later step failed they'd
  // be left with rows nothing can reach or clean up.

  // 1. schedules
  for (let i = 0; i < MAX_SLOTS; i++)
  {
    try
    {
      const deleteScheduleCommand = new DeleteScheduleCommand({
        Name: USER_ID + "_" + i,
        GroupName: SCHEDULE_GROUP
      });
      await schedulerClient.send(deleteScheduleCommand);
      console.log("Deleted schedule: ", USER_ID + "_" + i);
    }
    catch (err)
    {
      // a user on 1 byte a day simply has no slot 1 or 2
      if (err.name === "ResourceNotFoundException")
      {
        continue;
      }
      console.log("Error deleting schedule at index: ", i, err.message);
      return json(500, { message: "Could not delete your delivery schedules" });
    }
  }

  // 2. every byte ever generated for them
  try
  {
    await deleteAllBytes(USER_ID);
  }
  catch (err)
  {
    console.log("Error deleting bytes", err);
    return json(500, { message: "Could not delete your bytes" });
  }

  // 3. the profile row
  try
  {
    const dynamoDBCommand = new DeleteCommand({
      TableName: USER_TABLE,
      Key: {
        userId: USER_ID
      }
    });
    await docClient.send(dynamoDBCommand);
    console.log("Deleted user row: ", USER_ID);
  }
  catch (err)
  {
    console.log("Error deleting user", err);
    return json(500, { message: "Could not delete your account" });
  }

  // 4. the Cognito account
  try
  {
    const adminDeleteUserCommand = new AdminDeleteUserCommand({
      UserPoolId: USER_POOL_ID,
      Username: USERNAME
    });
    await cognitoClient.send(adminDeleteUserCommand);
    console.log("Deleted cognito user: ", USERNAME);
  }
  catch (err)
  {
    // already gone on a retry - the row and schedules are cleared, so treat it as done
    if (err.name === "UserNotFoundException")
    {
      console.log("Cognito user already gone: ", USERNAME);
      return json(200, { message: "User deleted successfully" });
    }
    console.log("Error deleting cognito user", err);
    return json(500, { message: "Could not delete your sign-in details" });
  }

  return json(200, { message: "User deleted successfully" });
};

// The bytes table is PK userId / SK date, so one query walks a single user's rows.
// Only the keys are projected - nothing else is needed to delete them - and each
// page is deleted before the next is fetched, so memory stays flat no matter how
// long the user has been around.
async function deleteAllBytes(userId)
{
  let startKey;

  do
  {
    const queryCommand = new QueryCommand({
      TableName: BYTES_TABLE,
      KeyConditionExpression: "userId = :uid",
      ExpressionAttributeValues: { ":uid": userId },
      ProjectionExpression: "userId, #d",
      // `date` is a DynamoDB reserved word
      ExpressionAttributeNames: { "#d": "date" },
      ExclusiveStartKey: startKey
    });

    const page = await docClient.send(queryCommand);
    const items = page.Items ?? [];

    for (let i = 0; i < items.length; i += BATCH_LIMIT)
    {
      const chunk = items.slice(i, i + BATCH_LIMIT);
      let requests = chunk.map(item => ({
        DeleteRequest: { Key: { userId: item.userId, date: item.date } }
      }));

      // BatchWrite can partially succeed and hand back what it skipped, so the
      // leftovers are retried until the table accepts them.
      let attempt = 0;
      while (requests.length > 0)
      {
        const batchWriteCommand = new BatchWriteCommand({
          RequestItems: { [BYTES_TABLE]: requests }
        });
        const result = await docClient.send(batchWriteCommand);
        requests = result.UnprocessedItems?.[BYTES_TABLE] ?? [];

        if (requests.length > 0)
        {
          attempt++;
          if (attempt > 5)
          {
            throw new Error("BatchWrite kept returning unprocessed items");
          }
          await new Promise(resolve => setTimeout(resolve, 100 * attempt));
        }
      }
    }

    console.log("Deleted bytes page: ", items.length);
    startKey = page.LastEvaluatedKey;
  }
  while (startKey);
}

function json(statusCode, payload)
{
  return {
    statusCode: statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  };
}
