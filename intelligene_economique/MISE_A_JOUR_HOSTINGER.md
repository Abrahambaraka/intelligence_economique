# Guide de mise à jour pour Hostinger

## 📁 Méthode 1: File Manager (Interface web)

### Via hPanel Hostinger
1. Connectez-vous à hPanel
2. Ouvrez **File Manager**
3. Naviguez vers `public_html`
4. Éditez directement les fichiers ou uploadez les nouveaux

### Avantages
- ✅ Simple et visuel
- ✅ Pas besoin d'outils techniques
- ✅ Modification immédiate

### Inconvénients
- ❌ Pas de sauvegarde automatique
- ❌ Risque d'erreur
- ❌ Pas de versioning

## 🔄 Méthode 2: FTP automatique (Recommandée)

### Configuration FTP
Créez `.env.local` avec vos identifiants Hostinger :
```bash
HOSTINGER_HOST=ftp.votre-domaine.com
HOSTINGER_USER=votre-username-ftp
HOSTINGER_PASS=votre-password-ftp
```

### Script de mise à jour rapide
```bash
# 1. Modifiez vos fichiers localement
# 2. Buildez le projet
npm run build

# 3. Uploadez automatiquement
npm run deploy:hostinger

# ✅ En 5-10 minutes, vos changements sont en ligne
```

## 📝 Méthode 3: Édition directe

### Pour les petites modifications (textes, CSS)
1. hPanel → File Manager
2. Clic droit sur le fichier → Edit
3. Modifiez directement le code
4. Save → changements immédiats

### Fichiers souvent modifiés
- `src/app/page.tsx` - Page d'accueil
- `src/app/globals.css` - Styles
- `src/lib/categories.ts` - Rubriques
- `.env.production` - Configuration

## 🔒 Bonnes pratiques Hostinger

### Sauvegarde avant modification
```bash
# Toujours faire une sauvegarde
1. hPanel → Backups → Create Backup
2. Ou télécharger les fichiers via FTP
```

### Test local d'abord
```bash
# Testez toujours en local avant upload
npm run dev     # Test local
npm run build   # Vérifier que ça compile
npm run deploy:hostinger  # Upload
```
