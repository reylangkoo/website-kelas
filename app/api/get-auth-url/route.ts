// app/api/get-auth-url/route.ts
import { NextResponse } from "next/server";
import { google } from "googleapis";

export async function GET() {
  const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  const scopes = [
    "https://www.googleapis.com/auth/drive.file",
    "https://www.googleapis.com/auth/drive"
  ];

  const url = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent", // supaya Google mengeluarkan refresh_token
    scope: scopes,
  });

  return NextResponse.json({ url });
}
