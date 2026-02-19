import { NextResponse } from "next/server";
import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import { getR2Client } from "@/lib/r2";

export async function GET() {
  try {
    const Bucket = process.env.R2_BUCKET;
    if (!Bucket) throw new Error("Missing R2_BUCKET");

    const client = getR2Client();

    const data = await client.send(
      new ListObjectsV2Command({
        Bucket,
        Prefix: "uploads/",
      })
    );

    const keys = (data.Contents || []).map((x) => x.Key);

    return NextResponse.json({ ok: true, bucket: Bucket, count: keys.length, keys });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e?.name || "Error", message: e?.message || String(e) },
      { status: 500 }
    );
  }
}
