
#!/bin/bash

# Script de mise à jour universelle pour Intelligence Économique
# Compatible avec tous les hébergeurs
# Ce script permet de déployer le site sur différents hébergeurs, dont Hostinger


echo "🚀 Mise à jour du site Intelligence Économique"
echo "============================================"


# Vérification que le script est lancé à la racine du projet
if [ ! -f "package.json" ]; then
    echo "❌ Erreur: Exécutez ce script depuis la racine du projet"
    exit 1
fi


# Menu de choix pour le déploiement
echo "Choisissez votre méthode de déploiement:"
echo "1) Vercel (automatique via Git)"
echo "2) Hostinger (FTP)"
echo "3) Build local seulement"
echo "4) Test local"


read -p "Votre choix (1-4): " choice


case $choice in
    1)
        # Déploiement automatique sur Vercel via Git
        echo "📤 Déploiement Vercel via Git..."
        git add .
        read -p "Message de commit: " message
        git commit -m "$message"
        git push origin main
        echo "✅ Push effectué! Vercel déploie automatiquement."
        echo "🌐 Vérifiez sur votre dashboard Vercel"
        ;;
    2)
        # Déploiement manuel sur Hostinger via FTP
        echo "📦 Build pour Hostinger..."
        npm run build # Construction du projet Next.js pour la production
        if [ $? -eq 0 ]; then
            echo "📤 Upload vers Hostinger..." # Envoi des fichiers sur le serveur Hostinger
            npm run deploy:hostinger # Commande personnalisée pour uploader via FTP
            echo "✅ Déploiement Hostinger terminé!" # Confirmation de la fin du déploiement
        else
            echo "❌ Erreur lors du build"
            exit 1
        fi
        ;;
    3)
        echo "📦 Build local uniquement..."
        npm run build
        echo "✅ Build terminé! Fichiers dans .next/"
        ;;
    4)
        echo "🔧 Test en mode développement..."
        npm run dev
        ;;
    *)
        echo "❌ Choix invalide"
        exit 1
        ;;
esac

echo ""
echo "🎉 Opération terminée!"
echo "📋 Vérifiez votre site à l'adresse:"
echo "   - Local: http://localhost:3000"
echo "   - Production: https://votre-domaine.com"
