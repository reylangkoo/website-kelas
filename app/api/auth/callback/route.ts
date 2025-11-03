import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return new NextResponse(
      `<!DOCTYPE html>
      <html>
        <head>
          <title>Authentication Failed</title>
        </head>
        <body>
          <script>
            window.opener?.postMessage({ 
              type: 'auth_error', 
              message: 'No authentication code received' 
            }, '*');
            setTimeout(() => window.close(), 1000);
          </script>
        </body>
      </html>`,
      { headers: { "Content-Type": "text/html" } }
    );
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);

    // 🚨 DEBUG: Log tokens untuk memastikan berhasil
    console.log("Tokens received:", tokens ? "YES" : "NO");

     // ✅ Tambahkan log di sini
  console.log("✅ Callback hit, sending postMessage...");

    const response = new NextResponse(
  `<!DOCTYPE html>
  <html>
    <head><title>Authentication Successful</title></head>
    <body>
      <script>
  try {
    // kirim postMessage ke opener (jika masih ada)
    if (window.opener && !window.opener.closed) {
      window.opener.postMessage({ type: 'auth_success' }, window.location.origin);
      console.log('✅ postMessage sent to opener');
    } else {
      console.warn('⚠️ opener not available for postMessage');
    }

    // fallback: set localStorage supaya parent yang mendengar storage event juga tahu
    localStorage.setItem("drive_auth_success", "true");

  } catch (e) {
    console.error('PostMessage/localStorage error', e);
  }

  // beri sedikit delay supaya message/storage diproses, lalu tutup
  setTimeout(() => window.close(), 700);
</script>
    </body>
  </html>`,
  { headers: { "Content-Type": "text/html" } }
);

    // Simpan tokens di cookie juga untuk backup
    response.cookies.set("drive_tokens", JSON.stringify(tokens), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 // 24 hours
    });

    return response;

  } catch (error) {
    console.error("Token error:", error);
    return new NextResponse(
      `<!DOCTYPE html>
      <html>
        <head>
          <title>Authentication Failed</title>
        </head>
        <body>
          <script>
            window.opener?.postMessage({ 
              type: 'auth_error', 
              message: 'Authentication failed' 
            }, '*');
            setTimeout(() => window.close(), 1000);
          </script>
        </body>
      </html>`,
      { headers: { "Content-Type": "text/html" } }
    );
  }
}