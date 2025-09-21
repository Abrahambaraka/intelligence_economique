# =================================================================
# SCRIPT DE DÉPLOIEMENT HOSTINGER VPS - Intelligence Économique
# =================================================================
# Version: 1.0 pour Windows PowerShell
# Compatible: Hostinger VPS avec Node.js 18+

param(
    [switch]$SSL,
    [switch]$Help
)

# Configuration VPS (à personnaliser)
$VPS_HOST = $env:HOSTINGER_VPS_HOST ?? "your-vps-ip"
$VPS_USER = $env:HOSTINGER_VPS_USER ?? "root"
$VPS_PORT = $env:HOSTINGER_VPS_PORT ?? "22"
$VPS_PATH = $env:HOSTINGER_VPS_PATH ?? "/var/www/intelligence-economique"
$DOMAIN = $env:HOSTINGER_DOMAIN ?? "your-domain.com"

# Configuration application
$APP_NAME = "intelligence-economique"
$PM2_APP_NAME = "ie-app"

function Write-Log {
    param([string]$Message)
    Write-Host "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] $Message" -ForegroundColor Green
}

function Write-Error-Custom {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
    exit 1
}

function Write-Warning-Custom {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

if ($Help) {
    Write-Host @"
SCRIPT DE DÉPLOIEMENT HOSTINGER VPS

Usage: .\deploy-hostinger-vps.ps1 [-SSL] [-Help]

Paramètres:
  -SSL    Configurer SSL avec Let's Encrypt
  -Help   Afficher cette aide

Variables d'environnement requises:
  HOSTINGER_VPS_HOST     : IP ou domaine du VPS
  HOSTINGER_VPS_USER     : Utilisateur SSH (généralement 'root')
  HOSTINGER_VPS_PORT     : Port SSH (généralement 22)
  HOSTINGER_VPS_PATH     : Chemin d'installation sur le VPS
  HOSTINGER_DOMAIN       : Nom de domaine

Exemple:
  $env:HOSTINGER_VPS_HOST = "123.456.789.0"
  $env:HOSTINGER_DOMAIN = "monsite.com"
  .\deploy-hostinger-vps.ps1
"@
    exit 0
}

Write-Host "🚀 Déploiement Intelligence Économique sur Hostinger VPS" -ForegroundColor Blue
Write-Host "=================================================" -ForegroundColor Blue

# Vérification des prérequis
Write-Log "Vérification des prérequis..."

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Error-Custom "Node.js n'est pas installé"
}

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Error-Custom "npm n'est pas installé"
}

if (-not (Get-Command ssh -ErrorAction SilentlyContinue)) {
    Write-Error-Custom "SSH n'est pas disponible. Installez OpenSSH ou Git Bash"
}

if ($VPS_HOST -eq "your-vps-ip") {
    Write-Error-Custom "Veuillez configurer HOSTINGER_VPS_HOST"
}

Write-Log "Prérequis validés ✓"

# Préparation du build
Write-Log "Préparation du build de production..."

# Nettoyer les anciens builds
if (Test-Path ".next") { Remove-Item ".next" -Recurse -Force }
if (Test-Path "build") { Remove-Item "build" -Recurse -Force }
if (Test-Path "out") { Remove-Item "out" -Recurse -Force }
if (Test-Path "node_modules\.cache") { Remove-Item "node_modules\.cache" -Recurse -Force }

# Installer les dépendances
npm ci --only=production
if ($LASTEXITCODE -ne 0) { Write-Error-Custom "Échec de l'installation des dépendances" }

# Générer Prisma
npx prisma generate
if ($LASTEXITCODE -ne 0) { Write-Error-Custom "Échec de la génération Prisma" }

# Build Next.js
npm run build
if ($LASTEXITCODE -ne 0) { Write-Error-Custom "Échec du build Next.js" }

Write-Log "Build préparé ✓"

# Création du package de déploiement
Write-Log "Création du package de déploiement..."

if (Test-Path "deploy-package") { Remove-Item "deploy-package" -Recurse -Force }
New-Item -ItemType Directory -Path "deploy-package" | Out-Null

# Copier les fichiers nécessaires
Copy-Item ".next" "deploy-package\" -Recurse
Copy-Item "public" "deploy-package\" -Recurse
Copy-Item "prisma" "deploy-package\" -Recurse
Copy-Item "package.json" "deploy-package\"
Copy-Item "package-lock.json" "deploy-package\"
Copy-Item "next.config.js" "deploy-package\"

# Copier le fichier d'environnement de production
if (Test-Path ".env.production") {
    Copy-Item ".env.production" "deploy-package\.env.local"
} else {
    Write-Warning-Custom "Fichier .env.production non trouvé, utilisation de .env.local"
    Copy-Item ".env.local" "deploy-package\.env.local"
}

# Créer l'archive (nécessite 7-Zip ou tar via WSL)
if (Get-Command tar -ErrorAction SilentlyContinue) {
    tar -czf "$APP_NAME-deployment.tar.gz" -C deploy-package .
} else {
    Write-Warning-Custom "tar non disponible, créons un ZIP"
    Compress-Archive -Path "deploy-package\*" -DestinationPath "$APP_NAME-deployment.zip" -Force
}

Write-Log "Package créé ✓"

# Déploiement sur VPS
Write-Log "Déploiement sur VPS Hostinger..."

# Créer le script de déploiement temporaire
$deployScript = @"
#!/bin/bash
set -e

# Créer le dossier de l'application
mkdir -p $VPS_PATH
cd $VPS_PATH

# Sauvegarder l'ancienne version
if [ -d "current" ]; then
    mv current backup-`$(date +%Y%m%d-%H%M%S)
fi

# Créer le nouveau dossier
mkdir -p current
"@

$deployScript | Out-File -FilePath "deploy-commands.sh" -Encoding UTF8

# Upload des fichiers
Write-Log "Upload des fichiers..."

# Upload du script
scp -P $VPS_PORT "deploy-commands.sh" "${VPS_USER}@${VPS_HOST}:$VPS_PATH/"

# Upload du package
if (Test-Path "$APP_NAME-deployment.tar.gz") {
    scp -P $VPS_PORT "$APP_NAME-deployment.tar.gz" "${VPS_USER}@${VPS_HOST}:$VPS_PATH/"
    $archiveFile = "$APP_NAME-deployment.tar.gz"
    $extractCommand = "tar -xzf"
} else {
    scp -P $VPS_PORT "$APP_NAME-deployment.zip" "${VPS_USER}@${VPS_HOST}:$VPS_PATH/"
    $archiveFile = "$APP_NAME-deployment.zip"
    $extractCommand = "unzip -q"
}

# Installation sur le serveur
$installScript = @"
cd $VPS_PATH
bash deploy-commands.sh

# Extraire le package
$extractCommand $archiveFile -d current/
cd current

# Installer Node.js si nécessaire
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Installer PM2 globalement
if ! command -v pm2 &> /dev/null; then
    sudo npm install -g pm2
fi

# Installer les dépendances de production
npm ci --only=production

# Configurer Prisma
npx prisma generate
npx prisma migrate deploy || echo "Migration warnings ignored"

# Configurer PM2
cat > ecosystem.config.js << 'EOL'
module.exports = {
  apps: [{
    name: '$PM2_APP_NAME',
    script: 'npm',
    args: 'start',
    cwd: '$VPS_PATH/current',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '$VPS_PATH/logs/err.log',
    out_file: '$VPS_PATH/logs/out.log',
    log_file: '$VPS_PATH/logs/combined.log',
    time: true
  }]
}
EOL

# Créer le dossier de logs
mkdir -p $VPS_PATH/logs

# Arrêter l'ancienne instance si elle existe
pm2 stop $PM2_APP_NAME || echo "Aucune instance à arrêter"
pm2 delete $PM2_APP_NAME || echo "Aucune instance à supprimer"

# Démarrer l'application
pm2 start ecosystem.config.js
pm2 save
pm2 startup | grep 'sudo' | bash || echo "PM2 startup déjà configuré"
"@

$installScript | Out-File -FilePath "install-commands.sh" -Encoding UTF8

# Exécuter l'installation
Get-Content "install-commands.sh" | ssh -p $VPS_PORT "${VPS_USER}@${VPS_HOST}" "bash -s"

Write-Log "Application déployée sur VPS ✓"

# Configuration Nginx
Write-Log "Configuration Nginx..."

$nginxConfig = @"
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade `$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host `$host;
        proxy_set_header X-Real-IP `$remote_addr;
        proxy_set_header X-Forwarded-For `$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto `$scheme;
        proxy_cache_bypass `$http_upgrade;
        proxy_read_timeout 86400;
    }
    
    location /_next/static {
        alias $VPS_PATH/current/.next/static;
        expires 365d;
        add_header Cache-Control "public, immutable";
    }
    
    location /public {
        alias $VPS_PATH/current/public;
        expires 30d;
        add_header Cache-Control "public";
    }
}
"@

$nginxScript = @"
# Installer Nginx si nécessaire
if ! command -v nginx &> /dev/null; then
    sudo apt-get update
    sudo apt-get install -y nginx
fi

# Créer la configuration Nginx
sudo tee /etc/nginx/sites-available/$APP_NAME > /dev/null << 'EOL'
$nginxConfig
EOL

# Activer le site
sudo ln -sf /etc/nginx/sites-available/$APP_NAME /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Tester et recharger Nginx
sudo nginx -t && sudo systemctl reload nginx
sudo systemctl enable nginx
"@

$nginxScript | Out-File -FilePath "nginx-setup.sh" -Encoding UTF8
ssh -p $VPS_PORT "${VPS_USER}@${VPS_HOST}" "bash -s" < nginx-setup.sh

Write-Log "Nginx configuré ✓"

# Configuration SSL si demandée
if ($SSL) {
    Write-Log "Configuration SSL avec Let's Encrypt..."
    
    $sslScript = @"
# Installer Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# Obtenir le certificat SSL
sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN

# Auto-renouvellement
(sudo crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | sudo crontab -
"@
    
    $sslScript | Out-File -FilePath "ssl-setup.sh" -Encoding UTF8
    ssh -p $VPS_PORT "${VPS_USER}@${VPS_HOST}" "bash -s" < ssl-setup.sh
    
    Write-Log "SSL configuré ✓"
}

# Nettoyage
Write-Log "Nettoyage..."
Remove-Item "deploy-package" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item "$APP_NAME-deployment.*" -Force -ErrorAction SilentlyContinue
Remove-Item "*-commands.sh" -Force -ErrorAction SilentlyContinue
Remove-Item "*-setup.sh" -Force -ErrorAction SilentlyContinue
Write-Log "Nettoyage terminé ✓"

# Test de santé
Write-Log "Test de santé de l'application..."
Start-Sleep -Seconds 15

try {
    $response = Invoke-WebRequest -Uri "http://$VPS_HOST" -TimeoutSec 10 -ErrorAction Stop
    Write-Log "Application accessible ✓"
} catch {
    Write-Warning-Custom "Application pas encore accessible (peut prendre quelques minutes)"
}

Write-Host "🎉 Déploiement terminé avec succès !" -ForegroundColor Green
Write-Host "🌐 Votre application est disponible sur: http://$DOMAIN" -ForegroundColor Green
Write-Host "📝 Pour voir les logs: ssh -p $VPS_PORT ${VPS_USER}@${VPS_HOST} 'pm2 logs $PM2_APP_NAME'" -ForegroundColor Yellow
Write-Host "🔄 Pour redémarrer: ssh -p $VPS_PORT ${VPS_USER}@${VPS_HOST} 'pm2 restart $PM2_APP_NAME'" -ForegroundColor Yellow