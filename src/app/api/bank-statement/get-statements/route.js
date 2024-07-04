import { find, genericQuery } from "@/helpers/dynamo-db";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {    
    const data = await find({
      tableName: "Master",
      pk: "statements",
      limit: 20,
      sort: "DESC"
    })

    return NextResponse.json({
      success: true,
      statements: data.Items || [],
    });
  } catch (e) {
    console.error("error", e);
    return NextResponse.json({ success: false, error: e });
  }
}