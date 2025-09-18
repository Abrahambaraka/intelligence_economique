export type ContentBase = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  image?: string;
  publishedAt: string; // date ISO
  author?: string;
  tags?: string[];
};

export type Article = ContentBase & {
  body: string;
  category?: string;
  rubrique?: string; // slug issu de RUBRIQUES
};

export type Magazine = ContentBase & {
  issue: string; // ex: "N°12 - Août 2025"
  pdfUrl?: string;
};

export type Video = ContentBase & {
  videoUrl: string; // YouTube/Vimeo ou mp4
  duration?: string; // ex: "12:34"
};
