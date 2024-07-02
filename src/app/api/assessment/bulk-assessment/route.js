import { findByIndex } from "@/helpers/dynamo-db";
import { NextResponse } from "next/server";
import { runScore } from "../run-score/route";

export async function POST(request) {
  const reqObj = await request.json();
  const { selectedRows } = reqObj;
  try {
    for (let selectedRow of selectedRows) {
      const note = await findByIndex({
        indexName: "gsi1-index",
        query: { gsi1: selectedRow },
        tableName: "Demo",
        limit: 20,
      });

      if( note.Items && note.Items.length > 0){
        const noteToAssess = note.Items[0];
        await runScore(noteToAssess)
      }
    }

    return NextResponse.json({
      success: true,
    });
  } catch (e) {
    console.error("error", e);
    return NextResponse.json({ success: false, error: e });
  }
}
