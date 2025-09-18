"use client";
import { useMemo, useState } from "react";

export default function AdminLoginPage() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const next = useMemo(() => {
    try {
      const url = new URL(window.location.href);
      return url.searchParams.get("next") || "/publier";
    } catch {
      return "/publier";
    }
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.set("code", code);
      const res = await fetch(`/api/auth/login?next=${encodeURIComponent(next)}`, { method: "POST", body: fd });
      if (!res.redirected) {
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(j?.error || "Login échoué");
      }
  // Le navigateur peut ne pas suivre automatiquement; on navigue côté client
      window.location.href = next;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inattendue");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-neutral-50">
      <div className="mx-auto max-w-md px-4 sm:px-6 lg:px-8 py-10 min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="w-full rounded-lg border border-neutral-200 bg-white p-5 sm:p-6 shadow-sm">
          <div className="mb-5 text-center">
            <h1 className="text-xl sm:text-2xl font-bold">Espace administrateur</h1>
            <p className="mt-1 text-sm text-neutral-600">Accès réservé à la rédaction</p>
          </div>
          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label htmlFor="code" className="block text-sm mb-1 text-center">Code administrateur</label>
              <input
                id="code"
                type="password"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-600)]"
                placeholder="Entrez le code"
                required
              />
            </div>
            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">{error}</div>
            )}
            <button
              disabled={loading}
              className="w-full rounded-md px-4 py-2 text-sm font-medium text-white bg-[var(--brand-600)] hover:bg-[var(--brand-700)] disabled:opacity-60"
            >
              {loading ? "Connexion…" : "Se connecter"}
            </button>
          </form>
          <div className="my-6 border-t border-neutral-200" />
          <ResetCodePanel />
          <p className="mt-2 text-xs text-neutral-600 text-center">
            Astuce: définissez ADMIN_CODE dans les variables d&apos;environnement.
          </p>
        </div>
      </div>
    </div>
  );
}

function ResetCodePanel() {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      const fd = new FormData();
      fd.set("code", code);
      const res = await fetch("/api/auth/reset-code", { method: "POST", body: fd });
  const j = (await res.json()) as { ok?: boolean; error?: string };
  if (!j?.ok) throw new Error(j?.error || "Échec de la mise à jour");
      setMsg("Code mis à jour.");
      setCode("");
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Erreur inattendue");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="text-center">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="text-sm text-[var(--brand-600)] hover:underline"
      >
        {open ? "Masquer réinitialisation du code" : "Réinitialiser le code admin (connecté)"}
      </button>
      {open && (
        <form onSubmit={submit} className="mt-3 space-y-3">
          <div>
            <label htmlFor="new-code" className="block text-sm mb-1 text-center">Nouveau code (6+)</label>
            <input
              id="new-code"
              type="password"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-600)]"
              minLength={6}
            />
          </div>
          {msg && (
            <div className="text-xs text-neutral-700 bg-neutral-50 border border-neutral-200 rounded p-2">{msg}</div>
          )}
          <div className="flex items-center justify-center gap-3">
            <button
              disabled={loading}
              className="rounded-md px-3 py-1.5 text-sm font-medium text-white bg-[var(--brand-600)] hover:bg-[var(--brand-700)] disabled:opacity-60"
            >
              {loading ? "Mise à jour…" : "Mettre à jour"}
            </button>
          </div>
          <p className="text-[11px] text-neutral-500">Note: nécessite d’être déjà connecté en tant qu’admin.</p>
        </form>
      )}
    </div>
  );
}
