#!/bin/bash

# =================================================================
# SCRIPT DE DÉPLOIEMENT HOSTINGER VPS - Intelligence Économique
# =================================================================
# Version: 1.0
# Compatible: Hostinger VPS avec Node.js 18+

set -e  # Arrêter en cas d'erreur

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration VPS
VPS_HOST="${HOSTINGER_VPS_HOST:-your-vps-ip}"
VPS_USER="${HOSTINGER_VPS_USER:-root}"
VPS_PORT="${HOSTINGER_VPS_PORT:-22}"
VPS_PATH="${HOSTINGER_VPS_PATH:-/var/www/intelligence-economique}"
DOMAIN="${HOSTINGER_DOMAIN:-your-domain.com}"

# Configuration application
APP_NAME="intelligence-economique"
NODE_VERSION="18"
PM2_APP_NAME="ie-app"

echo -e "${BLUE}🚀 Déploiement Intelligence Économique sur Hostinger VPS${NC}"
echo -e "${BLUE}=================================================${NC}"

# Fonction de logging
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
    exit 1
}

warning() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

# Vérification des prérequis
check_prerequisites() {
    log "Vérification des prérequis..."
    
    # Vérifier Node.js
    if ! command -v node &> /dev/null; then
        error "Node.js n'est pas installé"
    fi
    
    # Vérifier npm
    if ! command -v npm &> /dev/null; then
        error "npm n'est pas installé"
    fi
    
    # Vérifier SSH
    if ! command -v ssh &> /dev/null; then
        error "SSH n'est pas disponible"
    fi
    
    # Vérifier variables d'environnement
    if [ -z "$VPS_HOST" ] || [ "$VPS_HOST" = "your-vps-ip" ]; then
        error "HOSTINGER_VPS_HOST doit être défini"
    fi
    
    log "Prérequis validés ✓"
}

# Préparation du build
prepare_build() {
    log "Préparation du build de production..."
    
    # Nettoyer les anciens builds
    rm -rf .next build out node_modules/.cache
    
    # Installer les dépendances
    npm ci --only=production
    
    # Générer Prisma
    npx prisma generate
    
    # Build Next.js
    npm run build
    
    log "Build préparé ✓"
}

# Création du package de déploiement
create_deployment_package() {
    log "Création du package de déploiement..."
    
    # Créer le dossier de déploiement
    mkdir -p deploy-package
    
    # Copier les fichiers nécessaires
    cp -r .next deploy-package/
    cp -r public deploy-package/
    cp -r prisma deploy-package/
    cp package.json deploy-package/
    cp package-lock.json deploy-package/
    cp next.config.js deploy-package/
    cp .env.production deploy-package/.env.local
    
    # Créer l'archive
    tar -czf ${APP_NAME}-deployment.tar.gz -C deploy-package .
    
    log "Package créé: ${APP_NAME}-deployment.tar.gz ✓"
}

# Déploiement sur VPS
deploy_to_vps() {
    log "Déploiement sur VPS Hostinger..."
    
    # Connexion et préparation du serveur
    ssh -p $VPS_PORT $VPS_USER@$VPS_HOST << EOF
        # Créer le dossier de l'application
        mkdir -p $VPS_PATH
        cd $VPS_PATH
        
        # Sauvegarder l'ancienne version
        if [ -d "current" ]; then
            mv current backup-\$(date +%Y%m%d-%H%M%S)
        fi
        
        # Créer le nouveau dossier
        mkdir -p current
EOF
    
    # Upload du package
    log "Upload du package..."
    scp -P $VPS_PORT ${APP_NAME}-deployment.tar.gz $VPS_USER@$VPS_HOST:$VPS_PATH/
    
    # Installation sur le serveur
    ssh -p $VPS_PORT $VPS_USER@$VPS_HOST << EOF
        cd $VPS_PATH
        
        # Extraire le package
        tar -xzf ${APP_NAME}-deployment.tar.gz -C current/
        cd current
        
        # Installer Node.js si nécessaire
        if ! command -v node &> /dev/null; then
            curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | sudo -E bash -
            sudo apt-get install -y nodejs
        fi
        
        # Installer PM2 globalement
        if ! command -v pm2 &> /dev/null; then
            npm install -g pm2
        fi
        
        # Installer les dépendances de production
        npm ci --only=production
        
        # Configurer Prisma
        npx prisma generate
        npx prisma migrate deploy
        
        # Configurer PM2
        cat > ecosystem.config.js << 'EOL'
module.exports = {
  apps: [{
    name: '${PM2_APP_NAME}',
    script: 'npm',
    args: 'start',
    cwd: '$VPS_PATH/current',
    instances: 'max',
    exec_mode: 'cluster',
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
        
        # Démarrer l'application
        pm2 start ecosystem.config.js
        pm2 save
        pm2 startup
        
EOF
    
    log "Application déployée sur VPS ✓"
}

# Configuration Nginx
configure_nginx() {
    log "Configuration Nginx..."
    
    ssh -p $VPS_PORT $VPS_USER@$VPS_HOST << EOF
        # Installer Nginx si nécessaire
        if ! command -v nginx &> /dev/null; then
            sudo apt-get update
            sudo apt-get install -y nginx
        fi
        
        # Créer la configuration Nginx
        sudo tee /etc/nginx/sites-available/${APP_NAME} > /dev/null << 'EOL'
server {
    listen 80;
    server_name ${DOMAIN} www.${DOMAIN};
    
    # Redirection HTTPS (optionnel)
    # return 301 https://\$server_name\$request_uri;
    
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
        proxy_read_timeout 86400;
    }
    
    # Fichiers statiques
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
EOL
        
        # Activer le site
        sudo ln -sf /etc/nginx/sites-available/${APP_NAME} /etc/nginx/sites-enabled/
        sudo rm -f /etc/nginx/sites-enabled/default
        
        # Tester et recharger Nginx
        sudo nginx -t && sudo systemctl reload nginx
        sudo systemctl enable nginx
        
EOF
    
    log "Nginx configuré ✓"
}

# Configuration SSL avec Certbot (optionnel)
setup_ssl() {
    if [ "$1" = "--ssl" ]; then
        log "Configuration SSL avec Let's Encrypt..."
        
        ssh -p $VPS_PORT $VPS_USER@$VPS_HOST << EOF
            # Installer Certbot
            sudo apt-get install -y certbot python3-certbot-nginx
            
            # Obtenir le certificat SSL
            sudo certbot --nginx -d ${DOMAIN} -d www.${DOMAIN} --non-interactive --agree-tos --email admin@${DOMAIN}
            
            # Auto-renouvellement
            sudo crontab -l | { cat; echo "0 12 * * * /usr/bin/certbot renew --quiet"; } | sudo crontab -
EOF
        
        log "SSL configuré ✓"
    fi
}

# Nettoyage
cleanup() {
    log "Nettoyage..."
    rm -rf deploy-package ${APP_NAME}-deployment.tar.gz
    log "Nettoyage terminé ✓"
}

# Test de santé
health_check() {
    log "Test de santé de l'application..."
    
    sleep 10  # Attendre le démarrage
    
    if curl -f http://$VPS_HOST >/dev/null 2>&1; then
        log "Application accessible ✓"
    else
        warning "Application pas encore accessible (peut prendre quelques minutes)"
    fi
}

# Fonction principale
main() {
    echo -e "${BLUE}Démarrage du déploiement...${NC}"
    
    check_prerequisites
    prepare_build
    create_deployment_package
    deploy_to_vps
    configure_nginx
    setup_ssl $1
    health_check
    cleanup
    
    echo -e "${GREEN}🎉 Déploiement terminé avec succès !${NC}"
    echo -e "${GREEN}🌐 Votre application est disponible sur: http://${DOMAIN}${NC}"
    echo -e "${YELLOW}📝 Pour voir les logs: ssh -p $VPS_PORT $VPS_USER@$VPS_HOST 'pm2 logs ${PM2_APP_NAME}'${NC}"
    echo -e "${YELLOW}🔄 Pour redémarrer: ssh -p $VPS_PORT $VPS_USER@$VPS_HOST 'pm2 restart ${PM2_APP_NAME}'${NC}"
}

# Exécution
case "$1" in
    --ssl)
        main --ssl
        ;;
    --help)
        echo "Usage: $0 [--ssl] [--help]"
        echo "  --ssl   Configurer SSL avec Let's Encrypt"
        echo "  --help  Afficher cette aide"
        ;;
    *)
        main
        ;;
esac