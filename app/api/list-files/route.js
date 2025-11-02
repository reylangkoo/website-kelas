// app/api/list-files/route.js
import { NextResponse } from "next/server";
import { google } from "googleapis";

export const runtime = "nodejs";

async function getDriveClient() {
  const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );

  if (!process.env.GOOGLE_REFRESH_TOKEN) {
    throw new Error("GOOGLE_REFRESH_TOKEN tidak di-set. Silakan isi di .env.local");
  }

  oAuth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });

  const drive = google.drive({ version: "v3", auth: oAuth2Client });
  return drive;
}

export async function GET() {
  try {
    const drive = await getDriveClient();
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

    // Query untuk hanya menampilkan file di folder tertentu (jika FOLDER_ID di-set)
    const query = folderId ? `'${folderId}' in parents and trashed = false` : 'trashed = false';

    const res = await drive.files.list({
      q: query,
      fields: "files(id, name, mimeType, webViewLink, webContentLink, createdTime)",
      orderBy: "createdTime desc",
      pageSize: 50,
    });

    const files = res.data.files.map((file) => ({
      id: file.id,
      name: file.name,
      mimeType: file.mimeType,
      viewLink: file.webViewLink || `https://drive.google.com/file/d/${file.id}/view`,
      downloadLink: file.webContentLink || `https://drive.google.com/uc?export=download&id=${file.id}`,
      createdTime: file.createdTime,
    }));

    return NextResponse.json({ success: true, files });
  } catch (err) {
    console.error("List files error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Gagal mengambil daftar file" },
      { status: 500 }
    );
  }
}
