// Script de préparation finale pour déploiement Hostinger
const fs = require('fs');
const path = require('path');

function checkDeploymentReadiness() {
  console.log("🔍 VÉRIFICATION FINALE AVANT DÉPLOIEMENT HOSTINGER\n");

  let checks = [];
  let warnings = [];
  let errors = [];

  // 1. Vérifier que le build existe
  const buildExists = fs.existsSync('.next');
  checks.push({
    name: "Build de production",
    status: buildExists ? "✅" : "❌",
    details: buildExists ? "Build .next/ présent" : "Exécutez 'npm run build' d'abord"
  });
  if (!buildExists) errors.push("Build manquant");

  // 2. Vérifier package.json
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  checks.push({
    name: "Package.json",
    status: "✅",
    details: `Version ${packageJson.version}, ${Object.keys(packageJson.dependencies).length} dépendances`
  });

  // 3. Vérifier les dépendances MySQL
  const hasMysql = packageJson.dependencies['mysql2'];
  checks.push({
    name: "Driver MySQL",
    status: hasMysql ? "✅" : "❌",
    details: hasMysql ? `mysql2 v${hasMysql}` : "mysql2 manquant"
  });
  if (!hasMysql) errors.push("Driver MySQL manquant");

  // 4. Vérifier les fichiers environnement
  const envFiles = [
    { file: '.env.production', required: true },
    { file: '.env.hostinger', required: false }
  ];

  envFiles.forEach(env => {
    const exists = fs.existsSync(env.file);
    checks.push({
      name: `Fichier ${env.file}`,
      status: exists ? "✅" : (env.required ? "❌" : "⚠️"),
      details: exists ? "Présent" : "À configurer avec vos identifiants"
    });
    if (!exists && env.required) {
      errors.push(`${env.file} manquant`);
    } else if (!exists) {
      warnings.push(`${env.file} optionnel mais recommandé`);
    }
  });

  // 5. Vérifier le schéma Prisma
  const schemaContent = fs.readFileSync('prisma/schema.prisma', 'utf8');
  const isMySQL = schemaContent.includes('provider = "mysql"');
  checks.push({
    name: "Schema Prisma",
    status: isMySQL ? "✅" : "⚠️",
    details: isMySQL ? "Configuré pour MySQL" : "Configuré pour SQLite (local)"
  });
  if (!isMySQL) warnings.push("Schema pas encore en MySQL");

  // 6. Vérifier les dossiers critiques
  const criticalDirs = [
    { dir: 'public', required: true },
    { dir: 'prisma', required: true },
    { dir: '.next', required: true }
  ];

  criticalDirs.forEach(dirInfo => {
    const exists = fs.existsSync(dirInfo.dir);
    checks.push({
      name: `Dossier ${dirInfo.dir}/`,
      status: exists ? "✅" : "❌",
      details: exists ? "Présent" : "Manquant"
    });
    if (!exists && dirInfo.required) {
      errors.push(`Dossier ${dirInfo.dir} manquant`);
    }
  });

  // 7. Vérifier la taille du build
  const buildSize = getBuildSize('.next');
  checks.push({
    name: "Taille du build",
    status: buildSize > 0 ? "✅" : "❌",
    details: buildSize > 0 ? `${(buildSize / 1024 / 1024).toFixed(1)} MB` : "Indéterminée"
  });

  // Affichage des résultats
  console.log("📋 RÉSULTATS DE LA VÉRIFICATION :");
  console.log("=" .repeat(50));
  
  checks.forEach(check => {
    console.log(`${check.status} ${check.name.padEnd(20)} → ${check.details}`);
  });

  console.log("\n🎯 PROCHAINES ÉTAPES HOSTINGER :");
  console.log("=" .repeat(50));
  
  if (errors.length > 0) {
    console.log("❌ ERREURS À CORRIGER :");
    errors.forEach(error => console.log(`   • ${error}`));
    console.log("\n🔧 ACTIONS REQUISES :");
    if (errors.includes("Build manquant")) console.log("   1. Exécutez: npm run build");
    if (errors.includes("Driver MySQL manquant")) console.log("   2. Exécutez: npm install mysql2");
    if (errors.includes(".env.production manquant")) console.log("   3. Créez .env.production avec vos identifiants MySQL");
    return false;
  }

  if (warnings.length > 0) {
    console.log("⚠️ AVERTISSEMENTS :");
    warnings.forEach(warning => console.log(`   • ${warning}`));
    console.log("");
  }

  console.log("✅ ÉTAPES MANUELLES SUR HOSTINGER :");
  console.log("   1. 🗄️ Créer la base MySQL dans votre panneau");
  console.log("   2. 📝 Noter les identifiants de connexion");
  console.log("   3. ✏️ Modifier .env.production avec vos vraies infos");
  console.log("   4. 🚀 Lancer: npm run deploy:hostinger");
  
  console.log("\n📖 DOCUMENTATION COMPLÈTE :");
  console.log("   → Voir HOSTINGER_DEPLOYMENT.md");
  console.log("   → Voir HOSTINGER_DATABASE.md");

  console.log("\n🎉 PROJET PRÊT POUR LE DÉPLOIEMENT HOSTINGER !");
  return true;
}

function getBuildSize(dir) {
  try {
    let size = 0;
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        size += getBuildSize(filePath);
      } else {
        size += stat.size;
      }
    });
    return size;
  } catch (error) {
    return 0;
  }
}

// Exécuter la vérification
const ready = checkDeploymentReadiness();
process.exit(ready ? 0 : 1);