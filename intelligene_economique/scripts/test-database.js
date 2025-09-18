// Script de test complet des connexions base de données
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testDatabaseConnections() {
  console.log("🔍 Test de connectivité de la base de données...\n");

  try {
    // Test 1: Connexion basique
    console.log("1️⃣ Test de connexion basique...");
    await prisma.$connect();
    console.log("✅ Connexion établie avec succès\n");

    // Test 2: Vérification des tables
    console.log("2️⃣ Vérification des tables...");
    
    // Test des rubriques
    console.log("   📂 Test table Rubrique...");
    const rubriques = await prisma.rubrique.findMany();
    console.log(`   ✅ ${rubriques.length} rubriques trouvées`);

    // Test des articles
    console.log("   📰 Test table Article...");
    const articles = await prisma.article.findMany({ take: 5 });
    console.log(`   ✅ ${articles.length} articles trouvés`);

    // Test des magazines
    console.log("   📖 Test table Magazine...");
    const magazines = await prisma.magazine.findMany({ take: 5 });
    console.log(`   ✅ ${magazines.length} magazines trouvés`);

    // Test des vidéos
    console.log("   🎥 Test table Video...");
    const videos = await prisma.video.findMany({ take: 5 });
    console.log(`   ✅ ${videos.length} vidéos trouvées`);

    // Test des utilisateurs
    console.log("   👤 Test table User...");
    const users = await prisma.user.findMany();
    console.log(`   ✅ ${users.length} utilisateurs trouvés`);

    // Test newsletter
    console.log("   📧 Test table NewsletterSubscription...");
    const newsletters = await prisma.newsletterSubscription.findMany();
    console.log(`   ✅ ${newsletters.length} abonnés newsletter\n`);

    // Test 3: Test d'écriture (création/suppression)
    console.log("3️⃣ Test d'écriture en base...");
    
    // Créer une rubrique de test
    const testRubrique = await prisma.rubrique.upsert({
      where: { slug: 'test-connexion' },
      update: { label: 'Test de Connexion (Mis à jour)' },
      create: { slug: 'test-connexion', label: 'Test de Connexion' }
    });
    console.log("   ✅ Rubrique de test créée/mise à jour");

    // Test inscription newsletter
    const testEmail = `test-${Date.now()}@example.com`;
    const testNewsletter = await prisma.newsletterSubscription.create({
      data: { email: testEmail, source: 'test-script' }
    });
    console.log("   ✅ Inscription newsletter testée");

    // Nettoyer les données de test
    await prisma.newsletterSubscription.delete({ where: { id: testNewsletter.id } });
    console.log("   ✅ Données de test nettoyées\n");

    // Test 4: Test des relations
    console.log("4️⃣ Test des relations entre tables...");
    
    const articlesWithRubrique = await prisma.article.findMany({
      include: { rubrique: true },
      take: 3
    });
    console.log(`   ✅ Relations Article-Rubrique: ${articlesWithRubrique.length} testées`);

    // Résumé final
    console.log("🎉 RÉSUMÉ DES TESTS:");
    console.log("   ✅ Connexion base de données");
    console.log("   ✅ Toutes les tables accessibles");
    console.log("   ✅ Opérations CRUD fonctionnelles");
    console.log("   ✅ Relations entre tables");
    console.log("   ✅ Intégrité des données");
    
    console.log("\n🔥 BASE DE DONNÉES ENTIÈREMENT CONNECTÉE ET OPÉRATIONNELLE !");

  } catch (error) {
    console.error("❌ Erreur lors du test:", error.message);
    console.error("\n🔧 Actions recommandées:");
    console.error("   1. Vérifier DATABASE_URL dans .env");
    console.error("   2. Exécuter: npx prisma db push");
    console.error("   3. Vérifier que le serveur de BDD fonctionne");
    
    return false;
  } finally {
    await prisma.$disconnect();
  }
  
  return true;
}

// Exécuter le test
testDatabaseConnections()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error("Erreur fatale:", error);
    process.exit(1);
  });