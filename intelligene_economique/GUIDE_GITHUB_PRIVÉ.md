# 🔒 GUIDE POUR RENDRE LE REPOSITORY GITHUB PRIVÉ
# Intelligence Économique - Sécurisation du code

## 🎯 ÉTAPES POUR RENDRE LE REPO PRIVÉ

### 1. Accéder à votre repository GitHub

1. Connectez-vous à : https://github.com
2. Allez sur votre repository : https://github.com/Abrahambaraka/intelligence_economique

### 2. Accéder aux paramètres

1. Dans votre repository, cliquez sur l'onglet **"Settings"** (en haut à droite)
2. Faites défiler jusqu'en bas de la page

### 3. Changer la visibilité

Dans la section **"Danger Zone"** (zone rouge en bas) :

1. Cliquez sur **"Change repository visibility"**
2. Sélectionnez **"Make private"**
3. Tapez le nom du repository : `intelligence_economique`
4. Cliquez sur **"I understand, change repository visibility"**

### 4. Confirmation

✅ Votre repository sera maintenant privé
✅ Seuls vous et les collaborateurs autorisés pourront y accéder

## 🛡️ SÉCURITÉ SUPPLÉMENTAIRE

### Fichiers sensibles à vérifier

Assurez-vous que ces fichiers sensibles ne sont PAS dans le repo :

```
❌ .env.production (contient mots de passe)
❌ .env.local
❌ dev.db
❌ prod.db
❌ Clés SSH privées
❌ Mots de passe en dur
```

### Créer/Mettre à jour .gitignore

```gitignore
# Variables d'environnement
.env
.env.local
.env.production
.env.development

# Bases de données
*.db
*.sqlite
*.sqlite3

# Logs
*.log
logs/

# Dossiers de build et cache
.next/
node_modules/
build/
dist/

# Fichiers temporaires
*.tmp
*.temp
temp/

# Clés et certificats
*.pem
*.key
*.crt
*.p12

# Backups
backup/
backups/
*.backup

# Uploads utilisateurs
uploads/
public/uploads/

# Fichiers système
.DS_Store
Thumbs.db
```

## 🚨 SI VOUS AVEZ DÉJÀ POUSSÉ DES FICHIERS SENSIBLES

### 1. Supprimer de l'historique Git (ATTENTION: Destructif)

```bash
# Supprimer un fichier de tout l'historique
git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch .env.production' --prune-empty --tag-name-filter cat -- --all

# Force push (ATTENTION: modifie l'historique)
git push --force --all
```

### 2. Alternative plus sûre : Nouveau repository

1. Créer un nouveau repository privé
2. Copier seulement les fichiers non-sensibles
3. Pousser vers le nouveau repo
4. Supprimer l'ancien repo

## ✅ CHECKLIST SÉCURITÉ

- [ ] Repository mis en privé
- [ ] .gitignore mis à jour
- [ ] Fichiers sensibles supprimés du repo
- [ ] Variables d'environnement sécurisées
- [ ] Accès collaborateurs configuré si nécessaire

## 🔐 BONNES PRATIQUES

### Gestion des secrets

1. **Ne jamais commiter** :
   - Mots de passe
   - Clés API
   - Tokens d'accès
   - Informations de base de données

2. **Utiliser** :
   - Variables d'environnement
   - Services de gestion de secrets
   - Fichiers .env locaux (non versionnés)

### Collaboration sécurisée

1. **Inviter des collaborateurs** :
   - Settings → Manage access
   - Add people → Choisir permissions

2. **Niveaux d'accès** :
   - Read : Lecture seule
   - Write : Lecture + écriture
   - Admin : Contrôle total

## 📞 AIDE SUPPLÉMENTAIRE

- **Documentation GitHub** : https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/managing-repository-settings/setting-repository-visibility
- **Support GitHub** : https://support.github.com

---

## ⚠️ IMPORTANT

**Après avoir rendu le repo privé, vos variables sensibles seront protégées mais assurez-vous de bien configurer le .gitignore pour éviter les fuites futures !**