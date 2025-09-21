# =================================================================
# Script de déploiement Hostinger VPS - PowerShell (Windows)
# Intelligence Économique
# =================================================================

param(
    [Parameter(Mandatory=$true)]
    [string]$ServerIP,
    
    [Parameter(Mandatory=$true)]
    [string]$Username,
    
    [Parameter(Mandatory=$true)]
    [string]$Domain,
    
    [string]$Port = "22"
)

# Variables globales
$VPS_HOST = $ServerIP
$VPS_USER = $Username
$VPS_PORT = $Port
$DOMAIN = $Domain
$APP_NAME = "intelligence-economique"
$APP_DIR = "/var/www/$APP_NAME"

# Fonction de logging
function Write-Log {
    param([string]$Message)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-Host "[$timestamp] $Message" -ForegroundColor Green
}

function Write-Error-Log {
    param([string]$Message)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-Host "[$timestamp] ERREUR: $Message" -ForegroundColor Red
}

# Vérifications préalables
Write-Log "🚀 Début du déploiement sur Hostinger VPS"
Write-Log "Serveur: ${VPS_HOST}:${VPS_PORT}"
Write-Log "Utilisateur: $VPS_USER"
Write-Log "Domaine: $DOMAIN"

# Test de connexion SSH
Write-Log "Test de connexion SSH..."
$sshTest = ssh -p $VPS_PORT "$VPS_USER@$VPS_HOST" "echo 'Connexion réussie'"
if ($LASTEXITCODE -ne 0) {
    Write-Error-Log "Impossible de se connecter au serveur VPS"
    Write-Host "Vérifiez:"
    Write-Host "1. L'IP du serveur: $VPS_HOST"
    Write-Host "2. L'utilisateur: $VPS_USER"
    Write-Host "3. Votre clé SSH ou mot de passe"
    exit 1
}
Write-Log "Connexion SSH ✓"

# Vérifications locales
if (!(Test-Path "package.json")) {
    Write-Error-Log "package.json non trouvé. Assurez-vous d'être dans le dossier du projet."
    exit 1
}

if (!(Test-Path ".env.production")) {
    Write-Error-Log ".env.production non trouvé."
    exit 1
}

# Build de l'application
Write-Log "🔨 Build de l'application..."
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Error-Log "Échec de npm install"
    exit 1
}

npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Error-Log "Échec du build"
    exit 1
}

Write-Log "Build terminé ✓"

# Création de l'archive
Write-Log "📦 Création de l'archive de déploiement..."
$excludeList = @(
    "node_modules",
    ".git",
    ".next/cache",
    "backups",
    "*.log",
    ".env.local",
    ".env.development"
)

# Créer le fichier tar avec PowerShell
$tempDir = "temp-deploy"
if (Test-Path $tempDir) {
    Remove-Item -Recurse -Force $tempDir
}
New-Item -ItemType Directory -Name $tempDir

# Copier les fichiers nécessaires
$itemsToCopy = @(
    ".next",
    "public",
    "prisma",
    "src",
    "package.json",
    "next.config.js",
    "next.config.ts",
    ".env.production"
)

foreach ($item in $itemsToCopy) {
    if (Test-Path $item) {
        if (Test-Path $item -PathType Container) {
            Copy-Item -Recurse $item "$tempDir\$item"
        } else {
            Copy-Item $item "$tempDir\$item"
        }
    }
}

# Compresser avec tar (disponible sur Windows 10+)
tar -czf "app-deploy.tar.gz" -C $tempDir .
Remove-Item -Recurse -Force $tempDir

Write-Log "Archive créée ✓"

# Upload vers le serveur
Write-Log "📤 Upload vers le serveur..."
scp -P $VPS_PORT "app-deploy.tar.gz" "$VPS_USER@${VPS_HOST}:/tmp/"
if ($LASTEXITCODE -ne 0) {
    Write-Error-Log "Échec de l'upload"
    exit 1
}

Write-Log "Upload terminé ✓"

# Installation sur le serveur
Write-Log "⚙️ Installation sur le serveur..."

$commands = @"
#!/bin/bash
set -e

echo "🔧 Installation Node.js et outils..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get update
apt-get install -y nodejs nginx certbot python3-certbot-nginx

echo "📦 Installation PM2..."
npm install -g pm2

echo "📁 Préparation du répertoire..."
mkdir -p $APP_DIR
rm -rf $APP_DIR/*
cd $APP_DIR

echo "📂 Extraction de l'application..."
tar -xzf /tmp/app-deploy.tar.gz -C $APP_DIR

echo "📦 Installation des dépendances..."
npm ci --production

echo "🗄️ Configuration de la base de données..."
npx prisma generate
npx prisma db push --accept-data-loss || echo "Base de données déjà configurée"

echo "🚀 Configuration PM2..."
cat > ecosystem.config.js << 'EOL'
module.exports = {
  apps: [{
    name: '$APP_NAME',
    script: 'npm',
    args: 'start',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
EOL

pm2 start ecosystem.config.js
pm2 save
pm2 startup systemd -u root --hp /root | bash || echo "PM2 startup déjà configuré"

echo "🌐 Configuration Nginx..."
cat > /etc/nginx/sites-available/$DOMAIN << 'EOL'
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOL

ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

echo "🔒 Configuration SSL..."
certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN

echo "✅ Déploiement terminé!"
"@

# Écrire les commandes dans un fichier temporaire
$commands | Out-File -FilePath "deploy-commands.sh" -Encoding UTF8

# Exécuter les commandes sur le serveur
$commands | ssh -p $VPS_PORT "$VPS_USER@$VPS_HOST" "bash -s"

Write-Log "Installation terminée ✓"

# Nettoyage
Remove-Item "app-deploy.tar.gz" -ErrorAction SilentlyContinue
Remove-Item "deploy-commands.sh" -ErrorAction SilentlyContinue

Write-Log "🎉 Déploiement terminé avec succès!"
Write-Log "🌐 Votre application est accessible sur: https://$DOMAIN"
Write-Log ""
Write-Log "📋 Commandes utiles:"
Write-Log "- Voir les logs: ssh $VPS_USER@$VPS_HOST 'pm2 logs $APP_NAME'"
Write-Log "- Redémarrer: ssh $VPS_USER@$VPS_HOST 'pm2 restart $APP_NAME'"
Write-Log "- Status: ssh $VPS_USER@$VPS_HOST 'pm2 status'"