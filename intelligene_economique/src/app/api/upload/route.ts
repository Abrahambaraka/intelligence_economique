import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

function sanitizeFilename(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

const SESSION_SECRET = process.env.SESSION_SECRET || "dev-secret-change-me";
// Désactiver l'écriture locale en environnement serverless/production sauf si explicitement autorisé
const DISABLE_LOCAL_UPLOADS = process.env.UPLOADS_LOCAL_DISABLED === "1" || !!process.env.VERCEL;
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

export async function POST(req: NextRequest) {
  if (DISABLE_LOCAL_UPLOADS) {
    return NextResponse.json(
      { ok: false, error: "Upload local désactivé en production. Configurez un stockage objet (S3/R2) et un adaptateur." },
      { status: 501 }
    );
  }
  const session = verify(req.cookies.get("ie_session")?.value);
  if (!session || session.role !== "admin") {
    return NextResponse.json({ ok: false, error: "Non autorisé" }, { status: 401 });
  }
  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ ok: false, error: "Fichier manquant" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    fs.mkdirSync(uploadsDir, { recursive: true });

    const ext = path.extname(file.name) || "";
    const base = path.basename(file.name, ext);
    const stamped = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${sanitizeFilename(base)}${ext}`;
    const destPath = path.join(uploadsDir, stamped);
    fs.writeFileSync(destPath, buffer);

    const url = `/uploads/${stamped}`;
    return NextResponse.json({ ok: true, url });
  } catch {
    return NextResponse.json({ ok: false, error: "Upload échoué" }, { status: 500 });
  }
}
