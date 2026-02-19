export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import { r2 } from "@/lib/r2";

export async function GET() {
  try {
    if (!r2) throw new Error("R2 client undefined");

    const out = await r2.send(
      new ListObjectsV2Command({
        Bucket: process.env.R2_BUCKET,
      })
    );

    const keys = (out.Contents || []).map((x) => x.Key);

    return NextResponse.json({ ok: true, keys });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) });
  }
}
