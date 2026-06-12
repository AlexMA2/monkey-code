import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient, TABLE_NAME } from "@/_utils/aws";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      wpm,
      cpm,
      accuracy,
      errorCount,
      elapsedTime,
      language,
      mode,
      snippetName,
      timestamp,
    } = body;

    // Validate request body
    if (
      typeof wpm !== "number" ||
      typeof accuracy !== "number" ||
      typeof errorCount !== "number" ||
      typeof elapsedTime !== "number" ||
      !language ||
      !mode ||
      !snippetName
    ) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
    }

    // Use provided timestamp or current time
    const resultTimestamp = timestamp ? new Date(timestamp).toISOString() : new Date().toISOString();
    
    // Generate a unique ID for this specific try to avoid overwriting user attempts
    const attemptId = crypto.randomUUID();

    const item = {
      id: attemptId, // Unique Primary Key matching schema
      userId,        // Reference to owner
      timestamp: resultTimestamp,
      wpm,
      cpm,
      accuracy,
      errorCount,
      elapsedTime,
      language,
      mode,
      snippetName,
    };

    // Save to AWS DynamoDB
    await ddbDocClient.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: item,
      })
    );

    return NextResponse.json({ success: true, item });
  } catch (error: any) {
    console.error("Error saving result to AWS DynamoDB:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}

// GET: Fetch previous results for the logged-in user
export async function GET(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse search params
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam, 10) : 100;
    const lastKeyParam = searchParams.get("lastKey");

    let exclusiveStartKey: any = undefined;
    if (lastKeyParam) {
      try {
        exclusiveStartKey = JSON.parse(Buffer.from(lastKeyParam, "base64").toString("utf-8"));
      } catch (e) {
        console.error("Failed to parse lastKey parameter:", e);
      }
    }

    // Query GSI userId-timestamp-index for user's results
    const data = await ddbDocClient.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        IndexName: "userId-timestamp-index",
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: {
          ":userId": userId,
        },
        ScanIndexForward: false, // Descending by timestamp sort key
        Limit: limit,
        ExclusiveStartKey: exclusiveStartKey,
      })
    );

    const items = data.Items || [];
    let lastEvaluatedKey: string | null = null;
    if (data.LastEvaluatedKey) {
      lastEvaluatedKey = Buffer.from(JSON.stringify(data.LastEvaluatedKey)).toString("base64");
    }

    return NextResponse.json({ results: items, lastEvaluatedKey });
  } catch (error: any) {
    console.error("Error querying results from AWS DynamoDB:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
