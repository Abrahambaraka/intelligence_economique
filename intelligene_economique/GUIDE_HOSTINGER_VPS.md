# 🚀 GUIDE DE DÉPLOIEMENT HOSTINGER VPS
# Intelligence Économique - Déploiement Production

## 📋 Prérequis VPS

### 1. Informations de connexion VPS
```
IP du serveur : [Votre IP VPS]
Utilisateur : root (ou votre utilisateur)
Port SSH : 22 (par défaut)
```

### 2. Accès SSH configuré
```bash
# Test de connexion SSH
ssh root@votre-ip-vps
```

## ⚡ Déploiement Automatique

### Option 1: Script Bash (Linux/Mac/WSL)
```bash
# Rendre le script exécutable
chmod +x scripts/deploy-hostinger-vps.sh

# Lancer le déploiement
./scripts/deploy-hostinger-vps.sh votre-ip-vps root votre-domaine.com
```

### Option 2: Script PowerShell (Windows)
```powershell
# Lancer PowerShell en tant qu'administrateur
# Naviguer vers le dossier du projet
cd "C:\Users\BLESSING DESIGN\Downloads\intelligene_economique\intelligene_economique"

# Exécuter le script
.\scripts\deploy-hostinger-vps.ps1 -ServerIP "votre-ip-vps" -Username "root" -Domain "votre-domaine.com"
```

## 🔧 Configuration Manuelle

### 1. Préparer les variables d'environnement
```bash
# Éditer .env.production
nano .env.production

# Remplacer :
# - votre-domaine.com par votre vrai domaine
# - Les identifiants de base de données
# - Le secret NextAuth
```

### 2. Génerer un secret sécurisé
```bash
# Générer un secret NextAuth
openssl rand -base64 32
```

### 3. Configuration base de données MySQL

#### Sur votre panel Hostinger :
1. Créer une base de données MySQL
2. Noter les informations de connexion
3. Mettre à jour `DATABASE_URL` dans `.env.production`

#### Format connexion :
```
DATABASE_URL="mysql://u123456789_nom:password@sql123.hostinger.com:3306/u123456789_dbname"
```

## 🌐 Configuration DNS

### 1. Pointer votre domaine vers le VPS
```
Type A : @ -> IP_de_votre_VPS
Type A : www -> IP_de_votre_VPS
```

### 2. Attendre la propagation DNS (1-24h)

## 🔍 Vérification du déploiement

### 1. Tester l'application
```bash
# Vérifier que l'app fonctionne
curl http://votre-domaine.com
curl https://votre-domaine.com
```

### 2. Vérifier les services
```bash
# Sur le VPS
ssh root@votre-ip-vps

# Statut PM2
pm2 status

# Statut Nginx
systemctl status nginx

# Logs de l'application
pm2 logs intelligence-economique
```

## 🔒 Configuration SSL (Automatique)

Le script configure automatiquement :
- Certificat Let's Encrypt
- Redirection HTTPS
- Renouvellement automatique

## 🛠️ Commandes utiles

### Sur le VPS :
```bash
# Redémarrer l'application
pm2 restart intelligence-economique

# Voir les logs
pm2 logs intelligence-economique

# Redémarrer Nginx
systemctl restart nginx

# Vérifier la base de données
cd /var/www/intelligence-economique
npm run db:status
```

### Mise à jour de l'application :
```bash
# Re-exécuter le script de déploiement
./scripts/deploy-hostinger-vps.sh votre-ip-vps root votre-domaine.com
```

## 🆘 Dépannage

### Problème de connexion SSH
```bash
# Vérifier la connexion
ssh -v root@votre-ip-vps
```

### Problème de base de données
```bash
# Tester la connexion DB
cd /var/www/intelligence-economique
npx prisma db push
```

### Problème de certificat SSL
```bash
# Sur le VPS
certbot renew --dry-run
```

### L'application ne démarre pas
```bash
# Vérifier les logs
pm2 logs intelligence-economique

# Redémarrer en mode développement pour debug
cd /var/www/intelligence-economique
npm run dev
```

## 📞 Support

- Documentation Hostinger VPS
- Logs d'erreur dans `/var/log/`
- Logs PM2 : `pm2 logs`
- Logs Nginx : `/var/log/nginx/error.log`

---

**✅ Votre application sera accessible à : https://votre-domaine.com**