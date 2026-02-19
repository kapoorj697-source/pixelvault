import { NextResponse } from "next/server";
import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import { r2 } from "@/lib/r2";

export async function GET() {
  try {
    const Bucket = process.env.R2_BUCKET;

    const data = await r2.send(
      new ListObjectsV2Command({
        Bucket,
      })
    );

    const files =
      data.Contents?.map((item) => ({
        key: item.Key,
        url: `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${item.Key}`,
      })) || [];

    return NextResponse.json({ ok: true, files });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message });
  }
}
