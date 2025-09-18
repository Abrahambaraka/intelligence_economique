const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addSampleArticles() {
  const articlesWithContent = [
    {
      slug: "investissements-afrique-tendances-2025",
      title: "Investissements en Afrique: tendances 2025",
      excerpt: "Analyse des flux d'investissements et des secteurs porteurs sur le continent africain.",
      body: `L'Afrique continue d'attirer les investisseurs internationaux, avec des tendances marquantes qui redéfinissent le paysage économique du continent.

Les secteurs technologiques et les énergies renouvelables figurent en tête des priorités, tandis que les infrastructures restent un défi majeur pour de nombreux pays.

La digitalisation accélérée

La transformation numérique s'impose comme le moteur principal de croissance. Les fintech africaines ont levé plus de 2 milliards de dollars en 2024, confirmant l'appétit des investisseurs pour ce secteur.

Les pays leaders comme le Nigeria, l'Afrique du Sud et le Kenya continuent de dominer, mais de nouveaux marchés émergent, notamment au Rwanda et en Côte d'Ivoire.

Défis et opportunités

Malgré ces succès, les défis demeurent : instabilité politique dans certaines régions, infrastructures insuffisantes et accès limité au financement pour les PME.

Les investisseurs misent désormais sur des approches plus durables et inclusives, intégrant les critères ESG dans leurs décisions.`,
      image: "/images/articles/invest-afrique.svg",
      author: "Rédaction IE",
      rubriqueSlug: "economie-finance",
      status: "published",
      publishedAt: new Date("2025-08-20")
    },
    {
      slug: "energie-pari-gnl",
      title: "Énergie: le pari du gaz naturel liquéfié",
      excerpt: "Le GNL accélère sa percée dans plusieurs économies africaines, transformant le paysage énergétique continental.",
      body: `Le gaz naturel liquéfié (GNL) s'impose progressivement comme une solution énergétique de transition pour l'Afrique, offrant des perspectives prometteuses pour plusieurs pays du continent.

Une révolution énergétique en marche

Le Mozambique, avec ses réserves importantes dans le bassin de Rovuma, ambitionne de devenir un acteur majeur du marché mondial du GNL. Les projets Coral Sul et Mozambique LNG devraient transformer l'économie du pays.

Au Nigeria, le secteur gazier connaît une dynamique nouvelle avec la mise en service du terminal flottant de Bonny Island, permettant au pays de diversifier ses exportations énergétiques.

L'Afrique du Sud explore également cette voie, cherchant à réduire sa dépendance au charbon tout en sécurisant son approvisionnement énergétique.

Défis techniques et financiers

La liquéfaction du gaz naturel nécessite des investissements considérables et une expertise technique avancée. Les partenariats avec des groupes internationaux comme Total, ENI ou ExxonMobil sont cruciaux.

Les questions de sécurité, notamment au Mozambique avec les tensions dans la province de Cabo Delgado, constituent un enjeu majeur pour la viabilité des projets.

Perspectives d'avenir

Malgré les défis, le GNL représente une opportunité unique pour l'Afrique de valoriser ses ressources gazières et de participer à la transition énergétique mondiale.`,
      image: "/images/articles/gnl.svg",
      author: "Rédaction IE",
      rubriqueSlug: "environnement-energie",
      status: "published", 
      publishedAt: new Date("2025-08-18")
    },
    {
      slug: "banque-consolidation-afrique-ouest",
      title: "Banque: la consolidation s'accélère en Afrique de l'Ouest",
      excerpt: "Fusion-acquisitions et nouveaux entrants bousculent la donne bancaire en Afrique de l'Ouest.",
      body: `Le secteur bancaire ouest-africain connaît une période de mutations profondes, marquée par une accélération des opérations de consolidation et l'émergence de nouveaux acteurs.

Les grandes manœuvres bancaires

L'acquisition d'UBA par Access Bank illustre cette tendance à la concentration. Cette opération créé un géant bancaire pan-africain capable de rivaliser avec les leaders historiques comme Ecobank ou Bank of Africa.

Les banques locales renforcent également leurs positions : Oragroup poursuit son expansion régionale, tandis qu'Atlantic Business International Bank (ABI) développe sa présence dans plusieurs pays de l'UEMOA.

L'arrivée de nouveaux acteurs

Les néobanques font leur apparition sur le marché, portées par la digitalisation croissante. Moov Money, Orange Money et Wave révolutionnent les services financiers, particulièrement pour les populations non bancarisées.

Les banques traditionnelles réagissent en investissant massivement dans la transformation digitale, développant des applications mobiles et des services en ligne pour répondre aux attentes de leur clientèle.

Enjeux réglementaires

La Banque Centrale des États de l'Afrique de l'Ouest (BCEAO) adapte sa réglementation pour accompagner ces mutations, tout en veillant à la stabilité du système financier régional.

Les ratios prudentiels sont renforcés, obligeant les établissements à consolider leurs fonds propres et à améliorer leur gouvernance.`,
      image: "/images/articles/invest-afrique.svg",
      author: "Rédaction IE",
      rubriqueSlug: "economie-finance",
      status: "published",
      publishedAt: new Date("2025-08-15")
    }
  ];

  for (const article of articlesWithContent) {
    await prisma.article.upsert({
      where: { slug: article.slug },
      update: {
        title: article.title,
        excerpt: article.excerpt,
        body: article.body,
        image: article.image,
        author: article.author,
        rubriqueSlug: article.rubriqueSlug,
        status: article.status,
        publishedAt: article.publishedAt,
      },
      create: article,
    });
    console.log(`Article créé/mis à jour: ${article.title}`);
  }
}

addSampleArticles()
  .then(() => {
    console.log('Articles avec contenu formaté ajoutés avec succès!');
    return prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
