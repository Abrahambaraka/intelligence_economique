# Guide pratique des modifications courantes

## 📝 Modifications de contenu

### 1. Ajouter un nouvel article
**Via l'interface web (le plus simple):**
1. Allez sur `votre-site.com/publier`
2. Connectez-vous avec vos identifiants admin
3. Rédigez votre article
4. Cliquez "Publier"
5. ✅ Article en ligne immédiatement !

### 2. Modifier les rubriques
**Fichier à modifier:** `src/lib/categories.ts`
```javascript
export const rubriques = [
  { slug: 'economie-finance', label: "ÉCONOMIE & FINANCE" },
  { slug: 'nouvelle-rubrique', label: "NOUVELLE RUBRIQUE" }, // Ajoutez ici
];
```

### 3. Changer les couleurs du site
**Fichier à modifier:** `src/app/globals.css`
```css
:root {
  --brand-600: #votre-nouvelle-couleur;
  --brand-700: #votre-couleur-foncee;
}
```

### 4. Modifier la page d'accueil
**Fichier à modifier:** `src/app/page.tsx`
- Changer le nombre d'articles affichés
- Modifier les sections
- Ajouter du contenu

## 🎨 Modifications de design

### 1. Changer la police
**Fichier:** `src/app/layout.tsx`
```javascript
import { VotreNouvellePolice } from 'next/font/google'

const police = VotreNouvellePolice({
  subsets: ['latin'],
  variable: '--font-principale'
})
```

### 2. Modifier le logo/favicon
1. Remplacez `public/images/logo.png`
2. Modifiez `src/app/icon.tsx` si nécessaire

### 3. Ajouter une nouvelle page
1. Créez `src/app/nouvelle-page/page.tsx`
2. Ajoutez le lien dans la navigation

## 🔧 Modifications techniques

### 1. Ajouter une nouvelle fonctionnalité
**Structure:**
```
src/
├── app/nouvelle-feature/
│   ├── page.tsx
│   └── loading.tsx
├── components/
│   └── NouveauComposant.tsx
└── lib/
    └── nouvelle-logique.ts
```

### 2. Modifier la base de données
1. Éditez `prisma/schema.prisma`
2. Exécutez `npx prisma migrate dev --name description-changement`
3. Mettez à jour le code correspondant

### 3. Ajouter une API
Créez `src/app/api/nouvelle-route/route.ts`
```javascript
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Votre logique ici
  return NextResponse.json({ data: "votre réponse" });
}
```

## 📱 Workflow de mise à jour recommandé

### Pour les modifications de contenu
1. **Via interface web:** `/publier` pour les articles
2. **Modification directe:** Pour les textes statiques
3. **Test immédiat:** Pas de déploiement nécessaire

### Pour les modifications techniques
1. **Local d'abord:** Testez avec `npm run dev`
2. **Build:** Vérifiez avec `npm run build`
3. **Déploiement:** Selon votre hébergeur
4. **Vérification:** Testez en production

## 🚨 Que faire en cas de problème

### Site cassé après mise à jour
1. **Vercel:** Rollback depuis le dashboard
2. **Hostinger:** Restaurez depuis la sauvegarde
3. **Local:** `git reset --hard HEAD~1`

### Erreur 500
1. Vérifiez les logs
2. Contrôlez les variables d'environnement
3. Vérifiez la base de données

### Performance dégradée
1. Optimisez les images
2. Vérifiez les requêtes DB
3. Activez la compression

## 📞 Support et aide

### Ressources utiles
- **Documentation Next.js:** https://nextjs.org/docs
- **Guide Prisma:** https://www.prisma.io/docs
- **Communauté:** GitHub Issues

### Contacts
- **Support technique:** Via les logs et documentation
- **Modifications urgentes:** Accès direct via FTP/File Manager
- **Formations:** Guides vidéo disponibles
