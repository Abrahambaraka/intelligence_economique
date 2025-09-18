# 🚨 Fichiers critiques - Guide de protection

## ⚠️ FICHIERS À NE JAMAIS SUPPRIMER OU CORROMPRE

### 🔴 **NIVEAU CRITIQUE - Site cassé si supprimés**

#### 1. **Base de données**
```
prisma/prisma/dev.db          # Base de données de développement
prisma/prod.db               # Base de données de production
prisma/schema.prisma         # Structure de la base de données
```
**Risque :** Perte de tous les articles, utilisateurs, contenus
**Protection :** Sauvegarde automatique quotidienne

#### 2. **Configuration Next.js**
```
next.config.js               # Configuration du framework
package.json                 # Dépendances et scripts
tsconfig.json               # Configuration TypeScript
```
**Risque :** Site ne démarre plus, erreurs de compilation
**Protection :** Ne jamais modifier sans savoir

#### 3. **Variables d'environnement**
```
.env                        # Variables de développement
.env.production             # Variables de production
.env.local                  # Secrets locaux
```
**Risque :** Connexions DB cassées, authentification impossible
**Protection :** Sauvegarder dans un endroit sûr

### 🟠 **NIVEAU ÉLEVÉ - Fonctionnalités majeures cassées**

#### 4. **Composants principaux**
```
src/app/layout.tsx          # Structure globale du site
src/app/page.tsx            # Page d'accueil
src/app/globals.css         # Styles globaux
src/components/Header.tsx    # Navigation principale
```
**Risque :** Interface utilisateur cassée, navigation impossible

#### 5. **API Routes**
```
src/app/api/articles/route.ts     # API des articles
src/app/api/auth/login/route.ts   # Authentification
src/app/api/upload/route.ts       # Upload de fichiers
```
**Risque :** Fonctionnalités backend non disponibles

#### 6. **Migrations Prisma**
```
prisma/migrations/           # Dossier des migrations DB
```
**Risque :** Structure de base de données corrompue

### 🟡 **NIVEAU MOYEN - Fonctionnalités spécifiques cassées**

#### 7. **Types et utilitaires**
```
src/lib/types.ts            # Définitions TypeScript
src/lib/prisma.ts           # Connexion base de données
src/lib/auth.ts             # Logique d'authentification
src/lib/categories.ts       # Configuration des rubriques
```
**Risque :** Erreurs de compilation, logique métier cassée

#### 8. **Composants critiques**
```
src/components/ArticleCard.tsx    # Cartes d'articles
src/components/ArticleContent.tsx # Affichage du contenu
```
**Risque :** Affichage des articles défaillant

## 🛡️ PROTECTION ET SAUVEGARDES

### Sauvegarde automatique (Recommandé)
```bash
# Script de sauvegarde quotidienne
#!/bin/bash
DATE=$(date +%Y%m%d)
BACKUP_DIR="backups/$DATE"

mkdir -p $BACKUP_DIR

# Sauvegarde de la base de données
cp prisma/prisma/dev.db $BACKUP_DIR/
cp prisma/prod.db $BACKUP_DIR/ 2>/dev/null

# Sauvegarde des fichiers critiques
cp .env $BACKUP_DIR/ 2>/dev/null
cp .env.production $BACKUP_DIR/ 2>/dev/null
cp next.config.js $BACKUP_DIR/
cp package.json $BACKUP_DIR/
cp prisma/schema.prisma $BACKUP_DIR/

# Compression
tar -czf $BACKUP_DIR.tar.gz $BACKUP_DIR/
rm -rf $BACKUP_DIR

echo "✅ Sauvegarde créée: $BACKUP_DIR.tar.gz"
```

### Protection Git
```bash
# Fichiers à ne jamais committer
echo "
.env
.env.local
.env.production
*.db
node_modules/
.next/
backups/
" >> .gitignore
```

## 🚫 ERREURS COURANTES À ÉVITER

### 1. **Suppression accidentelle**
❌ `rm -rf node_modules package.json`  
✅ `rm -rf node_modules` (puis `npm install`)

### 2. **Modification hasardeuse**
❌ Modifier `next.config.js` sans comprendre  
✅ Lire la documentation avant modification

### 3. **Variables d'environnement exposées**
❌ Committer `.env` sur Git public  
✅ Utiliser `.env.example` pour les templates

### 4. **Base de données corrompue**
❌ Modifier directement le fichier `.db`  
✅ Utiliser Prisma Studio ou les migrations

## 🔧 FICHIERS DE RÉCUPÉRATION D'URGENCE

### Templates de secours
```
src/app/layout.tsx.backup    # Layout de base fonctionnel
src/app/page.tsx.backup      # Page d'accueil minimale
next.config.js.backup        # Configuration par défaut
package.json.backup          # Dépendances de base
```

### Script de restauration d'urgence
```bash
#!/bin/bash
echo "🚨 RESTAURATION D'URGENCE"

# Arrêter le serveur
pkill -f "next"

# Restaurer les fichiers critiques
cp src/app/layout.tsx.backup src/app/layout.tsx
cp src/app/page.tsx.backup src/app/page.tsx
cp next.config.js.backup next.config.js
cp package.json.backup package.json

# Réinstaller les dépendances
rm -rf node_modules
npm install

# Reconstruire
npm run build

echo "✅ Restauration terminée"
```

## 📋 CHECKLIST DE MAINTENANCE

### Quotidien
- [ ] Vérifier que le site fonctionne
- [ ] Backup automatique de la DB
- [ ] Consulter les logs d'erreur

### Hebdomadaire  
- [ ] Backup complet du projet
- [ ] Vérifier l'espace disque
- [ ] Tester les fonctionnalités principales

### Mensuel
- [ ] Mettre à jour les dépendances (avec prudence)
- [ ] Nettoyer les anciens backups
- [ ] Audit de sécurité

## 🆘 QUE FAIRE EN CAS DE PROBLÈME

### Site complètement cassé
1. **Ne paniquez pas**
2. **Vérifiez les logs :** `npm run build` pour voir les erreurs
3. **Restaurez depuis un backup récent**
4. **Contactez le support technique**

### Base de données corrompue
1. **Arrêtez le serveur immédiatement**
2. **Restaurez depuis le dernier backup**
3. **Relancez avec :** `npx prisma db push`

### Erreurs de compilation
1. **Supprimez :** `.next/` et `node_modules/`
2. **Réinstallez :** `npm install`
3. **Rebuilder :** `npm run build`

## 📞 CONTACTS D'URGENCE

### Support technique
- Documentation : Guides dans le projet
- Logs d'erreur : Fichiers `.log` et console navigateur
- Community : GitHub Issues, Stack Overflow

### Hébergeur
- **Vercel :** Dashboard → Support
- **Hostinger :** hPanel → Support Chat 24/7
- **Railway :** Discord Community

## 💡 CONSEILS DE SÉCURITÉ

1. **Principe des sauvegardes 3-2-1 :**
   - 3 copies des données importantes
   - 2 supports différents  
   - 1 copie externalisée (cloud)

2. **Tests avant mise en production :**
   - Toujours tester en local avec `npm run dev`
   - Vérifier le build avec `npm run build`
   - Déployer sur un environnement de test d'abord

3. **Monitoring continu :**
   - Vérification quotidienne du fonctionnement
   - Alertes automatiques en cas de problème
   - Logs centralisés pour le debugging

En suivant ces recommandations, votre site restera stable et sécurisé ! 🛡️