const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const rubriques = [
    { slug: 'mines-petrole-gaz', label: "NOTE D’INFORMATION" },
    { slug: 'economie-finance', label: "ENQUÊTES & INVESTIGATIONS" },
    { slug: 'actualite-societe', label: "ANALYSE DES SITUATIONS" },
    { slug: 'environnement-energie', label: "FLASH NOTE" },
    { slug: 'communication-information', label: "DECOUVERTE" },
    { slug: 'batiment-travaux', label: "INTERVIEW" },
    { slug: 'entreprise-entreprenariat', label: "PLAIDOYER" },
    { slug: 'tribune', label: "TRIBUNE" },
  ];
  for (const r of rubriques) {
    await prisma.rubrique.upsert({
      where: { slug: r.slug },
      update: { label: r.label },
      create: r,
    });
  }

  // Données de test pour les magazines
  const magazines = [
    {
      slug: "magazine-fintech-afrique-n12",
      title: "Dossier spécial: FinTech en Afrique",
      excerpt: "Panorama des champions et des régulations.",
      image: "/images/magazines/fintech.svg",
      issue: "N°12 - Août 2025",
      pdfUrl: "#",
      status: "published",
      publishedAt: new Date(),
    },
    {
      slug: "magazine-mines-energie-n11",
      title: "Mines & Énergie: enjeux 2025",
      excerpt: "Prix, investissements et transition.",
      image: "/images/magazines/fintech.svg",
      issue: "N°11 - Juillet 2025",
      pdfUrl: "#",
      status: "published",
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
    },
  ];
  for (const m of magazines) {
    await prisma.magazine.upsert({
      where: { slug: m.slug },
      update: {
        title: m.title,
        excerpt: m.excerpt,
        image: m.image,
        issue: m.issue,
        pdfUrl: m.pdfUrl,
        status: m.status,
        publishedAt: m.publishedAt,
      },
      create: m,
    });
  }

  // Données de test pour les vidéos
  const videos = [
    {
      slug: "interview-strategie-industrielle-maroc",
      title: "Interview: stratégie industrielle au Maroc",
      excerpt: "Entretien avec un expert de la politique industrielle.",
      image: "/images/videos/maroc.svg",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      duration: "14:52",
      status: "published",
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    },
  ];
  for (const v of videos) {
    await prisma.video.upsert({
      where: { slug: v.slug },
      update: {
        title: v.title,
        excerpt: v.excerpt,
        image: v.image,
        videoUrl: v.videoUrl,
        duration: v.duration,
        status: v.status,
        publishedAt: v.publishedAt,
      },
      create: v,
    });
  }
}

main().then(() => prisma.$disconnect()).catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
