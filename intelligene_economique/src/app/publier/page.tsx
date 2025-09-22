"use client";
import { useEffect, useState } from "react";
import { RUBRIQUES } from "@/lib/categories";
import { ArticleCard } from "@/components/ArticleCard";

type ArticleLite = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  image?: string;
  publishedAt: string;
  author?: string;
  rubrique?: string;
  body: string;
};

type TabKey = "article" | "magazine" | "video";
type MagazineLite = { id: string; title: string; excerpt?: string; image?: string; publishedAt: string; issue: string; pdfUrl?: string };
type VideoLite = { id: string; title: string; excerpt?: string; image?: string; publishedAt: string; videoUrl: string; duration?: string };

export default function PublierPage() {
  const [tab, setTab] = useState<TabKey>("magazine");
  const [list, setList] = useState<ArticleLite[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [mags, setMags] = useState<MagazineLite[]>([]);
  const [loadingM, setLoadingM] = useState(false);
  const [editingMagId, setEditingMagId] = useState<string | null>(null);
  const [vids, setVids] = useState<VideoLite[]>([]);
  const [loadingV, setLoadingV] = useState(false);
  const [editingVidId, setEditingVidId] = useState<string | null>(null);

  useEffect(() => {
    if (tab !== "article") return;
  const ab = new AbortController();
    setLoading(true);
    fetch("/api/articles?status=published", { signal: ab.signal })
      .then((r) => r.json())
      .then((j) => Array.isArray(j) && setList(j))
      .finally(() => setLoading(false));
    return () => ab.abort();
  }, [tab]);

  useEffect(() => {
    if (tab !== "magazine") return;
    const ab = new AbortController();
    setLoadingM(true);
    fetch("/api/magazines?status=published", { signal: ab.signal })
      .then((r) => r.json())
      .then((j) => Array.isArray(j) && setMags(j as MagazineLite[]))
      .finally(() => setLoadingM(false));
    return () => ab.abort();
  }, [tab]);

  useEffect(() => {
    if (tab !== "video") return;
    const ab = new AbortController();
    setLoadingV(true);
    fetch("/api/videos?status=published", { signal: ab.signal })
      .then((r) => r.json())
      .then((j) => Array.isArray(j) && setVids(j as VideoLite[]))
      .finally(() => setLoadingV(false));
    return () => ab.abort();
  }, [tab]);

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Publier</h1>
      </div>

      <div className="inline-flex rounded-md bg-neutral-100 p-1 mb-6">
        {([ ["article","Article"], ["magazine","Magazine"], ["video","Vidéo"] ] as [TabKey,string][]).map(([key,label]) => (
          <button
            key={key}
      onClick={() => setTab(key)}
            className={"px-3 py-1.5 text-sm rounded-md " + (tab === key ? "bg-white border border-neutral-200 text-neutral-900" : "text-neutral-700")}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "article" && <ArticleForm onCreated={() => {
        // après création d'un article, rafraîchir la liste
        setLoading(true);
        fetch("/api/articles?status=published")
          .then((r) => r.json())
          .then((j) => Array.isArray(j) && setList(j))
          .finally(() => setLoading(false));
      }} />}
      {tab === "magazine" && <MagazineForm onCreated={() => {
        setLoadingM(true);
        fetch("/api/magazines?status=published").then((r) => r.json()).then((j) => Array.isArray(j) && setMags(j as MagazineLite[])).finally(() => setLoadingM(false));
      }} />}
      {tab === "video" && <VideoForm onCreated={() => {
        setLoadingV(true);
        fetch("/api/videos?status=published").then((r) => r.json()).then((j) => Array.isArray(j) && setVids(j as VideoLite[])).finally(() => setLoadingV(false));
      }} />}

      {/* Liste des articles publiés */}
      {tab === "article" && (
        <section className="mt-10">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-lg font-semibold">Articles publiés</h2>
          </div>
          {loading ? (
            <p className="text-sm text-neutral-600">Chargement…</p>
          ) : list.length === 0 ? (
            <p className="text-sm text-neutral-600">Aucun article publié pour le moment.</p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2">
              {list.map((a) => (
                <div key={a.id} className="relative">
                  <div className="absolute right-2 top-2 z-10 flex gap-2">
                    <button
                      onClick={() => setEditingId((prev) => (prev === a.id ? null : a.id))}
                      className="rounded-md border border-neutral-300 bg-white px-2 py-0.5 text-xs hover:bg-neutral-50"
                    >Modifier</button>
                    <button
                      onClick={async () => {
                        if (!confirm("Supprimer cet article ?")) return;
                        const res = await fetch(`/api/articles/${a.id}`, { method: "DELETE" });
                        const j = await res.json().catch(() => ({}));
                        if (!res.ok || !j?.ok) return alert(j?.error || "Suppression échouée");
                        setList((cur) => cur.filter((x) => x.id !== a.id));
                      }}
                      className="rounded-md border border-red-300 bg-white px-2 py-0.5 text-xs text-red-700 hover:bg-red-50"
                    >Retirer</button>
                  </div>
                  {editingId === a.id ? (
                    <InlineEditCard
                      article={a}
                      onCancel={() => setEditingId(null)}
                      onSaved={(upd) => {
                        setEditingId(null);
                        setList((cur) => cur.map((x) => (x.id === upd.id ? { ...x, ...upd } : x)));
                      }}
                    />
                  ) : (
                    <ArticleCard a={a} />
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {tab === "magazine" && (
        <section className="mt-10">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-lg font-semibold">Magazines publiés</h2>
          </div>
          {loadingM ? (
            <p className="text-sm text-neutral-600">Chargement…</p>
          ) : mags.length === 0 ? (
            <p className="text-sm text-neutral-600">Aucun magazine pour le moment.</p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2">
              {mags.map((m: MagazineLite) => (
                <div key={m.id} className="border rounded-lg bg-white p-4 relative">
                  <div className="absolute right-2 top-2 z-10 flex gap-2">
                    <button onClick={() => setEditingMagId((v) => (v === m.id ? null : m.id))} className="rounded-md border border-neutral-300 bg-white px-2 py-0.5 text-xs hover:bg-neutral-50">Modifier</button>
                    <button onClick={async () => {
                      if (!confirm("Supprimer ce magazine ?")) return;
                      const res = await fetch(`/api/magazines/${m.id}`, { method: "DELETE" });
                      const j = await res.json().catch(() => ({}));
                      if (!res.ok || !j?.ok) return alert(j?.error || "Suppression échouée");
                      setMags((cur) => cur.filter((x) => x.id !== m.id));
                    }} className="rounded-md border border-red-300 bg-white px-2 py-0.5 text-xs text-red-700 hover:bg-red-50">Retirer</button>
                  </div>
                  {editingMagId === m.id ? (
                    <InlineEditMagazine magazine={m} onCancel={() => setEditingMagId(null)} onSaved={(upd: MagazineLite) => { setEditingMagId(null); setMags((cur) => cur.map((x) => x.id === upd.id ? upd : x)); }} />
                  ) : (
                    <div>
                      <h3 className="font-semibold">{m.title}</h3>
                      <p className="text-sm text-neutral-600">{m.issue}</p>
                      {m.pdfUrl && <a className="text-xs text-[var(--brand-600)] hover:underline" href={m.pdfUrl}>PDF</a>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {tab === "video" && (
        <section className="mt-10">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-lg font-semibold">Vidéos publiées</h2>
          </div>
          {loadingV ? (
            <p className="text-sm text-neutral-600">Chargement…</p>
          ) : vids.length === 0 ? (
            <p className="text-sm text-neutral-600">Aucune vidéo pour le moment.</p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2">
              {vids.map((v: VideoLite) => (
                <div key={v.id} className="border rounded-lg bg-white p-4 relative">
                  <div className="absolute right-2 top-2 z-10 flex gap-2">
                    <button onClick={() => setEditingVidId((x) => (x === v.id ? null : v.id))} className="rounded-md border border-neutral-300 bg-white px-2 py-0.5 text-xs hover:bg-neutral-50">Modifier</button>
                    <button onClick={async () => {
                      if (!confirm("Supprimer cette vidéo ?")) return;
                      const res = await fetch(`/api/videos/${v.id}`, { method: "DELETE" });
                      const j = await res.json().catch(() => ({}));
                      if (!res.ok || !j?.ok) return alert(j?.error || "Suppression échouée");
                      setVids((cur) => cur.filter((x) => x.id !== v.id));
                    }} className="rounded-md border border-red-300 bg-white px-2 py-0.5 text-xs text-red-700 hover:bg-red-50">Retirer</button>
                  </div>
                  {editingVidId === v.id ? (
                    <InlineEditVideo video={v} onCancel={() => setEditingVidId(null)} onSaved={(upd: VideoLite) => { setEditingVidId(null); setVids((cur) => cur.map((x) => x.id === upd.id ? upd : x)); }} />
                  ) : (
                    <div>
                      <h3 className="font-semibold">{v.title}</h3>
                      <p className="text-sm text-neutral-600">{v.excerpt}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

function ArticleForm({ onCreated }: { onCreated?: () => void }) {
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [rubrique, setRubrique] = useState<string>(RUBRIQUES[0]?.slug || "");

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const fd = new FormData();
    fd.set("file", f);
    setUploading(true);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const j = await res.json();
      if (j?.ok) setCoverUrl(j.url);
    } finally {
      setUploading(false);
    }
  }

  return (
    <form className="space-y-4">
      <div>
        <label className="block text-sm mb-1" htmlFor="a-title">Titre</label>
        <input id="a-title" className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-600)]" />
      </div>
      <div>
        <label className="block text-sm mb-1" htmlFor="a-rubrique">Rubrique</label>
        <select
          id="a-rubrique"
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-600)] bg-white"
          value={rubrique}
          onChange={(e) => setRubrique(e.target.value)}
        >
          {RUBRIQUES.map((r) => (
            <option key={r.slug} value={r.slug}>{r.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm mb-1" htmlFor="a-excerpt">Extrait (résumé)</label>
        <input id="a-excerpt" className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-600)]" />
      </div>
      <div>
        <label className="block text-sm mb-1" htmlFor="a-content">Contenu</label>
        <textarea id="a-content" rows={8} className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-600)]" />
      </div>
      <div className="space-y-2">
        <label className="block text-sm" htmlFor="a-file">Image à la une</label>
        <div className="flex items-center gap-3">
          <input id="a-file" type="file" accept="image/*" onChange={onUpload} />
          {uploading && <span className="text-xs text-neutral-600">Import…</span>}
        </div>
        {coverUrl && (
          <div className="border rounded-md p-2 inline-block bg-neutral-50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={coverUrl} alt="aperçu" className="h-40 w-auto object-cover" />
            <p className="text-xs mt-1 text-neutral-700">URL: {coverUrl}</p>
          </div>
        )}
      </div>
      <PublishButton
        label="Publier l'article"
        onPublish={async () => {
          const title = (document.getElementById("a-title") as HTMLInputElement | null)?.value?.trim() || "";
          const excerpt = (document.getElementById("a-excerpt") as HTMLInputElement | null)?.value?.trim() || undefined;
          const content = (document.getElementById("a-content") as HTMLTextAreaElement | null)?.value?.trim() || "";
          const payload = { title, excerpt, body: content, image: coverUrl ?? undefined, rubrique };
          const res = await fetch("/api/articles", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(payload),
          });
          const j = await res.json().catch(() => ({}));
          if (!res.ok || !j?.ok) {
            // Si c'est une erreur 401 (non autorisé), lancer une erreur pour déclencher la redirection
            if (res.status === 401) {
              throw new Error("Authentication required");
            }
            alert(j?.error || "Échec de la publication");
            return;
          }
          alert("Article publié avec succès!");
          if (onCreated) onCreated();
        }}
      />
    </form>
  );
}

function MagazineForm({ onCreated }: { onCreated?: () => void }) {
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const fd = new FormData();
    fd.set("file", f);
    setUploading(true);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const j = await res.json();
      if (j?.ok) setCoverUrl(j.url);
    } finally {
      setUploading(false);
    }
  }
  async function onUploadPdf(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const fd = new FormData();
    fd.set("file", f);
    setUploading(true);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const j = await res.json();
      if (j?.ok) setPdfUrl(j.url);
    } finally {
      setUploading(false);
    }
  }
  return (
    <form className="space-y-4">
      <div>
        <label className="block text-sm mb-1" htmlFor="m-title">Titre</label>
        <input id="m-title" className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-600)]" />
      </div>
      <div>
        <label className="block text-sm mb-1" htmlFor="m-issue">Numéro</label>
        <input id="m-issue" className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-600)]" />
      </div>
      <div>
        <label className="block text-sm mb-1" htmlFor="m-excerpt">Résumé</label>
        <input id="m-excerpt" className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-600)]" />
      </div>
      <div className="space-y-2">
        <label className="block text-sm mb-1" htmlFor="m-pdf">PDF (optionnel)</label>
        <div className="flex items-center gap-3">
          <input id="m-pdf" type="file" accept="application/pdf" onChange={onUploadPdf} />
          {uploading && <span className="text-xs text-neutral-600">Import…</span>}
        </div>
        {pdfUrl && (
          <p className="text-xs text-neutral-700">PDF importé: {pdfUrl}</p>
        )}
        <div className="text-xs text-neutral-600">Ou collez un lien:</div>
        <input id="m-pdf-link" className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-600)]" placeholder="https://.../magazine.pdf" />
      </div>
      <div className="space-y-2">
        <label className="block text-sm" htmlFor="m-file">Couverture</label>
        <div className="flex items-center gap-3">
          <input id="m-file" type="file" accept="image/*" onChange={onUpload} />
          {uploading && <span className="text-xs text-neutral-600">Import…</span>}
        </div>
        {coverUrl && (
          <div className="border rounded-md p-2 inline-block bg-neutral-50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={coverUrl} alt="couverture" className="h-40 w-auto object-cover" />
            <p className="text-xs mt-1 text-neutral-700">URL: {coverUrl}</p>
          </div>
        )}
      </div>
  <PublishButton label={saving ? "Publication…" : "Publier le magazine"} onPublish={async () => {
        setSaving(true);
        try {
          const title = (document.getElementById("m-title") as HTMLInputElement | null)?.value?.trim() || "";
          const issue = (document.getElementById("m-issue") as HTMLInputElement | null)?.value?.trim() || "";
          const excerpt = (document.getElementById("m-excerpt") as HTMLInputElement | null)?.value?.trim() || undefined;
          const pdfLink = (document.getElementById("m-pdf-link") as HTMLInputElement | null)?.value?.trim() || undefined;
          const payload = { title, issue, excerpt, image: coverUrl ?? undefined, pdfUrl: pdfUrl || pdfLink };
          const res = await fetch("/api/magazines", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
          const j = await res.json().catch(() => ({}));
          if (!res.ok || !j?.ok) {
            // Si c'est une erreur 401 (non autorisé), lancer une erreur pour déclencher la redirection
            if (res.status === 401) {
              throw new Error("Authentication required");
            }
            alert(j?.error || "Échec de la publication du magazine");
          } else if (onCreated) onCreated();
        } finally { setSaving(false); }
      }} />
    </form>
  );
}

function VideoForm({ onCreated }: { onCreated?: () => void }) {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const fd = new FormData();
    fd.set("file", f);
    setUploading(true);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const j = await res.json();
      if (j?.ok) setVideoUrl(j.url);
    } finally {
      setUploading(false);
    }
  }
  return (
    <form className="space-y-4">
      <div>
        <label className="block text-sm mb-1" htmlFor="v-title">Titre</label>
        <input id="v-title" className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-600)]" />
      </div>
      <div>
        <label className="block text-sm mb-1" htmlFor="v-excerpt">Résumé</label>
        <input id="v-excerpt" className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-600)]" />
      </div>
      <div>
        <label className="block text-sm mb-1" htmlFor="v-duration">Durée (ex: 12:34)</label>
        <input id="v-duration" className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-600)]" />
      </div>
      <div className="space-y-2">
        <label className="block text-sm" htmlFor="v-file">Importer une vidéo</label>
        <div className="flex items-center gap-3">
          <input id="v-file" type="file" accept="video/*" onChange={onUpload} />
          {uploading && <span className="text-xs text-neutral-600">Import…</span>}
        </div>
        {videoUrl && (
          <div className="border rounded-md p-2 bg-neutral-50">
            <video controls className="w-full max-h-60">
              <source src={videoUrl} />
            </video>
            <p className="text-xs mt-1 text-neutral-700">URL: {videoUrl}</p>
          </div>
        )}
      </div>
  <PublishButton label={saving ? "Publication…" : "Publier la vidéo"} onPublish={async () => {
        setSaving(true);
        try {
          const title = (document.getElementById("v-title") as HTMLInputElement | null)?.value?.trim() || "";
          const excerpt = (document.getElementById("v-excerpt") as HTMLInputElement | null)?.value?.trim() || undefined;
          const duration = (document.getElementById("v-duration") as HTMLInputElement | null)?.value?.trim() || undefined;
          const payload = { title, videoUrl: videoUrl || "", excerpt, image: undefined as string | undefined, duration };
          const res = await fetch("/api/videos", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
          const j = await res.json().catch(() => ({}));
          if (!res.ok || !j?.ok) {
            // Si c'est une erreur 401 (non autorisé), lancer une erreur pour déclencher la redirection
            if (res.status === 401) {
              throw new Error("Authentication required");
            }
            alert(j?.error || "Échec de la publication de la vidéo");
          } else if (onCreated) onCreated();
        } finally { setSaving(false); }
      }} />
    </form>
  );
}

function PublishButton({ label, onPublish }: { label: string; onPublish?: () => Promise<void> | void }) {
  const [checking, setChecking] = useState(false);
  async function onClick() {
    setChecking(true);
    try {
      if (onPublish) {
        await onPublish();
      } else {
        // À faire: procéder à l'enregistrement (non implémenté ici)
        alert("Authentifié: action de publication à brancher.");
      }
    } catch (error: any) {
      console.error("Erreur:", error);
      
      // Vérifier si l'erreur est spécifiquement liée à l'authentification
      if (error?.status === 401 || error?.message?.includes('401') || error?.message?.includes('unauthorized')) {
        alert("Vous devez vous connecter pour publier. Vous allez être redirigé vers la page de connexion.\n\nCode par défaut: admin123");
        window.location.href = "/admin?next=/publier";
      } else {
        // Pour les autres erreurs, afficher le message d'erreur réel
        alert(`Erreur lors de la publication: ${error?.message || 'Erreur inconnue'}`);
      }
    } finally {
      setChecking(false);
    }
  }
  return (
    <button type="button" onClick={onClick} disabled={checking} className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-white bg-[var(--brand-600)] hover:bg-[var(--brand-700)] disabled:opacity-60">
      {checking ? "Vérification…" : label}
    </button>
  );
}

function InlineEditCard({ article, onCancel, onSaved }: { article: ArticleLite; onCancel: () => void; onSaved: (upd: ArticleLite) => void }) {
  const [title, setTitle] = useState(article.title);
  const [excerpt, setExcerpt] = useState(article.excerpt || "");
  const [body, setBody] = useState(article.body || "");
  const [rubrique, setRubrique] = useState<string>(article.rubrique || RUBRIQUES[0]?.slug || "");
  const [saving, setSaving] = useState(false);
  return (
    <div className="border rounded-lg bg-white p-4">
      <div className="grid gap-3">
        <div>
          <label className="block text-xs mb-1">Titre</label>
          <input aria-label="Titre" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm" />
        </div>
        <div>
          <label className="block text-xs mb-1">Rubrique</label>
          <select aria-label="Rubrique" value={rubrique} onChange={(e) => setRubrique(e.target.value)} className="w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm bg-white">
            {RUBRIQUES.map((r) => (
              <option key={r.slug} value={r.slug}>{r.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs mb-1">Résumé</label>
          <input aria-label="Résumé" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} className="w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm" />
        </div>
        <div>
          <label className="block text-xs mb-1">Contenu</label>
          <textarea aria-label="Contenu" value={body} onChange={(e) => setBody(e.target.value)} rows={6} className="w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm" />
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <button
          disabled={saving}
          onClick={async () => {
            setSaving(true);
            try {
              const payload = { title, excerpt, body, rubrique };
              const res = await fetch(`/api/articles/${article.id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
              const j = await res.json().catch(() => ({}));
              if (!res.ok || !j?.ok) return alert(j?.error || "Mise à jour échouée");
              onSaved({ ...article, title, excerpt, body, rubrique });
            } finally {
              setSaving(false);
            }
          }}
          className="rounded-md px-3 py-1.5 text-sm font-medium text-white bg-[var(--brand-600)] hover:bg-[var(--brand-700)] disabled:opacity-60"
        >{saving ? "Enregistrement…" : "Enregistrer"}</button>
        <button onClick={onCancel} className="rounded-md px-3 py-1.5 text-sm border border-neutral-300 hover:bg-neutral-50">Annuler</button>
      </div>
    </div>
  );
}

function InlineEditMagazine({ magazine, onCancel, onSaved }: { magazine: MagazineLite; onCancel: () => void; onSaved: (upd: MagazineLite) => void }) {
  const [title, setTitle] = useState(magazine.title);
  const [issue, setIssue] = useState(magazine.issue);
  const [excerpt, setExcerpt] = useState(magazine.excerpt || "");
  const [pdfUrl, setPdfUrl] = useState(magazine.pdfUrl || "");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  async function onUploadPdf(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const fd = new FormData();
    fd.set("file", f);
    setUploading(true);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const j = await res.json();
      if (j?.ok) setPdfUrl(j.url);
    } finally { setUploading(false); }
  }
  return (
    <div className="border rounded-lg bg-white p-4">
      <div className="grid gap-3">
        <div>
          <label className="block text-xs mb-1">Titre</label>
          <input aria-label="Titre" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm" />
        </div>
        <div>
          <label className="block text-xs mb-1">Numéro</label>
          <input aria-label="Numéro" value={issue} onChange={(e) => setIssue(e.target.value)} className="w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm" />
        </div>
        <div>
          <label className="block text-xs mb-1">Résumé</label>
          <input aria-label="Résumé" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} className="w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm" />
        </div>
        <div className="space-y-2">
          <label className="block text-xs mb-1">PDF</label>
          <div className="flex items-center gap-3">
            <input aria-label="Importer le PDF" type="file" accept="application/pdf" onChange={onUploadPdf} />
            {uploading && <span className="text-xs text-neutral-600">Import…</span>}
          </div>
          <input aria-label="Lien PDF" value={pdfUrl} onChange={(e) => setPdfUrl(e.target.value)} className="w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm" placeholder="https://.../magazine.pdf" />
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <button disabled={saving} onClick={async () => {
          setSaving(true);
          try {
            const payload = { title, issue, excerpt, pdfUrl: pdfUrl || undefined };
            const res = await fetch(`/api/magazines/${magazine.id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
            const j = await res.json().catch(() => ({}));
            if (!res.ok || !j?.ok) return alert(j?.error || "Mise à jour échouée");
            onSaved({ ...magazine, title, issue, excerpt, pdfUrl: pdfUrl || undefined });
          } finally { setSaving(false); }
        }} className="rounded-md px-3 py-1.5 text-sm font-medium text-white bg-[var(--brand-600)] hover:bg-[var(--brand-700)] disabled:opacity-60">{saving ? "Enregistrement…" : "Enregistrer"}</button>
        <button onClick={onCancel} className="rounded-md px-3 py-1.5 text-sm border border-neutral-300 hover:bg-neutral-50">Annuler</button>
      </div>
    </div>
  );
}

function InlineEditVideo({ video, onCancel, onSaved }: { video: VideoLite; onCancel: () => void; onSaved: (upd: VideoLite) => void }) {
  const [title, setTitle] = useState(video.title);
  const [excerpt, setExcerpt] = useState(video.excerpt || "");
  const [videoUrl, setVideoUrl] = useState(video.videoUrl);
  const [duration, setDuration] = useState(video.duration || "");
  const [saving, setSaving] = useState(false);
  return (
    <div className="border rounded-lg bg-white p-4">
      <div className="grid gap-3">
        <div>
          <label className="block text-xs mb-1">Titre</label>
          <input aria-label="Titre" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm" />
        </div>
        <div>
          <label className="block text-xs mb-1">Résumé</label>
          <input aria-label="Résumé" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} className="w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm" />
        </div>
        <div>
          <label className="block text-xs mb-1">URL vidéo</label>
          <input aria-label="URL vidéo" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} className="w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm" placeholder="https://..." />
        </div>
        <div>
          <label className="block text-xs mb-1">Durée</label>
          <input aria-label="Durée" value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm" placeholder="12:34" />
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <button disabled={saving} onClick={async () => {
          setSaving(true);
          try {
            const payload = { title, excerpt, videoUrl, duration };
            const res = await fetch(`/api/videos/${video.id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
            const j = await res.json().catch(() => ({}));
            if (!res.ok || !j?.ok) return alert(j?.error || "Mise à jour échouée");
            onSaved({ ...video, title, excerpt, videoUrl, duration });
          } finally { setSaving(false); }
        }} className="rounded-md px-3 py-1.5 text-sm font-medium text-white bg-[var(--brand-600)] hover:bg-[var(--brand-700)] disabled:opacity-60">{saving ? "Enregistrement…" : "Enregistrer"}</button>
        <button onClick={onCancel} className="rounded-md px-3 py-1.5 text-sm border border-neutral-300 hover:bg-neutral-50">Annuler</button>
      </div>
    </div>
  );
}
