# 🎉 DÉPLOIEMENT RÉUSSI !
# Intelligence Économique sur Hostinger VPS

## ✅ STATUT ACTUEL

**🌐 Votre application est LIVE et accessible !**

- **URL actuelle :** http://195.35.3.36 ✅ **FONCTIONNE**
- **PM2 Status :** ✅ En cours d'exécution
- **Nginx :** ✅ Configuré et fonctionnel
- **Base de données :** ✅ SQLite configurée

## 🔧 POUR ACTIVER VOTRE DOMAINE

### 1. Configuration DNS (À faire)
Dans votre panel Hostinger ou gestionnaire de domaine :

```
Type A : intelligenceconomique.com → 195.35.3.36
Type A : www.intelligenceconomique.com → 195.35.3.36
```

**Propagation DNS :** 1-24 heures

### 2. SSL automatique après DNS
Une fois le DNS propagé, exécutez :

```bash
ssh root@195.35.3.36 "certbot --nginx -d intelligenceconomique.com -d www.intelligenceconomique.com --non-interactive --agree-tos --email admin@intelligenceconomique.com"
```

## 📋 COMMANDES UTILES

### Gestion de l'application
```bash
# Statut
ssh root@195.35.3.36 "pm2 status"

# Logs en temps réel
ssh root@195.35.3.36 "pm2 logs intelligence-economique"

# Redémarrer
ssh root@195.35.3.36 "pm2 restart intelligence-economique"

# Arrêter
ssh root@195.35.3.36 "pm2 stop intelligence-economique"
```

### Gestion Nginx
```bash
# Statut
ssh root@195.35.3.36 "systemctl status nginx"

# Redémarrer
ssh root@195.35.3.36 "systemctl restart nginx"

# Test configuration
ssh root@195.35.3.36 "nginx -t"
```

### Gestion base de données
```bash
# Accéder à l'application
ssh root@195.35.3.36 "cd /var/www/intelligence-economique"

# Voir le schéma
ssh root@195.35.3.36 "cd /var/www/intelligence-economique && npx dotenv -e .env.production -- npx prisma studio"
```

## 🔄 MISE À JOUR DE L'APPLICATION

### Méthode rapide (recommandée)
1. Faire les modifications localement
2. Build : `npm run build`
3. Re-exécuter le script de déploiement :
```powershell
.\scripts\deploy-hostinger-simple.ps1 -ServerIP "195.35.3.36" -Username "root" -Domain "intelligenceconomique.com"
```

### Méthode manuelle
```bash
# Sur votre machine locale
npm run build
tar -czf app-update.tar.gz .next package.json prisma src public .env.production

# Upload
scp app-update.tar.gz root@195.35.3.36:/tmp/

# Sur le serveur
ssh root@195.35.3.36 "
cd /var/www/intelligence-economique &&
tar -xzf /tmp/app-update.tar.gz &&
npm ci --production &&
pm2 restart intelligence-economique
"
```

## 🛡️ SÉCURITÉ

### Base de données
- ✅ SQLite local sécurisé
- ✅ Variables d'environnement protégées
- ✅ Pas d'exposition directe

### Serveur
- ✅ Nginx reverse proxy
- ✅ PM2 gestion des processus
- ⏳ SSL/HTTPS (après DNS)

### Sauvegardes
```bash
# Backup base de données
ssh root@195.35.3.36 "cd /var/www/intelligence-economique && cp prisma/production.db prisma/backup-$(date +%Y%m%d).db"

# Backup complet application
ssh root@195.35.3.36 "cd /var/www && tar -czf intelligence-economique-backup-$(date +%Y%m%d).tar.gz intelligence-economique"
```

## 🚨 DÉPANNAGE

### Application ne répond pas
```bash
ssh root@195.35.3.36 "pm2 restart intelligence-economique"
```

### Erreur 502 Bad Gateway
```bash
ssh root@195.35.3.36 "pm2 status && systemctl status nginx"
```

### Problème base de données
```bash
ssh root@195.35.3.36 "cd /var/www/intelligence-economique && npx dotenv -e .env.production -- npx prisma db push"
```

## 📞 SUPPORT

- **Logs PM2 :** `ssh root@195.35.3.36 "pm2 logs intelligence-economique"`
- **Logs Nginx :** `ssh root@195.35.3.36 "tail -f /var/log/nginx/error.log"`
- **Logs système :** `ssh root@195.35.3.36 "journalctl -f"`

---

## 🎯 PROCHAINES ÉTAPES

1. **Configurer DNS** ☐
2. **Activer SSL** ☐  
3. **Configurer MySQL** ☐ (optionnel)
4. **Monitoring** ☐ (optionnel)

**🎊 Votre application Intelligence Économique est maintenant déployée avec succès sur votre VPS Hostinger !**