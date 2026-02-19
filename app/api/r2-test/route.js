import { NextResponse } from "next/server";
import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import { getR2Client } from "@/lib/r2";

export async function GET() {
  try {
    const client = getR2Client();
    const Bucket = process.env.R2_BUCKET;

    const data = await client.send(
      new ListObjectsV2Command({
        Bucket,
        MaxKeys: 5,
      })
    );

    return NextResponse.json({
      ok: true,
      bucket: Bucket,
      count: data?.KeyCount || 0,
      keys: (data?.Contents || []).map((x) => x.Key),
    });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e?.name || "error", message: e?.message || String(e) },
      { status: 500 }
    );
  }
}
