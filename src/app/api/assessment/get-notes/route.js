import { countRecordsByIndex, findByIndex } from "@/helpers/dynamo-db";
import { NextResponse } from "next/server";

export async function POST(request) {
  const reqObj = await request.json();
  const { loanStatus } = reqObj;
  try {
    const pendingRaw = await findByIndex({
      indexName: "loanStatus-loanStatusSk-index",
      query: { loanStatus: loanStatus },
      tableName: "Demo",
      limit: 20,
    });

    const pending = pendingRaw.Items.map((e) =>
      e.loanStatus === "done"
        ? { ...e }
        : {
            fieldSurvey: e.fieldSurvey,
            industry: e.industry,
            isNew: e.isNew,
            loanAmount: e.loanAmount,
            loanNumber: e.loanNumber,
            loanStatus: e.loanStatus,
            nfis: e.nfis,
            onGoingApplication: e.onGoingApplication,
            paymentUnderlying: e.paymentUnderlying,
            pk: e.pk,
            rm: e.rm,
            cm: e.cm,
            sk: e.sk,
            aml: e.aml,
            cmap: e.cmap,
            applicationDate: e.applicationDate,
            bankDebt: e.bankDebt,
            documents: e.documents,
            businessName: e.businessName,
            dpd30os: e.dpd30os,
          }
    );

    return NextResponse.json({
      success: true,
      notes: pending ? pending : [],
    });
  } catch (e) {
    console.error("error", e);
    return NextResponse.json({ success: false, error: e });
  }
}
