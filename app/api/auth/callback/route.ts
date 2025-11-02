// app/api/auth/callback/route.ts
import { NextResponse } from "next/server";
import { google } from "googleapis";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    if (!code) return NextResponse.json({ error: "Missing code in query" }, { status: 400 });

    const oAuth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    const { tokens } = await oAuth2Client.getToken(code);

    // tokens.refresh_token hanya muncul pada permintaan pertama (karena prompt: consent)
    return NextResponse.json({
      message: "Simpan nilai refresh_token ini ke .env Anda sebagai GOOGLE_REFRESH_TOKEN",
      tokens
    });
  } catch (err: unknown) {
  if (err instanceof Error) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
  console.error(err);
  return NextResponse.json({ error: "Unknown error" }, { status: 500 });
}

}
