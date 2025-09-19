import { Article, Magazine, Video } from "./types";

export const articles: Article[] = [
  {
    id: "a1",
    title: "Investissements en Afrique: tendances 2025",
    slug: "investissements-afrique-tendances-2025",
    excerpt:
      "Analyse des flux d'investissements et des secteurs porteurs sur le continent.",
  image: "/images/articles/invest-afrique.svg",
    publishedAt: "2025-08-20",
    author: "Rédaction IE",
    tags: ["Investissement", "Afrique", "Marchés"],
  rubrique: "enquetes-investigations", // Utilise le slug de rubrique cohérent
    body:
      "Contenu de l'article fictif. Développer ultérieurement avec un CMS ou Markdown.",
  },
  {
    id: "a2",
    title: "Énergie: le pari du gaz naturel liquéfié",
    slug: "energie-pari-gnl",
    excerpt: "Le GNL accélère sa percée dans plusieurs économies africaines.",
  image: "/images/articles/gnl.svg",
    publishedAt: "2025-08-18",
    author: "Rédaction IE",
    tags: ["Énergie", "GNL"],
  rubrique: "flash-note", // Utilise le slug de rubrique cohérent
    body: "Contenu d'exemple.",
  },
  {
    id: "a3",
    title: "Banque: la consolidation s'accélère en Afrique de l'Ouest",
    slug: "banque-consolidation-afrique-ouest",
    excerpt: "Fusion-acquisitions et nouveaux entrants bousculent la donne.",
    image: "/images/articles/invest-afrique.svg",
    publishedAt: "2025-08-15",
    author: "Rédaction IE",
    tags: ["Banque", "Finance"],
  rubrique: "enquetes-investigations", // Utilise le slug de rubrique cohérent
    body: "Contenu d'exemple.",
  },
  {
    id: "a4",
    title: "Télécoms: la 5G franchit un cap",
    slug: "telecoms-5g-cap",
    excerpt: "Calendriers, fréquences et cas d'usages prioritaires.",
    image: "/images/articles/gnl.svg",
    publishedAt: "2025-08-12",
    author: "Rédaction IE",
    tags: ["Télécoms", "5G"],
  rubrique: "decouverte", // Utilise le slug de rubrique cohérent
    body: "Contenu d'exemple.",
  },
  {
    id: "a5",
    title: "Mines: cuivre et cobalt sous tension",
    slug: "mines-cuivre-cobalt-tension",
    excerpt: "Des prix volatils et des chaînes d'approvisionnement à sécuriser.",
    image: "/images/articles/invest-afrique.svg",
    publishedAt: "2025-08-09",
    author: "Rédaction IE",
    tags: ["Mines", "Matières premières"],
  rubrique: "note-information", // Utilise le slug de rubrique cohérent
    body: "Contenu d'exemple.",
  },
  {
    id: "a6",
    title: "Société: urbanisation et services publics",
    slug: "societe-urbanisation-services-publics",
    excerpt: "Les défis d'une urbanisation rapide et les réponses locales.",
    image: "/images/articles/gnl.svg",
    publishedAt: "2025-08-07",
    author: "Rédaction IE",
    tags: ["Société", "Urbanisation"],
    rubrique: "analyse-situations", // Utilise le slug de rubrique cohérent
    body: "Contenu d'exemple.",
  },
  {
    id: "a7",
    title: "BTP: chantiers d'infrastructures structurants",
    slug: "btp-chantiers-infrastructures-structurants",
    excerpt: "Routes, ports et logements: où en sont les grands projets?",
    image: "/images/articles/invest-afrique.svg",
    publishedAt: "2025-08-05",
    author: "Rédaction IE",
    tags: ["BTP", "Infrastructures"],
    rubrique: "interview", // Utilise le slug de rubrique cohérent
    body: "Contenu d'exemple.",
  },
  {
    id: "a8",
    title: "PME: lever des fonds et scaler en Afrique",
    slug: "pme-lever-fonds-scaler-afrique",
    excerpt: "Bonnes pratiques pour l'entrepreneuriat et l'accès au capital.",
    image: "/images/articles/gnl.svg",
    publishedAt: "2025-08-03",
    author: "Rédaction IE",
    tags: ["Entrepreneuriat", "PME"],
    rubrique: "plaidoyer", // Utilise le slug de rubrique cohérent
    body: "Contenu d'exemple.",
  },
];

export const magazines: Magazine[] = [
  {
    id: "m1",
    title: "Dossier spécial: FinTech en Afrique",
    slug: "magazine-fintech-afrique-n12",
    excerpt: "Panorama des champions et des régulations.",
  image: "/images/magazines/fintech.svg",
    publishedAt: "2025-08-01",
    issue: "N°12 - Août 2025",
  pdfUrl: "#",
  },
];

export const videos: Video[] = [
  {
    id: "v1",
    title: "Interview: stratégie industrielle au Maroc",
    slug: "interview-strategie-industrielle-maroc",
    excerpt: "Entretien avec un expert de la politique industrielle.",
  image: "/images/videos/maroc.svg",
    publishedAt: "2025-08-10",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "14:52",
  },
];
