import { NextRequest, NextResponse } from "next/server";

const SESSION_SECRET = process.env.SESSION_SECRET || "dev-secret-change-me";

async function hmacHex(payloadBase64: string) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(SESSION_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sigBuf = await crypto.subtle.sign("HMAC", key, enc.encode(payloadBase64));
  // Conversion en hexadécimal
  const bytes = new Uint8Array(sigBuf);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function base64UrlToString(b64url: string) {
  // Convertir base64url en base64
  const b64 = b64url.replace(/-/g, "+").replace(/_/g, "/");
  // Décoder
  const binary = atob(b64);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  const decoder = new TextDecoder();
  return decoder.decode(bytes);
}

async function verify(cookie: string | undefined) {
  if (!cookie) return null;
  const [payloadBase64, sig] = cookie.split(".");
  if (!payloadBase64 || !sig) return null;
  const expected = await hmacHex(payloadBase64);
  if (sig !== expected) return null;
  try {
    const json = base64UrlToString(payloadBase64);
    const payload = JSON.parse(json);
    if (!payload || payload.role !== "admin") return null;
    if (typeof payload.exp === "number" && payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/publier")) {
    const session = await verify(req.cookies.get("ie_session")?.value);
    if (!session) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/publier/:path*"],
};
