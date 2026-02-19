import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getR2Client } from "@/lib/r2";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ ok: false, message: "No file" }, { status: 400 });
    }

    const Bucket = process.env.R2_BUCKET;
    if (!Bucket) throw new Error("Missing R2_BUCKET");

    const client = getR2Client();

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const key = `uploads/${Date.now()}-${file.name}`;

    await client.send(
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
      { ok: false, error: e?.name || "Error", message: e?.message || String(e) },
      { status: 500 }
    );
  }
}
