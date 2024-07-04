import { getPresignedUploadUrl } from "@/helpers/S3Helper";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { fileName, issuer } = await request.json();
  try {
    const uploadUrl = await getPresignedUploadUrl({
      bucket: process.env.BUCKET_ISSUER_DOC,
      path: `bank-statement/${issuer.businessName
        .replace(/\s+/g, "-")
        .toLowerCase()}`,
      fileName,
    });

    return NextResponse.json({
      ...uploadUrl
    });
  } catch (error) {
    console.error("++++++++++++++++++++++++++++++++++");
    console.error("Error generating pre-signed URL:", error.response);
    console.error("++++++++++++++++++++++++++++++++++");
    return NextResponse.json({ error: "Failed to generate pre-signed URL" });
  }
}
