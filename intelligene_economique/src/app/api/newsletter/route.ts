import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Petite page d'accueil pour tester rapidement l'inscription
export async function GET() {
  const html = `<!doctype html>
  <html lang="fr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex, nofollow" />
    <title>Newsletter — Intelligence Économique</title>
    <style>
      :root{--brand:#0f766e}
      body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif;margin:0;padding:2rem;display:grid;min-height:100dvh;place-items:center;background:#fafafa}
      .card{background:#fff;max-width:28rem;width:100%;padding:1.25rem;border:1px solid #e5e5e5;border-radius:12px;box-shadow:0 1px 2px rgba(0,0,0,.04)}
      h1{margin:0 0 .25rem;font-size:1.25rem}
      p{margin:.25rem 0 .75rem;color:#444}
      label{display:block;margin:.5rem 0 .25rem;font-weight:600}
      input[type=email]{width:100%;padding:.625rem .75rem;border:1px solid #d4d4d4;border-radius:8px;font-size:.95rem}
      .row{display:flex;gap:.5rem;margin-top:.75rem}
      button{padding:.6rem 1rem;border:1px solid var(--brand);background:var(--brand);color:#fff;border-radius:8px;font-weight:600}
      a.btn{display:inline-flex;align-items:center;gap:.5rem;padding:.6rem 1rem;border:1px solid #111;border-radius:8px;color:#111;text-decoration:none}
      small{color:#666}
    </style>
  </head>
  <body>
    <form class="card" method="post" action="/api/newsletter">
      <h1>Inscription à la newsletter</h1>
      <p>Recevez nos dernières publications par e‑mail.</p>
      <label for="email">Adresse e‑mail</label>
      <input id="email" name="email" type="email" placeholder="votre@email.com" required />
      <input type="text" name="website" style="display:none" tabindex="-1" autocomplete="off" />
      <div class="row">
        <button type="submit">S’inscrire</button>
        <a class="btn" href="/">← Retour au site</a>
      </div>
      <p><small>Vos données ne seront pas revendues. Vous pouvez vous désabonner à tout moment.</small></p>
    </form>
  </body>
  </html>`;
  return new NextResponse(html, { headers: { "content-type": "text/html; charset=utf-8" } });
}

function wantsJson(req: Request) {
  const accept = req.headers.get("accept") || "";
  const ct = req.headers.get("content-type") || "";
  return accept.includes("application/json") || ct.includes("application/json");
}

function isValidEmail(email: string) {
  if (!email) return false;
  if (email.length > 254) return false;
  // Regex simple et tolérante
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  return re.test(email);
}

export async function POST(req: Request) {
  const isJson = (req.headers.get("content-type") || "").includes("application/json");
  let email = "";
  let honeypot = "";
  try {
    if (isJson) {
      const body = (await req.json().catch(() => ({}))) as unknown;
      const obj = (typeof body === "object" && body !== null ? body : {}) as Record<string, unknown>;
      email = String((obj["email"] ?? "")).trim();
      honeypot = String((obj["website"] ?? "")).trim();
    } else {
      const form = await req.formData();
      email = String(form.get("email") || "").trim();
      honeypot = String(form.get("website") || "").trim();
    }
  } catch {
    // ignore
  }

  // Anti-spam basique
  if (honeypot) {
    if (wantsJson(req)) return NextResponse.json({ ok: true }, { status: 204 });
    return new NextResponse("", { status: 204 });
  }

  if (!isValidEmail(email)) {
    if (wantsJson(req)) {
      return NextResponse.json({ ok: false, error: "Adresse e‑mail invalide" }, { status: 400 });
    }
    const err = `<!doctype html><html lang="fr"><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><title>Erreur</title><body style="font-family:system-ui;padding:2rem"><h1>Adresse e‑mail invalide</h1><p>Merci de vérifier et réessayer.</p><p><a href="/api/newsletter">← Retour</a></p></body></html>`;
    return new NextResponse(err, { headers: { "content-type": "text/html; charset=utf-8" }, status: 400 });
  }

  // À faire: brancher un fournisseur (Mailchimp, Brevo, Resend) ici.
  try {
    await prisma.newsletterSubscription.create({ data: { email, source: "api" } });
  } catch {
    // ignorer les erreurs d'unicité pour rendre l'appel idempotent
  }

  if (wantsJson(req)) {
    return NextResponse.json({ ok: true, message: "Inscription enregistrée", email });
  }
  const ok = `<!doctype html><html lang="fr"><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><title>Merci</title><body style="font-family:system-ui;padding:2rem"><h1>Merci !</h1><p>Votre inscription (${email}) a bien été prise en compte.</p><p><a href="/">← Retour au site</a></p></body></html>`;
  return new NextResponse(ok, { headers: { "content-type": "text/html; charset=utf-8" } });
}
