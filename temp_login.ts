import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { verifyAdminCode } from "@/lib/auth";

const SESSION_SECRET = process.env.SESSION_SECRET || "dev-secret-change-me";

function sign(payloadBase64: string) {
  return crypto.createHmac("sha256", SESSION_SECRET).update(payloadBase64).digest("hex");
}

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const next = url.searchParams.get("next") || "/publier";
  
  let code = "";
  const contentType = req.headers.get("content-type") || "";
  
  if (contentType.includes("application/json")) {
    const json = await req.json();
    code = String(json.code || "").trim();
  } else {
    const form = await req.formData();
    code = String(form.get("code") || "").trim();
  }
  if (!code) {
    return NextResponse.json({ ok: false, error: "Code requis" }, { status: 400 });
  }
  if (!verifyAdminCode(code)) {
    return NextResponse.json({ ok: false, error: "Code invalide" }, { status: 401 });
  }
  const payload = {
    role: "admin",
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 7 * 24 * 3600, // 7 days
  };
  const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = sign(payloadBase64);
  const cookieValue = `${payloadBase64}.${sig}`;

  // Pour les requêtes JSON, retourner JSON avec cookie
  if (contentType.includes("application/json")) {
    const res = NextResponse.json({ ok: true, message: "Authentification réussie" });
    res.cookies.set("ie_session", cookieValue, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 3600,
      path: "/",
    });
    return res;
  }

  // Pour les requêtes FormData, rediriger
  const res = NextResponse.redirect(new URL(next, req.url));
  res.cookies.set("ie_session", cookieValue, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 3600,
    path: "/",
  });
  return res;
}
