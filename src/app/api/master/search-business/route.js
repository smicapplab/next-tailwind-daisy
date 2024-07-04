import { genericQuery } from "@/helpers/dynamo-db";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { keyword } = await request.json();
  try {    
    const params = {
      TableName: "Master",
      IndexName: "pkSearch-skSearch-index",
      KeyConditionExpression: `pkSearch = :pkSearch AND begins_with( skSearch, :skSearch )`,
      ExpressionAttributeValues: {
        ":pkSearch": "business-info",
        ":skSearch": keyword.toLowerCase(),
      },
      limit: 20,
    };

    const hits = await genericQuery({
      params,
    });

    return NextResponse.json({
      success: true,
      hits: hits.Items || [],
    });
  } catch (e) {
    console.error("error", e);
    return NextResponse.json({ success: false, error: e });
  }
}