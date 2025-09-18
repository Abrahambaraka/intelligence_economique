"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Article } from "@/lib/types";
import { getBlurDataURL } from "@/lib/image-utils";

interface FeaturedCarouselProps {
  articles: Article[];
}

export function FeaturedCarousel({ articles }: FeaturedCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const displayArticles = articles.slice(0, 3); // Les 3 derniers articles

  useEffect(() => {
    if (displayArticles.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === displayArticles.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change toutes les 5 secondes

    return () => clearInterval(interval);
  }, [displayArticles.length]);

  if (displayArticles.length === 0) return null;

  const currentArticle = displayArticles[currentIndex];

  return (
    <div className="relative">
      {/* Article principal */}
      <div className="transition-opacity duration-500">
        <Link href={`/articles/${currentArticle.slug}`} className="group block">
          {currentArticle.image && (
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg mb-4">
              <Image
                src={currentArticle.image}
                alt={currentArticle.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
                priority={true}
                placeholder="blur"
                blurDataURL={getBlurDataURL(800, 450)}
              />
            </div>
          )}
          <div className="space-y-2">
            <h1 className="text-xl md:text-2xl font-bold leading-tight group-hover:text-[var(--brand-600)] transition-colors">
              {currentArticle.title}
            </h1>
            {currentArticle.excerpt && (
              <p className="text-neutral-600 leading-relaxed line-clamp-3">
                {currentArticle.excerpt}
              </p>
            )}
            <div className="flex items-center gap-4 text-sm text-neutral-500">
              {currentArticle.author && <span>{currentArticle.author}</span>}
              <span>
                {new Date(currentArticle.publishedAt).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </span>
            </div>
          </div>
        </Link>
      </div>

      {/* Indicateurs de pagination */}
      {displayArticles.length > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          {displayArticles.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex 
                  ? 'bg-[var(--brand-600)]' 
                  : 'bg-neutral-300 hover:bg-neutral-400'
              }`}
              aria-label={`Afficher l'article ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Navigation */}
      {displayArticles.length > 1 && (
        <>
          <button
            onClick={() => setCurrentIndex(currentIndex === 0 ? displayArticles.length - 1 : currentIndex - 1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
            aria-label="Article précédent"
          >
            ‹
          </button>
          <button
            onClick={() => setCurrentIndex(currentIndex === displayArticles.length - 1 ? 0 : currentIndex + 1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
            aria-label="Article suivant"
          >
            ›
          </button>
        </>
      )}
    </div>
  );
}
