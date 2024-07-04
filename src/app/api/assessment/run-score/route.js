import { NextResponse } from "next/server";
import { CheckLegalRequirement } from "./LegalCompliance";
import {
  riskRating1,
  riskRating2,
  riskRating3,
  riskRating4,
} from "./RiskRating";
import { findOne, updateOne } from "@/helpers/dynamo-db";

const handleParameter = (param) => {
  if (typeof param === "string") {
    const parsedValue = parseFloat(param);
    if (!isNaN(parsedValue)) {
      return parsedValue;
    } else {
      throw new Error(
        "Invalid input: the string could not be parsed to a float"
      );
    }
  } else if (typeof param === "number") {
    return param;
  } else {
    throw new Error("Invalid input: the parameter must be a string or a float");
  }
};

export const runScore = async (noteToAssess) => {
  const {
    pk,
    sk,
    industry,
    paymentUnderlying,
    bankDebt = 0,
    documents,
    isNew,
    aml,
    nfis,
    cmap,
    fieldSurvey,
  } = noteToAssess;

  try {
    const record = await findOne({
      pk,
      sk,
      tableName: "Demo",
    });

    let decision = [];
    let rejectFlags = [];

    const legalReqCompliance = CheckLegalRequirement({ documents });

    if (!legalReqCompliance.isPass) {
      decision.push("RejectLRC");
    }

    if (fieldSurvey !== "Pass") {
      decision.push("FieldSurvey");
      rejectFlags.push({
        DecisionStage: "2EC",
        Variable: "FieldSurvey",
        Value: `fieldSurvey value ${fieldSurvey}`,
      });
    }

    if (aml !== "Pass") {
      decision.push("Reject3TC");
      rejectFlags.push({
        DecisionStage: "3TC",
        Variable: "AML Check",
        Value: `AML value ${aml}`,
      });
    }

    if (cmap !== "Pass") {
      decision.push("Reject3TC");
      rejectFlags.push({
        DecisionStage: "3TC",
        Variable: "CMAP Check",
        Value: `CMAP value ${cmap}`,
      });
    }

    if (nfis !== "Pass") {
      decision.push("Reject3TC");
      rejectFlags.push({
        DecisionStage: "3TC",
        Variable: "NFIS Check",
        Value: `NFIS value ${nfis}`,
      });
    }

    const paymentUnderlyingScore =
      paymentUnderlying === "Common"
        ? { attribute: "Common Underlying", partialScore: 73.46 }
        : { attribute: "Solid Underlying", partialScore: 90.27 };

    const customerType = isNew
      ? { attribute: "New", partialScore: 60.56 }
      : { attribute: "Recurring", partialScore: 87.77 };

    const industryLevel = {
      partialScore: industry.industryScore,
      attribute: industry.level,
    };

    const { dscr, currentRatio, debtEquityRatio, dpd30os, totalAvgCredits } =
      record.score;

    let totalScore =
      customerType.partialScore +
      industryLevel.partialScore +
      paymentUnderlyingScore.partialScore +
      dscr.partialScore +
      currentRatio.partialScore +
      debtEquityRatio.partialScore +
      dpd30os.partialScore +
      totalAvgCredits.partialScore;

    totalScore = totalScore.toFixed(2);

    const score = {
      decision: [...new Set(decision)].join(", "),
      isManual: false,
      paymentUnderlying: paymentUnderlying,
      rejectFlags,
      dscr,
      customerType,
      industryLevel,
      paymentUnderlyingScore,
      legalComplianceFlags: legalReqCompliance.legalComplianceFlags,
      currentRatio,
      decisionStage: "5SC",
      dpd30os,
      debtEquityRatio,
      totalAvgCredits,
      runDate: new Date().toISOString(),
      color: dpd30os.attribute !== "NULL" ? "BLACK" : isNew ? "GRAY" : "WHITE",

      totalScore,
      riskRating1: riskRating1(totalScore),
      riskRating2: riskRating2(totalScore),
      riskRating3: riskRating3(totalScore),
      riskRating4: riskRating4(totalScore),
    };

    await updateOne({
      tableName: "Demo",
      item: {
        pk,
        sk,
        fieldSurvey,
        paymentUnderlying,
        nfis,
        aml,
        cmap,
        loanStatus: "done",
        loanStatusSk: new Date().toISOString(),
        score,
        industry: {
          ...industry,
          industryScore: handleParameter(industry.industryScore),
        },
        bankDebt: handleParameter(bankDebt),
      },
    });

    return score;
  } catch (err) {
    return null;
  }
};

export async function POST(request) {
  const reqObj = await request.json();

  const score = await runScore(reqObj.noteToAssess);
  if (score) {
    return NextResponse.json({
      success: true,
      score,
    });
  }

  return NextResponse.json({ success: false, error: e });
}
