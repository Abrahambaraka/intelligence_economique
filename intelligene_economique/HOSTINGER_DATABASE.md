# 🗄️ Guide Configuration Base de Données MySQL Hostinger

## 📋 Étapes à suivre sur Hostinger

### 1. **Accéder à votre panneau Hostinger**
- Connectez-vous à [hpanel.hostinger.com](https://hpanel.hostinger.com)
- Allez dans **"Bases de données" → "Gérer"**

### 2. **Créer une nouvelle base de données MySQL**
```
Nom de la base : intelligence_economique
Utilisateur : u123456789_admin
Mot de passe : [généré automatiquement ou choisi]
```

### 3. **Récupérer les informations de connexion**
Hostinger vous donnera :
- **Nom de la base** : `u123456789_intelligence`
- **Nom d'utilisateur** : `u123456789_admin`
- **Mot de passe** : `votre_mot_de_passe`
- **Nom d'hôte** : `sql.hostinger.com` (ou similaire)
- **Port** : `3306`

### 4. **Configurer l'URL de connexion**

Dans votre fichier `.env.production`, remplacez :
```bash
DATABASE_URL="mysql://u123456789_admin:votre_mot_de_passe@sql.hostinger.com:3306/u123456789_intelligence"
```

### 5. **Format général**
```bash
DATABASE_URL="mysql://[utilisateur]:[mot_de_passe]@[hôte]:[port]/[nom_base]"
```

## 🚀 Installation automatique du schéma

Une fois vos identifiants configurés, le déploiement créera automatiquement :

✅ **Tables créées :**
- `Article` - Articles du magazine
- `Rubrique` - Catégories d'articles  
- `Tag` - Étiquettes
- `ArticleTag` - Relations articles-tags
- `Magazine` - Numéros du magazine
- `Video` - Vidéos
- `NewsletterSubscription` - Abonnés newsletter
- `User` - Comptes admin

✅ **Fonctionnalités incluses :**
- Gestion complète des articles
- Système de rubriques
- Newsletter opérationnelle
- Interface d'administration
- Upload d'images
- Recherche avancée

## 📝 Notes importantes

- **Sécurité** : Ne jamais commiter le vrai `.env.production` avec vos identifiants
- **Backup** : Hostinger fait des sauvegardes automatiques
- **Performance** : MySQL est plus performant que SQLite pour la production
- **Capacité** : Vérifiez les limites de votre plan Hostinger

## 🔧 Commandes utiles

```bash
# Pousser le schéma vers MySQL (après config)
npx prisma db push

# Voir le statut de la base
npx prisma db pull

# Réinitialiser si nécessaire
npx prisma migrate reset
```