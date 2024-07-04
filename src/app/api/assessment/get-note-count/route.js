import { countRecordsByIndex, findByIndex } from "@/helpers/dynamo-db";
import { NextResponse } from "next/server";

export async function POST(request) {
  const reqObj = await request.json();
  const { loanStatus } = reqObj;
  try {
    const count = await countRecordsByIndex({
      indexName: "loanStatus-loanStatusSk-index",
      query: { loanStatus: loanStatus },
      tableName: "Demo",
    });

    return NextResponse.json({
      success: true,
      count,
    });
  } catch (e) {
    console.error("error", e);
    return NextResponse.json({ success: false, count: 0, error: e });
  }
}
