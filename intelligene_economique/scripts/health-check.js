const fs = require('fs');
const path = require('path');

// Script de vérification de santé du site
// Vérifie l'intégrité des fichiers critiques

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
  { path: 'src/lib/types.ts', essential: true },
  { path: 'prisma/prod.db', essential: false },
  { path: 'prisma/prisma/dev.db', essential: false }
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
        warnings.push(`⚠️  ${file.path} est vide`);
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
      warnings.push(`⚠️  ${file.path} manquant`);
      healthScore -= 10;
    }
  }
});

// Vérification node_modules
console.log('\n📦 Vérification des dépendances...');
if (fs.existsSync('node_modules')) {
  const nodeModulesSize = getDirSize('node_modules');
  console.log(`✅ node_modules présent (${(nodeModulesSize/1024/1024).toFixed(0)}MB)`);
} else {
  issues.push('❌ node_modules manquant - Exécutez: npm install');
  healthScore -= 30;
}

// Vérification .next (si en mode build)
console.log('\n🏗️  Vérification du build...');
if (fs.existsSync('.next')) {
  console.log('✅ Dossier .next présent (dernier build OK)');
} else {
  warnings.push('⚠️  Aucun build détecté - Exécutez: npm run build');
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
  warnings.push('⚠️  Aucun fichier .env trouvé');
  healthScore -= 10;
}

// Vérification de l'espace disque
console.log('\n💾 Vérification de l\'espace...');
try {
  const projectSize = getDirSize('.');
  console.log(`📊 Taille du projet: ${(projectSize/1024/1024).toFixed(1)}MB`);
  
  if (projectSize > 1024 * 1024 * 1024) { // > 1GB
    warnings.push('⚠️  Projet volumineux (>1GB) - Nettoyage recommandé');
    healthScore -= 5;
  }
} catch (e) {
  warnings.push('⚠️  Impossible de calculer la taille du projet');
}

// Vérification des sauvegardes
console.log('\n💾 Vérification des sauvegardes...');
if (fs.existsSync('backups')) {
  const backups = fs.readdirSync('backups').filter(f => f.endsWith('.tar.gz'));
  if (backups.length > 0) {
    console.log(`✅ ${backups.length} sauvegarde(s) disponible(s)`);
    const latestBackup = backups.sort().pop();
    const backupDate = fs.statSync(path.join('backups', latestBackup)).mtime;
    const daysSinceBackup = (Date.now() - backupDate.getTime()) / (1000 * 60 * 60 * 24);
    
    if (daysSinceBackup > 7) {
      warnings.push(`⚠️  Dernière sauvegarde ancienne (${Math.floor(daysSinceBackup)} jours)`);
      healthScore -= 10;
    }
  } else {
    warnings.push('⚠️  Aucune sauvegarde trouvée');
    healthScore -= 15;
  }
} else {
  warnings.push('⚠️  Dossier backups manquant');
  healthScore -= 15;
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
  console.log('⚠️  AVERTISSEMENTS:');
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
  if (!fs.existsSync('backups') || fs.readdirSync('backups').length === 0) {
    console.log('   3. Créez une sauvegarde: npm run backup');
  }
  console.log('   4. Consultez FICHIERS_CRITIQUES.md pour plus d\'informations');
} else {
  console.log('   ✅ Aucune action requise - Votre site est en parfait état !');
}

console.log('');
console.log('📞 Support: Consultez FICHIERS_CRITIQUES.md pour l\'aide d\'urgence');

// Sortie avec code d'erreur si critique
if (healthScore < 50) {
  process.exit(1);
}

// Fonction utilitaire pour calculer la taille d'un dossier
function getDirSize(dirPath) {
  let size = 0;
  try {
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stats = fs.statSync(filePath);
      if (stats.isDirectory()) {
        if (file !== 'node_modules' && file !== '.git' && file !== '.next') {
          size += getDirSize(filePath);
        }
      } else {
        size += stats.size;
      }
    }
  } catch (e) {
    // Ignorer les erreurs de permission
  }
  return size;
}