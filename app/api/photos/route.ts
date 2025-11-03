import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const photos = await prisma.photo.findMany({
      orderBy: {
        uploadedAt: 'desc'
      }
    });

    const formattedPhotos = photos.map(photo => ({
      id: photo.id.toString(),
      name: photo.name,
      src: photo.src,
      uploadedAt: photo.uploadedAt.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      photos: formattedPhotos
    });
  } catch (error) {
    console.error('Error fetching photos:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch photos' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID foto tidak ditemukan" },
        { status: 400 }
      );
    }

    await prisma.photo.delete({
      where: { id: Number(id) }, // ✅ ubah ke Number(id)
    });

    return NextResponse.json({
      success: true,
      message: "Foto berhasil dihapus",
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error deleting photo:", error.message);
    } else {
      console.error("Unknown error deleting photo:", error);
    }
    return NextResponse.json(
      { success: false, error: "Gagal menghapus foto" },
      { status: 500 }
    );
  }
}