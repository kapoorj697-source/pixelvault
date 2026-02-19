export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { r2 } from "@/lib/r2";

export async function POST(req) {
  try {
    const formData = await req.formData();

    const files = formData.getAll("file");
    const slug = formData.get("slug");

    if (!files || files.length === 0) {
      return NextResponse.json({ ok: false, message: "No files" });
    }

    if (!slug) {
      return NextResponse.json({ ok: false, message: "Slug missing" });
    }

    const Bucket = process.env.R2_BUCKET;

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const cleanName = file.name.replace(/[^\w.\-]/g, "_");

      const key = `${slug}/${Date.now()}-${cleanName}`;

      await r2.send(
        new PutObjectCommand({
          Bucket,
          Key: key,
          Body: buffer,
          ContentType: file.type || "application/octet-stream",
        })
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) });
  }
}
