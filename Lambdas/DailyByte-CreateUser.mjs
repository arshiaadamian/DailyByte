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

// API Gateway POST /user. Replaces the PostConfirmation trigger as the one place a
// profile row is created. Cognito's trigger only ever fired for email signups, so
// Google users never got a row - this runs for anyone holding a valid JWT.
export const handler = async (event) => {
  // identity comes from the verified token, never from the body
  const claims = event.requestContext.authorizer.jwt.claims;
  const userId = claims.sub;
  const email = claims.email;

  let body;
  try
  {
    body = JSON.parse(event.body ?? "{}");
  }
  catch (err)
  {
    return json(400, { message: "Invalid request body" });
  }

  const topic = body.topic;
  const bytesPerDay = parseInt(body.bytesPerDay);
  const deliveryTime = body.deliveryTime;
  const timeZone = body.timeZone;
  const pushToken = body.pushToken;

  if (!topic || !timeZone || !Array.isArray(deliveryTime) || !bytesPerDay)
  {
    return json(400, { message: "Missing onboarding preferences" });
  }

  if (deliveryTime.length < bytesPerDay)
  {
    return json(400, { message: "Not enough delivery times for the requested bytes per day" });
  }

  const now = new Date().toISOString().split("T")[0];

  const newUser = {
    TableName: TABLE_NAME,
    Item: {
      userId: userId,
      active: true,
      bytesPerDay: bytesPerDay,
      email: email,
      timeZone: timeZone,
      topic: topic,
      createdAt: now,
      deliveryTime: deliveryTime,
      pushToken: pushToken
    },
    // This prevents from overwritting a field in the users table, if it already exists
    ConditionExpression: "attribute_not_exists(userId)"
  };

  try
  {
    await docClient.send(new PutCommand(newUser));
    console.log('user successfully created: ', newUser.Item);
  }
  catch (err)
  {
    // a retry after a partial success, or a double tap on Continue. The row is the
    // client's gate, so report success and let it move on rather than stranding them.
    if (err.name === "ConditionalCheckFailedException")
    {
      console.log("User row already exists for", userId);
      return json(200, { message: "Profile already exists" });
    }
    console.error("Failed to create user row:", err);
    return json(500, { message: "Could not create your account" });
  }

  // from here the row exists, so nothing below is allowed to fail the request

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
          Input: JSON.stringify({ userId, notify: true }) // userId passed as the payload of the body, which can be used in the GenerateSingleByte, notice { ... } is the event object in the receiving funtion.
        }
      })
      await schedulerClient.send(scheduler);
    }
  }
  catch (err)
  {
    console.error("Failed to create schedule:", err);
  }

  try
  {
    // give the new user a first byte straight away
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

  return json(201, { message: "Profile created" });
};

function json(statusCode, payload)
{
  return {
    statusCode: statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  };
}
