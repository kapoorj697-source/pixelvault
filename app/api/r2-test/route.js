import { NextResponse } from "next/server";
import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import { r2 } from "@/lib/r2";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const out = await r2.send(
      new ListObjectsV2Command({
        Bucket: process.env.R2_BUCKET,
        MaxKeys: 3,
      })
    );

    return NextResponse.json({
      ok: true,
      bucket: process.env.R2_BUCKET,
      keyCount: out.KeyCount ?? 0,
      sampleKeys: (out.Contents || []).map((x) => x.Key),
    });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e?.name || "R2Error", message: e?.message || String(e) },
      { status: 500 }
    );
  }
}
