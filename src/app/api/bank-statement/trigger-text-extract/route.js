import { updateOne } from "@/helpers/dynamo-db";
import { getPresignedUploadUrl } from "@/helpers/S3Helper";
import { startTextExtractAsync } from "@/helpers/TextractHelper";
import { FeatureType } from "@aws-sdk/client-textract";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { fileName, originalFilename, issuer, dateRange, bank } = await request.json();
  const key = `bank-statement/${issuer.businessName.replace(/\s+/g, '-').toLowerCase()}/${fileName}`;
  try {

    const response = await startTextExtractAsync({
      fileName: key,
      featureTypes: [FeatureType.FORMS, FeatureType.TABLES],
      bucket: process.env.BUCKET_ISSUER_DOC,
    });

    await updateOne({
      tableName: "Master",
      item: {
        pk: "statements",
        sk: new Date().toISOString(),
        pkSearch: "statements",
        skSearch: response.JobId,
        fileName, originalFilename, issuer, dateRange, bank,
        pkStatus: "status",
        skStatus: "PENDING"
      },
    });

    return NextResponse.json({
      success: true,
      jobId: response.JobId,
    });
  } catch (error) {
    console.error("++++++++++++++++++++++++++++++++++");
    console.error("Error generating pre-signed URL:", error);
    console.error("++++++++++++++++++++++++++++++++++");
    return NextResponse.json({ success: false, error: "Failed to generate pre-signed URL" });
  }
}
