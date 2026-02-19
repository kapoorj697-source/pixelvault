import { NextResponse } from "next/server";
import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import { r2 } from "@/lib/r2";

export async function GET() {
  try {
    const Bucket = process.env.R2_BUCKET;

    const out = await r2.send(
      new ListObjectsV2Command({
        Bucket,
        MaxKeys: 50,
      })
    );

    const keys = (out.Contents || []).map((x) => x.Key);

    return NextResponse.json({ ok: true, bucket: Bucket, count: keys.length, keys });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: String(e), message: e?.message || "List failed" },
      { status: 500 }
    );
  }
}
