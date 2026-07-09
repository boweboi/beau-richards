import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import fs from "fs/promises";
import path from "path";

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Not logged in." }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Please upload a PNG, JPEG, WEBP, or GIF image." },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "Image is too large. Please keep it under 5MB." },
      { status: 400 }
    );
  }

  const extension = file.name.split(".").pop() || "jpg";
  const filename = `upload-${Date.now()}.${extension}`;
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadsDir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(uploadsDir, filename), buffer);

  return NextResponse.json({ path: `/uploads/${filename}` });
}
