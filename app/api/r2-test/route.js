import { NextResponse } from "next/server";
import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import { r2 } from "../../../lib/r2";

export async function GET() {
  try {
    const data = await r2.send(
      new ListObjectsV2Command({
        Bucket: process.env.R2_BUCKET,
        MaxKeys: 1,
      })
    );

    return NextResponse.json({
      ok: true,
      message: "R2 connected",
      keysFound: data?.KeyCount ?? 0,
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err?.message || "R2 error" },
      { status: 500 }
    );
  }
}
