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
