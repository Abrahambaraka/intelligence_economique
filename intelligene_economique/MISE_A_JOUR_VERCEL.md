# Guide de mise à jour pour Vercel

## 🚀 Déploiement automatique avec Git

### Configuration initiale (une seule fois)
1. Créez un compte sur https://vercel.com
2. Connectez votre projet GitHub/GitLab
3. Import automatique et déploiement

### Mise à jour en temps réel
```bash
# Modifiez vos fichiers localement
# Puis committez et poussez sur Git

git add .
git commit -m "Mise à jour: nouveau contenu"
git push origin main

# ✅ Vercel détecte automatiquement et redéploie !
# En 2-3 minutes, vos changements sont en ligne
```

### Avantages
- ✅ Automatique : Git push = déploiement
- ✅ Rapide : 2-3 minutes seulement
- ✅ Rollback facile si problème
- ✅ Prévisualisations pour tester avant
- ✅ SSL et CDN automatiques
- ✅ Gratuit pour usage personnel

### Interface web Vercel
- Dashboard pour voir tous les déploiements
- Logs en temps réel
- Analytics intégrés
- Gestion des variables d'environnement
