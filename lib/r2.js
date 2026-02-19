// lib/r2.js
import { S3Client } from "@aws-sdk/client-s3";

let cachedClient = null;

export function getR2Client() {
  if (cachedClient) return cachedClient;

  const endpoint = process.env.R2_ENDPOINT;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

  if (!endpoint || !accessKeyId || !secretAccessKey) {
    throw new Error("Missing R2 env vars: R2_ENDPOINT / R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY");
  }

  cachedClient = new S3Client({
    region: "auto",
    endpoint,
    credentials: { accessKeyId, secretAccessKey },
  });

  return cachedClient;
}
