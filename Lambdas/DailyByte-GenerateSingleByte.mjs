import { BedrockRuntimeClient, ConverseCommand } from '@aws-sdk/client-bedrock-runtime';


import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand, PutCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';

// Bedrock
const bedrockClient = new BedrockRuntimeClient({ region: 'ca-west-1' });

// DynamoDB
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const USERS_TABLE = 'DailyBytes-Users';
const BYTES_TABLE = 'DailyByte-Bytes'; 

// strips markdown fences if the model added them, then parses
function extractJson(text)
{
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");

  if (start === -1 || end === -1)
  {
    throw new Error("No JSON object found in model output");
  }

  return JSON.parse(text.slice(start, end + 1));
}

async function getRecentTitles(userId, tableName, topic)
{
  const query = {
    TableName: tableName,
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId
    },
    ProjectionExpression: 'title, topic',
    ScanIndexForward: false,
    Limit: 60
  }

  const command = new QueryCommand(query);
  const response = await docClient.send(command);
  
  const items = response.Items ?? [];
  return items
    .filter(item => item.topic === topic)
    .slice(0, 30);
}

const TOPIC_GUIDANCE = {
  "Personal Finance": "Build toward practical competence: how compounding works, what fees cost over time, how debt and credit behave, tax-advantaged accounts, how inflation erodes savings. Concrete mechanics over motivation. Never give specific investment recommendations or name individual securities.",
  "Psychology": "Focus on specific, well-replicated findings and mechanisms — how memory encodes and fails, why groups behave differently than individuals, documented cognitive biases, how attention actually works. Avoid pop-psych claims, avoid anything resembling personal diagnosis, and avoid studies known to have failed replication.",
  "Space & Astronomy": "Favor the concrete and the physical: how a specific object behaves, what a mission actually found, why a phenomenon looks the way it does. Scale and distance are your best tools — make the numbers felt. Avoid speculation about aliens and avoid restating that space is big.",
  "World History": "One specific event, decision, person, or practice per byte — not an era or a war in summary. Favor the causal and the surprising: why something happened, what it changed, what people at the time actually did. Range widely across regions and centuries, not just Europe and the last 200 years.",
  "Nutrition Science": "Mechanisms and evidence: how nutrients are absorbed, what a study actually showed versus how it was reported, why food claims persist past their evidence. Never personalized diet advice, never calorie or macro targets, never weight-loss framing.",
  "Cooking & Food Science": "Explain why techniques work — heat transfer, protein structure, emulsions, fermentation, salt and acid. Every byte should make the reader cook something slightly better. Favor the counterintuitive over the standard tip.",
  "Philosophy": "Concrete problems and arguments, not schools or biography. What a thought experiment actually asks, why it resists an easy answer, what accepting it would change. Never summarize a philosopher's whole view, never resolve a genuinely contested question as though settled.",
  "Etymology & Word Origins": "One word or phrase per byte. Where it came from, how the meaning shifted, and the surprising part. Prioritize words people use constantly without knowing the history. Include the intermediate steps when the drift is the interesting bit.",
  "Sleep & Energy": "Mechanisms behind sleep, circadian rhythm, alertness, and recovery — what adenosine does, why light timing matters, what happens in each sleep stage. Practical implications are welcome. Never diagnose sleep disorders, never recommend supplements or dosages.",
  "Geopolitics": "Explain how things work — chokepoints, sanctions mechanics, alliance structures, resource dependencies, why borders sit where they do. Structural and historical rather than commentary on live conflicts. No predictions, no taking sides on active disputes."
};

export const handler = async (event) => {
  // TODO implement
  // const USER_ID = '0cfee476-4011-706b-585c-c90bcf7bcc3b';
  const USER_ID = event.requestContext?.authorizer?.jwt?.claims?.sub ?? event.userId;

  if (!USER_ID)
  {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "No user identified" })
    };
  }

  // Bedrock
  const modelId = "global.anthropic.claude-haiku-4-5-20251001-v1:0";

  try 
  {
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

    if (!dynamoDBResponse.Items?.[0]?.topic)
    {
      return {
        statusCode: 400,
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({message: "No topic set to generate bytes for."})
      };
    }

    const topic = dynamoDBResponse.Items[0].topic;

    // get all the topics already covered for the user
    const bytes = await getRecentTitles(USER_ID, BYTES_TABLE, topic);
      
    var titleHistory = [];
    for (var j = bytes.length - 1; j >= 0; j--)
    {
      titleHistory.push("- " + bytes[j].title);
    }

    const guidance = TOPIC_GUIDANCE[topic] ?? "";
    let userPrompt = "You write daily learning 'bytes' for a mobile app. Over weeks, the bytes should add up — a reader who has seen 30 of them should genuinely understand the topic better, not just know 30 disconnected facts.\n\n" +
              "Topic: " + topic + "\n\n" +
              (guidance ? "How to approach this topic: " + guidance + "\n" : "") + "\n" +
              "Pick ONE specific thing within this topic — a mechanism, a counterintuitive fact, a technique, a piece of history. Not an overview, not a definition of the topic itself.\n\n" +
              "Lead with the interesting part. Do not build up to it.\n\n" +
              "Return ONLY a JSON object with exactly these keys: 'title', 'body', 'sourceQuery'.\n" +
              "title: a specific hook, under 60 characters. Name the actual thing, not a vague tease.\n" +
              "body: 2-3 sentences, under 300 characters. Plain English. Explain any jargon you use. End with the point, not a summary.\n" +
              "sourceQuery: a short search phrase someone would type to read more, e.g. 'Maillard reaction browning food'\n\n" +
              "Avoid: generic overviews, motivational filler, phrases like 'did you know' or 'fascinatingly', and closing sentences that restate what you just said.\n\n" +
              "Do not wrap the JSON in markdown fences. Do not add any text before or after the JSON.";

    if (titleHistory.length > 0)
    {
      userPrompt += "\n\nThis reader has already learned the following, oldest first:\n" + titleHistory.join("\n") +
                    "\n\nBuild on this. Assume they understand these and go deeper or wider — a concept that follows naturally from what they know, or a new area of the topic they haven't reached yet. Do not re-teach anything above. You may reference it in passing if it helps explain something new.";
    }
    else
    {
      userPrompt += "\n\nThis is the reader's first byte on this topic. Start with something foundational — a concept that other things in this topic build on — but still make it specific and surprising, not a definition.";
    }
    console.log("User Prompt is: " + userPrompt);

    const conversation = [
      {
        role: "user",
        content: [{ text: userPrompt }]
      }
    ];

    const bedrockCommand = new ConverseCommand({
      modelId,
      messages: conversation,
      inferenceConfig: {
        maxTokens: 500,
        temperature: 0.6,
      }
    });

    const bedrockResponse = await bedrockClient.send(bedrockCommand);

    const bedrockResponseText = extractJson(bedrockResponse.output.message.content[0].text);

    const today = new Date().toISOString().split('T')[0];
    const now = new Date().toISOString();

    const timeSuffix = now.slice(11, 19).replace(/:/g, "");
    // write it to dynamoDB
    const newByte = {
      TableName: BYTES_TABLE,
      Item: {
        userId: USER_ID,
        date: today + "#" + timeSuffix,
        topic: topic,
        title: bedrockResponseText.title,
        body: bedrockResponseText.body,
        sourceURL: 'https://www.google.com/search?q=' + encodeURIComponent(bedrockResponseText.sourceQuery),
      }
    };

    await docClient.send(new PutCommand(newByte));

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({message: "Byte Successfully Created", byte: bedrockResponseText})
    };
  }
  catch(err)
  {
    console.log("Error: ", err.message);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({message: err.message})
    };
  }
  
};
