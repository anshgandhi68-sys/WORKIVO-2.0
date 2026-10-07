import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const region = process.env.AWS_REGION || "ap-south-1";
const accessKeyId = process.env.AWS_ACCESS_KEY_ID || "";
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || "";
const bucketName = process.env.AWS_S3_BUCKET || "workivo-media-storage";

export const isAwsConfigured = Boolean(
  accessKeyId &&
  secretAccessKey &&
  accessKeyId.length > 5 &&
  secretAccessKey.length > 10
);

export const s3Client = isAwsConfigured
  ? new S3Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    })
  : null;

export async function createPresignedUploadUrl(
  filename: string,
  contentType: string,
  folder: "bookings" | "pros" | "receipts" = "bookings"
): Promise<{ uploadUrl: string; fileKey: string; simulated?: boolean }> {
  const timestamp = Date.now();
  const sanitized = filename.replace(/[^a-zA-Z0-9.-]/g, "_");
  const fileKey = `${folder}/${timestamp}-${sanitized}`;

  if (!isAwsConfigured || !s3Client) {
    // Return simulated upload target for development without crashing
    return {
      uploadUrl: `/api/aws/upload-mock?key=${encodeURIComponent(fileKey)}`,
      fileKey,
      simulated: true,
    };
  }

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: fileKey,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  return { uploadUrl, fileKey, simulated: false };
}
