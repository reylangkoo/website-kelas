import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const photos = await prisma.photo.findMany({
      orderBy: { uploadedAt: "desc" },
    });
    return NextResponse.json({ success: true, photos });
  } catch (error) {
    console.error("Error fetching photos:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch photos" }, { status: 500 });
  }
}

// 🟢 Tambahkan ini:
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { driveId, name, src } = body;

    // Simpan ke database Neon (PostgreSQL)
    const newPhoto = await prisma.photo.create({
      data: {
        driveId,
        name,
        src,
      },
    });

    return NextResponse.json({ success: true, photo: newPhoto });
  } catch (error) {
    console.error("Error uploading photo:", error);
    return NextResponse.json({ success: false, error: "Failed to upload photo" }, { status: 500 });
  }
}
