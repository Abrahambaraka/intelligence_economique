import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const form = await req.formData();
  const name = String(form.get("name") || "").trim();
  const email = String(form.get("email") || "").trim();
  const message = String(form.get("message") || "").trim();
  if (!name || !email || !message) {
    return NextResponse.json({ ok: false, error: "Champs requis manquants" }, { status: 400 });
  }
  // TODO: envoyer un email (Resend, SendGrid) ou créer un ticket.
  return new NextResponse(
    `<!doctype html><html lang="fr"><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><title>Merci</title><body style="font-family:system-ui;padding:2rem"><h1>Merci ${name} !</h1><p>Nous avons bien reçu votre message. Nous reviendrons vers vous à ${email}.</p><p><a href="/">← Retour au site</a></p></body></html>`,
    { headers: { "content-type": "text/html; charset=utf-8" } }
  );
}
