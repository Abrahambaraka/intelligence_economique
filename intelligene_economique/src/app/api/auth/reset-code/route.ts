import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { setAdminCode } from "@/lib/auth";

const SESSION_SECRET = process.env.SESSION_SECRET || "dev-secret-change-me";

function verify(cookie: string | undefined) {
  if (!cookie) return null;
  const [payloadBase64, sig] = cookie.split(".");
  if (!payloadBase64 || !sig) return null;
  const expected = crypto.createHmac("sha256", SESSION_SECRET).update(payloadBase64).digest("hex");
  if (sig !== expected) return null;
  try {
    const payload = JSON.parse(Buffer.from(payloadBase64, "base64url").toString("utf8"));
    if (payload.role !== "admin") return null;
    if (typeof payload.exp === "number" && payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const session = verify(req.cookies.get("ie_session")?.value);
  if (!session) return NextResponse.json({ ok: false, error: "Non autorisé" }, { status: 401 });
  const form = await req.formData();
  const code = String(form.get("code") || "").trim();
  if (!code) return NextResponse.json({ ok: false, error: "Nouveau code requis" }, { status: 400 });
  if (code.length < 6) return NextResponse.json({ ok: false, error: "6 caractères minimum" }, { status: 400 });
  setAdminCode(code);
  return NextResponse.json({ ok: true });
}
