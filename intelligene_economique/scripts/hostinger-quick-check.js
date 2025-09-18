// Script de vérification rapide pour Hostinger
const { execSync } = require('child_process');
const fs = require('fs');

function check() {
  let ok = true;
  // 1. Vérifier le build
  if (!fs.existsSync('.next')) {
    console.log('❌ Build .next/ manquant. Exécutez : npm run build');
    ok = false;
  } else {
    console.log('✅ Build .next/ présent');
  }
  // 2. Vérifier le schéma Prisma
  const schema = fs.readFileSync('prisma/schema.prisma', 'utf8');
  if (!schema.includes('provider = "mysql"')) {
    console.log('⚠️ Prisma non configuré pour MySQL. Modifiez le provider dans schema.prisma.');
    ok = false;
  } else {
    console.log('✅ Prisma configuré pour MySQL');
  }
  // 3. Vérifier .env.production
  if (!fs.existsSync('.env.production')) {
    console.log('❌ .env.production manquant.');
    ok = false;
  } else {
    const env = fs.readFileSync('.env.production', 'utf8');
    if (!env.includes('mysql://')) {
      console.log('⚠️ DATABASE_URL dans .env.production n’est pas configuré pour MySQL.');
      ok = false;
    } else {
      console.log('✅ .env.production configuré pour MySQL');
    }
  }
  // 4. Vérifier mysql2
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  if (!pkg.dependencies["mysql2"]) {
    console.log('❌ mysql2 non installé. Exécutez : npm install mysql2');
    ok = false;
  } else {
    console.log('✅ mysql2 installé');
  }
  // 5. Vérifier les dossiers critiques
  ['public', 'prisma'].forEach(dir => {
    if (!fs.existsSync(dir)) {
      console.log(`❌ Dossier ${dir}/ manquant.`);
      ok = false;
    } else {
      console.log(`✅ Dossier ${dir}/ présent`);
    }
  });
  // 6. Résumé
  if (ok) {
    console.log('\n🎉 Le projet est prêt pour l’hébergement Hostinger !');
  } else {
    console.log('\n⚠️ Corrigez les points ci-dessus avant de déployer.');
  }
}
check();