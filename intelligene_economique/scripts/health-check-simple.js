const fs = require('fs');
const path = require('path');

console.log('🏥 Vérification de santé du site Intelligence Économique');
console.log('=====================================================');

let healthScore = 100;
let issues = [];
let warnings = [];

// Fichiers critiques à vérifier
const criticalFiles = [
  { path: 'next.config.js', essential: true },
  { path: 'package.json', essential: true },
  { path: 'tsconfig.json', essential: true },
  { path: 'prisma/schema.prisma', essential: true },
  { path: 'src/app/layout.tsx', essential: true },
  { path: 'src/app/page.tsx', essential: true },
  { path: 'src/app/globals.css', essential: true },
  { path: 'src/lib/prisma.ts', essential: true },
  { path: 'src/lib/types.ts', essential: true }
];

// Vérification des fichiers
console.log('📋 Vérification des fichiers critiques...');
criticalFiles.forEach(file => {
  if (fs.existsSync(file.path)) {
    const stats = fs.statSync(file.path);
    if (stats.size === 0) {
      if (file.essential) {
        issues.push(`❌ ${file.path} est vide (fichier critique)`);
        healthScore -= 20;
      } else {
        warnings.push(`⚠️ ${file.path} est vide`);
        healthScore -= 5;
      }
    } else {
      console.log(`✅ ${file.path} (${(stats.size/1024).toFixed(1)}KB)`);
    }
  } else {
    if (file.essential) {
      issues.push(`❌ ${file.path} manquant (fichier critique)`);
      healthScore -= 25;
    } else {
      warnings.push(`⚠️ ${file.path} manquant`);
      healthScore -= 10;
    }
  }
});

// Vérification node_modules
console.log('\n📦 Vérification des dépendances...');
if (fs.existsSync('node_modules')) {
  console.log('✅ node_modules présent');
} else {
  issues.push('❌ node_modules manquant - Exécutez: npm install');
  healthScore -= 30;
}

// Vérification .next
console.log('\n🏗️ Vérification du build...');
if (fs.existsSync('.next')) {
  console.log('✅ Dossier .next présent (dernier build OK)');
} else {
  warnings.push('⚠️ Aucun build détecté - Exécutez: npm run build');
  healthScore -= 5;
}

// Vérification des variables d'environnement
console.log('\n🔐 Vérification de la configuration...');
const envFiles = ['.env', '.env.local', '.env.production'];
let envFound = false;
envFiles.forEach(envFile => {
  if (fs.existsSync(envFile)) {
    console.log(`✅ ${envFile} présent`);
    envFound = true;
  }
});

if (!envFound) {
  warnings.push('⚠️ Aucun fichier .env trouvé');
  healthScore -= 10;
}

// Résultat final
console.log('\n' + '='.repeat(50));
console.log('📊 RÉSULTAT DE LA VÉRIFICATION');
console.log('='.repeat(50));

// Score de santé
let healthStatus = '';
let healthIcon = '';
if (healthScore >= 90) {
  healthStatus = 'EXCELLENT';
  healthIcon = '🟢';
} else if (healthScore >= 70) {
  healthStatus = 'BON';
  healthIcon = '🟡';
} else if (healthScore >= 50) {
  healthStatus = 'MOYEN';
  healthIcon = '🟠';
} else {
  healthStatus = 'CRITIQUE';
  healthIcon = '🔴';
}

console.log(`${healthIcon} Score de santé: ${healthScore}/100 (${healthStatus})`);
console.log('');

// Affichage des problèmes
if (issues.length > 0) {
  console.log('🚨 PROBLÈMES CRITIQUES:');
  issues.forEach(issue => console.log(`   ${issue}`));
  console.log('');
}

if (warnings.length > 0) {
  console.log('⚠️ AVERTISSEMENTS:');
  warnings.forEach(warning => console.log(`   ${warning}`));
  console.log('');
}

// Recommandations
console.log('💡 RECOMMANDATIONS:');
if (healthScore < 100) {
  if (!fs.existsSync('node_modules')) {
    console.log('   1. Exécutez: npm install');
  }
  if (!fs.existsSync('.next')) {
    console.log('   2. Exécutez: npm run build');
  }
  console.log('   3. Consultez FICHIERS_CRITIQUES.md pour plus d\'informations');
} else {
  console.log('   ✅ Aucune action requise - Votre site est en parfait état !');
}

// Sortie avec code d'erreur si critique
if (healthScore < 50) {
  process.exit(1);
}