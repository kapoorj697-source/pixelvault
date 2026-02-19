export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { r2 } from "@/lib/r2";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get("key");

    if (!key) {
      return NextResponse.json({ ok: false, message: "Missing key" }, { status: 400 });
    }

    const Bucket = process.env.R2_BUCKET;

    const obj = await r2.send(
      new GetObjectCommand({
        Bucket,
        Key: key,
      })
    );

    const contentType = obj.ContentType || "application/octet-stream";

    return new NextResponse(obj.Body, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e?.name || "Error", message: e?.message || String(e) },
      { status: 500 }
    );
  }
}
