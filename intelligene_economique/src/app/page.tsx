import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { ArticleCard } from "@/components/ArticleCard";
import { FeaturedCarousel } from "@/components/FeaturedCarousel";
import type { Article } from "@/lib/types";

// Forcer le rendu dynamique pour toujours avoir les derniers articles
export const dynamic = 'force-dynamic';

export default async function Home() {
  const dbList = await prisma.article.findMany({
    where: { status: "published" },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    take: 12,
  });
  type DbArticle = typeof dbList[number];
  const articles: Article[] = dbList.map((a: DbArticle) => ({
    id: a.id,
    title: a.title,
    slug: a.slug,
    excerpt: a.excerpt ?? undefined,
    image: a.image ?? undefined,
    publishedAt: (a.publishedAt ?? a.createdAt).toISOString(),
    author: a.author ?? undefined,
    body: a.body,
    rubrique: a.rubriqueSlug ?? undefined, // Ajouter la rubrique pour un affichage cohérent
  }));
  // Récupérer les magazines et vidéos depuis la base
  const mags = await prisma.magazine.findMany({
    where: { status: "published" },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    take: 3,
  });
  const vids = await prisma.video.findMany({
    where: { status: "published" },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    take: 1,
  });
  return (
    <div>
      {/* Hero */}
      <section className="bg-white border-b border-neutral-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 pb-5 text-center">
          {/* Contenu du héros retiré sur demande */}
        </div>
      </section>

      {/* Sections composées */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Colonne gauche: Articles */}
          <section className="lg:col-span-8">
            <div className="rounded-lg border border-neutral-200 bg-white overflow-hidden">
              <div className="flex items-baseline justify-between px-4 py-3 border-b border-neutral-200">
                <h2 className="text-2xl md:text-3xl font-bold">À la une</h2>
                <Link href="/articles" className="text-sm hover:underline text-[var(--brand-600)]">Tous les articles</Link>
              </div>
              {articles.length > 0 && (
                <div className="p-4">
                  <FeaturedCarousel articles={articles} />
                  <div className="mt-6 pt-6 border-t border-neutral-200 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {articles.slice(3, 12).map((a: Article) => (
                      <ArticleCard key={a.id} a={a} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Colonne droite: Magazines + Vidéo mise en avant */}
      <aside className="lg:col-span-4 space-y-6">
            <section className="rounded-lg border border-neutral-200 bg-white overflow-hidden">
              <div className="flex items-baseline justify-between px-4 py-3 border-b border-neutral-200">
                <h2 className="text-lg font-bold">Magazines</h2>
                <Link href="/magazines" className="text-sm hover:underline text-[var(--brand-600)]">Tous</Link>
              </div>
              <div className="divide-y divide-neutral-200">
                {mags.map((m: { id: string; title: string; image: string | null; issue: string }) => (
                  <Link key={m.id} href="/magazines" className="group flex items-center gap-3 px-4 py-3 hover:bg-neutral-50">
                    {m.image && (
                      <div className="relative h-14 w-14 overflow-hidden rounded">
                        <Image 
                          src={m.image} 
                          alt={m.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                          sizes="56px"
                        />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate group-hover:text-[var(--brand-600)]">{m.title}</p>
                      <p className="text-xs text-neutral-600 truncate">{m.issue}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            <section className="rounded-lg border border-neutral-200 bg-white overflow-hidden">
              <div className="flex items-baseline justify-between px-4 py-3 border-b border-neutral-200">
                <h2 className="text-lg font-bold">Titres à la une</h2>
                <Link href="/articles" className="text-sm hover:underline text-[var(--brand-600)]">Tous</Link>
              </div>
              <div className="divide-y divide-neutral-200">
                {articles.slice(0, 5).map((a: Article) => (
                  <Link key={a.id} href={`/articles/${a.slug}`} className="block px-4 py-3 hover:bg-neutral-50 group">
                    <h3 className="font-medium text-sm leading-tight group-hover:text-[var(--brand-600)] line-clamp-2">{a.title}</h3>
                    <p className="text-xs text-neutral-500 mt-1">
                      {new Date(a.publishedAt).toLocaleDateString('fr-FR', { 
                        day: 'numeric', 
                        month: 'short',
                        year: 'numeric'
                      })}
                    </p>
                  </Link>
                ))}
              </div>
            </section>

            <section className="rounded-lg border border-neutral-200 bg-white overflow-hidden">
              <div className="flex items-baseline justify-between px-4 py-3 border-b border-neutral-200">
                <h2 className="text-lg font-bold">Vidéos</h2>
                <Link href="/videos" className="text-sm hover:underline text-[var(--brand-600)]">Toutes</Link>
              </div>
              {vids[0] && (
                <div>
                  {vids[0].videoUrl.includes("youtube.com") ? (
                    <div className="aspect-video w-full">
                      <iframe
                        className="h-full w-full"
                        src={vids[0].videoUrl}
                        title={vids[0].title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <video controls className="w-full h-auto">
                      <source src={vids[0].videoUrl} />
                    </video>
                  )}
                  <div className="p-4 border-t border-neutral-200">
                    <h3 className="font-semibold text-base mb-1">{vids[0].title}</h3>
                    <p className="text-sm text-neutral-600 line-clamp-2">{vids[0].excerpt}</p>
                  </div>
                </div>
              )}
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
