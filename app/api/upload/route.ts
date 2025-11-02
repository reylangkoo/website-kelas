import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import prisma from "@/lib/prisma"; // sudah benar sesuai struktur kamu

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ success: false, error: "Tidak ada file yang diunggah" });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Buat folder uploads kalau belum ada
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    const filePath = path.join(uploadsDir, file.name);
    await writeFile(filePath, buffer);

    // Simpan ke database (Neon)
    const photo = await prisma.photo.create({
      data: {
        name: file.name,
        src: `/uploads/${file.name}`,
        uploadedAt: new Date(),
        driveId: "", // biarkan kosong agar tidak error
      },
    });

    return NextResponse.json({ success: true, photo });
  } catch (error) {
    console.error("Error uploading photo:", error);
    return NextResponse.json(
      { success: false, error: "Gagal upload foto" },
      { status: 500 }
    );
  }
}
