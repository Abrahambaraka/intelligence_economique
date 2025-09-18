import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";

const SESSION_SECRET = process.env.SESSION_SECRET || "dev-secret-change-me";

function verify(cookie: string | undefined) {
  if (!cookie) return null;
  const [payloadBase64, sig] = cookie.split(".");
  if (!payloadBase64 || !sig) return null;
  const expected = crypto.createHmac("sha256", SESSION_SECRET).update(payloadBase64).digest("hex");
  if (sig !== expected) return null;
  try {
    const payload = JSON.parse(Buffer.from(payloadBase64, "base64url").toString("utf8"));
    if (typeof payload.exp === "number" && payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const session = verify(req.cookies.get("ie_session")?.value);
  const admin = !!session && session.role === "admin";
  return NextResponse.json({ admin });
}
