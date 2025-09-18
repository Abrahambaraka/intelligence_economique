# Script de déploiement pour Hostinger
# Variables de configuration
HOSTINGER_HOST="votre-domaine.com"
HOSTINGER_USER="votre-username"
HOSTINGER_PATH="public_html"

echo "🚀 Déploiement sur Hostinger..."

# 1. Build du projet
echo "📦 Construction du projet..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Erreur lors du build"
    exit 1
fi

# 2. Préparation des fichiers
echo "📁 Préparation des fichiers..."
mkdir -p deploy
cp -r .next/static deploy/
cp -r public/* deploy/
cp .htaccess deploy/

# 3. Upload via FTP (vous devrez installer lftp)
echo "📤 Upload des fichiers..."
lftp -u $HOSTINGER_USER,$HOSTINGER_PASS $HOSTINGER_HOST << EOF
cd $HOSTINGER_PATH
mput -r deploy/*
quit
EOF

echo "✅ Déploiement terminé !"
echo "🌐 Votre site est disponible sur https://$HOSTINGER_HOST"
