const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const getS3CLient = () => {
  let credentials = {};
  if (process.env.EXT_ACCESS_KEY_ID && process.env.EXT_SECRET_ACCESS_KEY) {
    credentials = {
      credentials: {
        accessKeyId: process.env.EXT_ACCESS_KEY_ID,
        secretAccessKey: process.env.EXT_SECRET_ACCESS_KEY,
      },
    };
  }

  const s3Client = new S3Client({
    region: "ap-southeast-1",
    ...credentials
  });
  return s3Client;
};

const uploadToS3 = async ({ buffer, fileName, bucket }) => {
  const s3Client = getS3CLient();
  try {
    const checkUpload = new Upload({
      client: s3Client,
      params: {
        Bucket: bucket,
        Key: fileName,
        Body: buffer,
      },
    });

    checkUpload.on("httpUploadProgress", (progress) => {
      console.log(progress);
    });

    await checkUpload.done();
  } catch (e) {
    console.error("uploadToS3 ---->", { e });
  }
};

const getPresignedUploadUrl = async ({ bucket, path, fileName }) => {
  const s3Client = getS3CLient();
  try {
    let command = new PutObjectCommand({
      Bucket: bucket ? bucket : process.env.investreeAppDocumentBucket,
      Key: `${path ? `${path}/` : ""}${fileName || ""}`,
    });

    const uploadUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });

    return { success: true, uploadUrl };
  } catch (error) {
    return {
      success: false,
      uploadUrl: "",
      message: error.Error ? error.Error : error.message || error,
    };
  }
};

const getPresignedDownloadUrl = async ({ bucket, key, expiresIn = 3600 }) => {
  const s3Client = getS3CLient();
  try {
    let command = new GetObjectCommand({
      Bucket: bucket ? bucket : process.env.investreeAppDocumentBucket,
      Key: key,
    });

    const downloadUrl = await getSignedUrl(s3Client, command, {
      expiresIn: expiresIn,
    });

    return { success: true, downloadUrl };
  } catch (error) {
    return {
      success: false,
      uploadUrl: "",
      message: error.Error ? error.Error : error.message || error,
    };
  }
};

export { uploadToS3, getPresignedUploadUrl, getPresignedDownloadUrl };
