"use client";
import { useEffect, useRef, useState } from "react";
import { useToast } from "@/components/Toast";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function AuthNewsletterModal({ open, onClose }: Props) {
  const toast = useToast();
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  // Fermer avec Échap et au clic en dehors de la boîte de dialogue
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    function onDown(e: MouseEvent) {
      if (!open) return;
      if (!dialogRef.current) return;
      const t = e.target as Node;
      if (overlayRef.current && t && overlayRef.current === t) onClose();
    }
    if (open) {
      document.addEventListener("keydown", onKey);
      document.addEventListener("mousedown", onDown);
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      setMessage(null);
      setLoading(false);
      setTab("login");
    }
  }, [open]);

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/newsletter", { method: "POST", body: fd });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || "Erreur d'inscription");
      }
  setMessage("Inscription réussie. Merci !");
  toast.success("Inscription réussie. Merci !");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Une erreur est survenue";
      setMessage(msg);
  toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
  // Démo : pas de comptes réels ; afficher un message informatif
    setTimeout(() => {
      setMessage("Si un compte existe, nous vous envoyons un lien de connexion par email.");
      setLoading(false);
    }, 700);
  }

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-[1px] grid place-items-center p-4"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        className="w-full max-w-md rounded-lg bg-white shadow-xl border border-neutral-200"
      >
        <div className="flex items-center justify-between border-b border-neutral-200 p-3">
          <div className="inline-flex rounded-md bg-neutral-100 p-1">
            <button
              className={"px-3 py-1.5 text-sm rounded-md " + (tab === "login" ? "bg-white border border-neutral-200 text-neutral-900" : "text-neutral-700")}
              onClick={() => setTab("login")}
            >
              Connexion
            </button>
            <button
              className={"px-3 py-1.5 text-sm rounded-md " + (tab === "signup" ? "bg-white border border-neutral-200 text-neutral-900" : "text-neutral-700")}
              onClick={() => setTab("signup")}
            >
              Inscription
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button aria-label="Fermer" className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-neutral-100" onClick={onClose}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-4">
          {tab === "login" ? (
            <form onSubmit={handleLogin} className="space-y-4" aria-describedby="login-help">
              <div className="relative">
                <label className="block text-sm mb-1" htmlFor="login-email">Adresse email</label>
                <span className="pointer-events-none absolute left-3 top-[38px] -translate-y-1/2 text-neutral-400">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16v16H4z" />
                    <path d="m22 6-10 7L2 6" />
                  </svg>
                </span>
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  autoFocus
                  required
                  placeholder="vous@exemple.com"
                  className="w-full rounded-md border border-neutral-300 pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-600)]"
                />
              </div>
              <p id="login-help" className="text-xs text-neutral-600">Nous vous enverrons un lien magique si un compte existe.</p>
              {message && (
                <div className="text-sm text-neutral-800 bg-neutral-50 border border-neutral-200 rounded p-2">
                  {message}
                </div>
              )}
              <div className="space-y-2">
                <button
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-white bg-[var(--brand-600)] hover:bg-[var(--brand-700)] disabled:opacity-60"
                >
                  {loading ? "Envoi…" : "Se connecter"}
                  {!loading && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  )}
                </button>
                <p className="text-center">
                  <button type="button" className="text-sm text-neutral-700 hover:underline" onClick={() => setTab("signup")}>
                    Pas de compte ? Inscrivez‑vous
                  </button>
                </p>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="space-y-3">
              <div>
                <label className="block text-sm mb-1" htmlFor="signup-name">Nom (optionnel)</label>
                <input id="signup-name" name="name" type="text" placeholder="Votre nom" className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900" />
              </div>
              <div>
                <label className="block text-sm mb-1" htmlFor="signup-email">Email</label>
                <input id="signup-email" name="email" type="email" required placeholder="vous@exemple.com" className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900" />
              </div>
              {message && <div className="text-sm text-neutral-700 bg-neutral-50 border border-neutral-200 rounded p-2">{message}</div>}
              <div className="flex items-center gap-2">
                <button disabled={loading} className="inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-white bg-[var(--brand-600)] hover:bg-[var(--brand-700)] disabled:opacity-60">
                  {loading ? "Inscription…" : "S'inscrire"}
                </button>
                <button type="button" className="text-sm text-neutral-700 hover:underline" onClick={() => setTab("login")}>
                  J&apos;ai déjà un compte
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
