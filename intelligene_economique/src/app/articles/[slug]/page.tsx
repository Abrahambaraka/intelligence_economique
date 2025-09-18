import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { ArticleContent } from "@/components/ArticleContent";
import { getBlurDataURL } from "@/lib/image-utils";

export default async function ArticleDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = await prisma.article.findUnique({ where: { slug } });
  if (!a) return notFound();
  const article = {
    id: a.id,
    title: a.title,
    slug: a.slug,
    excerpt: a.excerpt ?? undefined,
    image: a.image ?? undefined,
    publishedAt: (a.publishedAt ?? a.createdAt).toISOString(),
    author: a.author ?? undefined,
    body: a.body,
  };

  return (
    <div className="mx-auto max-w-2xl sm:max-w-3xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <article>
        <header className="mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight mb-4 text-neutral-900">
            {article.title}
          </h1>
          
          {article.excerpt && (
            <p className="text-base sm:text-lg text-neutral-600 leading-relaxed mb-4 font-medium">
              {article.excerpt}
            </p>
          )}
          
          <div className="flex items-center gap-4 text-xs sm:text-sm text-neutral-500 mb-6">
            <time dateTime={article.publishedAt}>
              Publié le {new Date(article.publishedAt).toLocaleDateString("fr-FR", {
                year: 'numeric',
                month: 'long', 
                day: 'numeric'
              })}
            </time>
            {article.author && (
              <>
                <span>•</span>
                <span>Par {article.author}</span>
              </>
            )}
          </div>
        </header>

        {article.image && (
          <figure className="mb-8">
            <div className="relative w-full max-w-lg mx-auto bg-neutral-100 rounded-lg shadow-lg">
              <Image 
                src={article.image} 
                alt={article.title}
                width={600}
                height={450}
                className="w-full h-auto rounded-lg hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 80vw, (max-width: 1200px) 60vw, 600px"
                priority={true}
                placeholder="blur"
                blurDataURL={getBlurDataURL(800, 400)}
              />
            </div>
            {article.title && (
              <figcaption className="mt-3 text-sm text-neutral-600 text-center italic">
                {article.title}
              </figcaption>
            )}
          </figure>
        )}

        <div className="prose prose-neutral max-w-none prose-lg">
          <div className="space-y-6">
            <ArticleContent content={article.body} />
          </div>
        </div>
      </article>
    </div>
  );
}
