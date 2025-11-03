import { google } from 'googleapis';
import { Readable } from "stream";
import { Credentials } from 'google-auth-library';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

export const drive = google.drive({ version: 'v3', auth: oauth2Client });

export function setCredentials(tokens: Credentials) {
  oauth2Client.setCredentials(tokens);
}

export function generateAuthUrl() {
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/drive.file'],
    prompt: 'consent'
  });
}

export async function uploadToDrive(fileBuffer: Buffer, fileName: string, mimeType: string) {
  try {
    console.log("🚀 Starting Drive upload:", fileName);
    
    const response = await drive.files.create({
      requestBody: {
        name: fileName,
        parents: [process.env.GOOGLE_DRIVE_FOLDER_ID!],
      },
      media: {
  mimeType,
  body: Readable.from(fileBuffer),
},
      fields: 'id,name,webViewLink,webContentLink',
    });

    console.log("✅ Drive upload completed:", response.data.id);
    
    // 🚨 SET FILE TO PUBLIC (READ-ONLY)
    await drive.permissions.create({
      fileId: response.data.id!,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });
    
    console.log("🔓 File set to public");

    return response.data;
  } catch (error) {
    console.error("❌ Drive upload error:", error);
    throw error;
  }
}