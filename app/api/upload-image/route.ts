import { NextRequest, NextResponse } from "next/server";
import { pinata } from "@/lib/config";

export async function POST(req: NextRequest) {
  const data = await req.formData();
  const file = data.get("file") as File;

  if (!file)
    return NextResponse.json({ error: "No file provided" }, { status: 400 });

  try {
    const { cid } = await pinata.upload.public.file(file);
    const url = await pinata.gateways.public.convert(cid);

    return NextResponse.json({ url });
  } catch {
    return NextResponse.json({ error: "File not uploaded" }, { status: 400 });
  }
}
