const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const rubriques = [
    { slug: 'note-information', label: "NOTE D'INFORMATION" },
    { slug: 'enquetes-investigations', label: "ENQUÊTES & INVESTIGATIONS" },
    { slug: 'analyse-situations', label: "ANALYSE DES SITUATIONS" },
    { slug: 'flash-note', label: "FLASH NOTE" },
    { slug: 'decouverte', label: "DECOUVERTE" },
    { slug: 'interview', label: "INTERVIEW" },
    { slug: 'plaidoyer', label: "PLAIDOYER" },
    { slug: 'tribune', label: "TRIBUNE" },
  ];
  
  for (const r of rubriques) {
    await prisma.rubrique.upsert({
      where: { slug: r.slug },
      update: { label: r.label },
      create: r,
    });
  }

  console.log('Données de test créées avec succès');
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
