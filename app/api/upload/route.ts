import { NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ success: false, error: "Tidak ada file yang diunggah" })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // pastikan folder uploads ada
    const uploadsDir = path.join(process.cwd(), "public", "uploads")
    await mkdir(uploadsDir, { recursive: true })

    const filePath = path.join(uploadsDir, file.name)
    await writeFile(filePath, buffer)

    // simpan ke database
const photo = await prisma.photo.create({
  data: {
    name: file.name,
    src: `/uploads/${file.name}`,
    uploadedAt: new Date(),
    driveId: "", // kasih nilai kosong biar Prisma nggak error
  },
})

    return NextResponse.json({ success: true, photo })
  } catch (err: unknown) {
  if (err instanceof Error) {
    console.error(err)
    return NextResponse.json({ success: false, error: err.message })
  }
  console.error(err)
  return NextResponse.json({ success: false, error: "Unknown error" })
}

}
