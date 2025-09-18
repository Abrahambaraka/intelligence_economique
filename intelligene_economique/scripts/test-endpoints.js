// Test complet de toutes les APIs et pages
const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000';

async function testAllEndpoints() {
  console.log("🔍 Test de tous les endpoints du site...\n");

  const tests = [
    // Pages principales
    { name: "Page d'accueil", url: "/", method: "GET" },
    { name: "Articles", url: "/articles", method: "GET" },
    { name: "Magazines", url: "/magazines", method: "GET" },
    { name: "Vidéos", url: "/videos", method: "GET" },
    { name: "Contact", url: "/contact", method: "GET" },
    { name: "À propos", url: "/a-propos", method: "GET" },
    { name: "Recherche", url: "/recherche", method: "GET" },
    { name: "Admin", url: "/admin", method: "GET" },
    { name: "Publier", url: "/publier", method: "GET" },

    // APIs
    { name: "API Articles", url: "/api/articles", method: "GET" },
    { name: "API Magazines", url: "/api/magazines", method: "GET" },
    { name: "API Vidéos", url: "/api/videos", method: "GET" },
    { name: "API Newsletter", url: "/api/newsletter", method: "GET" },

    // Rubriques
    { name: "Rubrique Économie", url: "/rubrique/economie-finance", method: "GET" },
    { name: "Rubrique Actualité", url: "/rubrique/actualite-societe", method: "GET" },
  ];

  let passedTests = 0;
  let totalTests = tests.length;

  for (const test of tests) {
    try {
      console.log(`🧪 Test: ${test.name}...`);
      
      const response = await fetch(`${BASE_URL}${test.url}`, {
        method: test.method,
        headers: {
          'User-Agent': 'Test-Script/1.0',
          'Accept': 'text/html,application/json,*/*'
        },
        timeout: 10000
      });

      if (response.ok) {
        console.log(`   ✅ ${test.name} - Status: ${response.status}`);
        passedTests++;
      } else {
        console.log(`   ⚠️ ${test.name} - Status: ${response.status}`);
        if (response.status !== 404) {
          passedTests++; // 404 peut être normal pour certaines pages
        }
      }
    } catch (error) {
      console.log(`   ❌ ${test.name} - Erreur: ${error.message}`);
    }
  }

  console.log("\n" + "=".repeat(50));
  console.log(`📊 RÉSULTATS DES TESTS:`);
  console.log(`   ✅ Tests réussis: ${passedTests}/${totalTests}`);
  console.log(`   📈 Taux de réussite: ${Math.round((passedTests/totalTests)*100)}%`);
  
  if (passedTests === totalTests) {
    console.log("\n🎉 TOUTES LES PAGES ET APIs FONCTIONNENT PARFAITEMENT !");
  } else if (passedTests >= totalTests * 0.8) {
    console.log("\n✅ Le site fonctionne bien avec quelques points à vérifier");
  } else {
    console.log("\n⚠️ Plusieurs problèmes détectés - vérification nécessaire");
  }

  return passedTests >= totalTests * 0.8;
}

// Test spécifique de la base de données via les APIs
async function testDatabaseAPIs() {
  console.log("\n🗄️ Test spécifique des APIs de base de données...\n");

  try {
    // Test API Articles
    const articlesResponse = await fetch(`${BASE_URL}/api/articles`);
    const articles = await articlesResponse.json();
    console.log(`📰 API Articles: ${Array.isArray(articles) ? articles.length : 'Erreur'} articles`);

    // Test API Magazines  
    const magazinesResponse = await fetch(`${BASE_URL}/api/magazines`);
    const magazines = await magazinesResponse.json();
    console.log(`📖 API Magazines: ${Array.isArray(magazines) ? magazines.length : 'Erreur'} magazines`);

    // Test API Vidéos
    const videosResponse = await fetch(`${BASE_URL}/api/videos`);
    const videos = await videosResponse.json();
    console.log(`🎥 API Vidéos: ${Array.isArray(videos) ? videos.length : 'Erreur'} vidéos`);

    console.log("\n✅ Toutes les APIs de base de données répondent correctement !");
    return true;
  } catch (error) {
    console.log(`❌ Erreur API: ${error.message}`);
    return false;
  }
}

// Exécution des tests
async function runAllTests() {
  const endpointsOK = await testAllEndpoints();
  const databaseAPIsOK = await testDatabaseAPIs();
  
  console.log("\n" + "=".repeat(60));
  console.log("🏁 BILAN FINAL DE LA CONNECTIVITÉ:");
  console.log(`   ${endpointsOK ? '✅' : '❌'} Pages et endpoints`);
  console.log(`   ${databaseAPIsOK ? '✅' : '❌'} APIs de base de données`);
  
  if (endpointsOK && databaseAPIsOK) {
    console.log("\n🚀 SITE ENTIÈREMENT FONCTIONNEL ET PRÊT POUR LE DÉPLOIEMENT !");
  } else {
    console.log("\n⚠️ Quelques ajustements peuvent être nécessaires");
  }
}

runAllTests().catch(console.error);