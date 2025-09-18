# 🚀 Guide de déploiement Hostinger - Intelligence Économique

## 📋 Prérequis sur Hostinger

### 1. **Vérifier votre plan Hostinger**
- Plan **Business** ou **Premium** requis pour Node.js
- **MySQL** disponible dans votre plan
- **SSH/FTP** activé

### 2. **Créer la base de données MySQL**

#### Sur votre panneau Hostinger (hpanel) :
1. Allez dans **"Bases de données" → "Gérer"**
2. Cliquez **"Créer une nouvelle base de données"**
3. Configurez :
   ```
   Nom de la base : intelligence_economique
   Utilisateur : u[votre_id]_admin
   Mot de passe : [généré automatiquement]
   ```
4. **NOTEZ** ces informations pour plus tard

### 3. **Informations de connexion typiques Hostinger**
```
Nom d'hôte : sql.hostinger.com (ou similaire)
Port : 3306
Base : u123456789_intelligence
Utilisateur : u123456789_admin
Mot de passe : [votre mot de passe]
```

## 🔧 Étapes de déploiement

### **Étape 1 : Configuration locale**

1. **Modifier `.env.production`** avec vos vraies informations :
```bash
# Base de données MySQL Hostinger
DATABASE_URL="mysql://u123456789_admin:MOT_DE_PASSE@sql.hostinger.com:3306/u123456789_intelligence"

# URL de votre site
NEXTAUTH_URL="https://votre-domaine.com"
NEXTAUTH_SECRET="votre-secret-production-tres-long"

# Configuration
NODE_ENV="production"
NEXT_PUBLIC_SITE_URL="https://votre-domaine.com"
```

2. **Reconfigurer le schema pour MySQL** :
```bash
npm run hostinger:setup
```

### **Étape 2 : Upload vers Hostinger**

#### **Option A : FTP (Automatique)**
```bash
npm run deploy:hostinger
```

#### **Option B : FTP Manuel**
1. Ouvrez votre client FTP (FileZilla, etc.)
2. Connectez-vous à votre Hostinger
3. Uploadez tout le contenu dans `/public_html/`

### **Étape 3 : Configuration sur le serveur**

1. **SSH dans votre serveur Hostinger**
2. **Installer les dépendances** :
```bash
cd public_html
npm install --production
```

3. **Configurer la base de données** :
```bash
npx prisma db push
```

4. **Démarrer le serveur** :
```bash
npm start
```

## 📁 Fichiers à uploader

✅ **OBLIGATOIRES** :
- `.next/` (dossier build)
- `public/` (assets statiques)
- `prisma/` (schéma base)
- `package.json` & `package-lock.json`
- `.env.production` (avec vos vraies infos)
- `node_modules/` (ou installer sur le serveur)

❌ **À EXCLURE** :
- `.env` (développement)
- `prisma/dev.db` (SQLite local)
- `.git/` (historique Git)
- `src/` (code source, déjà compilé)

## 🛠️ Commandes utiles

```bash
# Préparer le déploiement
npm run build

# Configurer MySQL
npm run hostinger:setup

# Upload automatique (si configuré)
npm run deploy:hostinger

# Test de la base après déploiement
npm run verify:integration
```

## 🆘 Dépannage

### **Erreur de connexion MySQL**
- Vérifiez vos identifiants dans `.env.production`
- Testez la connexion depuis votre panneau Hostinger
- Assurez-vous que votre IP est autorisée

### **Node.js non disponible**
- Contactez le support Hostinger
- Vérifiez que votre plan inclut Node.js
- Upgradez vers un plan Business si nécessaire

### **Site ne se charge pas**
- Vérifiez les logs d'erreur dans le panneau
- Assurez-vous que `npm start` fonctionne
- Vérifiez que le port 3000 est ouvert

## 📞 Support

- **Documentation Hostinger** : [hpanel → Node.js]
- **Support technique** : Via votre panneau Hostinger
- **Urgences** : Chat en direct Hostinger

---

🎉 **Une fois configuré, votre site sera accessible via votre domaine Hostinger !**