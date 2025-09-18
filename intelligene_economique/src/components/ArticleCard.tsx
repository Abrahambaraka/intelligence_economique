import Link from "next/link";
import Image from "next/image";
import { Article } from "@/lib/types";
import { formatDateFR } from "@/lib/utils";
import { getBlurDataURL } from "@/lib/image-utils";

export function ArticleCard({ a }: { a: Article }) {
  return (
  <article className="rounded-lg overflow-hidden bg-white border border-neutral-200 hover:shadow-sm transition-shadow">
      {a.image && (
        <div className="relative w-full bg-neutral-100">
          <Image 
            src={a.image} 
            alt={a.title}
            width={300}
            height={200}
            className="w-full h-auto hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 90vw, (max-width: 1200px) 40vw, 300px"
            priority={false}
            placeholder="blur"
            blurDataURL={getBlurDataURL(400, 300)}
          />
        </div>
      )}
      <div className="p-3 sm:p-4">
        <p className="text-[10px] sm:text-xs uppercase text-neutral-500 mb-1">{a.category ?? ""}</p>
        <h3 className="font-semibold text-base sm:text-lg leading-snug mb-2 line-clamp-2">
          <Link href={`/articles/${a.slug}`} className="hover:underline hover:text-[var(--brand-600)]">
            {a.title}
          </Link>
        </h3>
        <p className="text-[13px] sm:text-sm text-neutral-600 line-clamp-3 mb-3">{a.excerpt}</p>
        <p className="text-[11px] sm:text-xs text-neutral-500">{formatDateFR(a.publishedAt)}</p>
      </div>
    </article>
  );
}

export function FeaturedArticle({ a }: { a: Article }) {
  return (
  <article className="relative overflow-hidden rounded-xl bg-white border border-neutral-200 hover:shadow-sm transition-shadow">
      {a.image && (
        <div className="relative w-full bg-neutral-100">
          <Image 
            src={a.image} 
            alt={a.title}
            width={600}
            height={400}
            className="w-full h-auto hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 90vw, (max-width: 1200px) 70vw, 600px"
            priority={true}
            placeholder="blur"
            blurDataURL={getBlurDataURL(800, 600)}
          />
        </div>
      )}
  <div className="p-4 sm:p-5">
        <p className="text-[10px] sm:text-xs uppercase text-neutral-500 mb-1">{a.category ?? "À la Une"}</p>
        <h2 className="text-xl sm:text-2xl font-bold leading-tight mb-2">
          <Link href={`/articles/${a.slug}`} className="hover:underline hover:text-[var(--brand-600)]">
            {a.title}
          </Link>
        </h2>
        <p className="text-sm sm:text-base text-neutral-700 mb-3">{a.excerpt}</p>
        <p className="text-[11px] sm:text-xs text-neutral-500">{formatDateFR(a.publishedAt)}</p>
      </div>
    </article>
  );
}
