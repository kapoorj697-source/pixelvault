import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { r2 } from "@/lib/r2";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ ok: false, message: "No file" }, { status: 400 });
    }

    const Bucket = process.env.R2_BUCKET;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const key = `uploads/${Date.now()}-${file.name}`;

    await r2.send(
      new PutObjectCommand({
        Bucket,
        Key: key,
        Body: buffer,
        ContentType: file.type || "application/octet-stream",
      })
    );

    return NextResponse.json({ ok: true, key });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: String(e), message: e?.message || "Upload failed" },
      { status: 500 }
    );
  }
}
