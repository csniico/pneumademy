import "server-only";
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const BUCKET = process.env.S3_BUCKET_NAME!;
const REGION = process.env.S3_REGION!;

export const s3 = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// ─── Key builders ────────────────────────────────────────────────────────────
// All asset types are isolated by prefix and scoped to a course id.
//
//   thumbnails/<courseId>/thumbnail.<ext>   — one per course
//   videos/<courseId>/<filename>            — video-based lessons
//   html/<courseId>/<filename>              — reading-based lessons (HTML)
//   audios/<courseId>/<filename>            — audio-based lessons
export const s3Keys = {
  thumbnail: (courseId: string, ext: string) =>
    `thumbnails/${courseId}/thumbnail.${ext}`,

  video: (courseId: string, filename: string) =>
    `videos/${courseId}/${filename}`,

  html: (courseId: string, filename: string) =>
    `html/${courseId}/${filename}`,

  audio: (courseId: string, filename: string) =>
    `audios/${courseId}/${filename}`,
};

// ─── Presigned upload URL ─────────────────────────────────────────────────────
// Used for direct browser → S3 uploads. Expires in 5 minutes.

export async function getPresignedUploadUrl({
  key,
  contentType,
  expiresIn = 300,
}: {
  key: string;
  contentType: string;
  expiresIn?: number;
}) {
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ContentType: contentType,
  });
  return getSignedUrl(s3, command, { expiresIn });
}

// ─── Public URL ───────────────────────────────────────────────────────────────
// For assets in a public bucket (thumbnails). Videos, HTML, and audio assets
// should use presigned GET URLs instead if the bucket is private.

export function getPublicUrl(key: string) {
  return `https://${BUCKET}.s3.${REGION}.amazonaws.com/${key}`;
}

// ─── Presigned read URL ───────────────────────────────────────────────────────
// For reading private assets (HTML lesson content) in the admin editor.

export async function getPresignedReadUrl(key: string, expiresIn = 60) {
  const command = new GetObjectCommand({ Bucket: BUCKET, Key: key });
  return getSignedUrl(s3, command, { expiresIn });
}

// ─── Delete ───────────────────────────────────────────────────────────────────

export async function deleteObject(key: string) {
  await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
}
