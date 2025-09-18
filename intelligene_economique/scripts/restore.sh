#!/bin/bash

# Script de restauration d'urgence
# À utiliser si le site est complètement cassé

echo "🚨 SCRIPT DE RESTAURATION D'URGENCE"
echo "=================================="
echo "⚠️  ATTENTION: Ce script va restaurer les fichiers critiques"
echo "⚠️  Assurez-vous d'avoir une sauvegarde récente"
echo ""

read -p "Voulez-vous continuer ? (oui/non): " confirm
if [ "$confirm" != "oui" ]; then
    echo "❌ Restauration annulée"
    exit 1
fi

echo "🔄 Début de la restauration..."

# Arrêter le serveur de développement
echo "⏹️  Arrêt du serveur..."
pkill -f "next" 2>/dev/null || echo "Aucun serveur Next.js en cours"

# Vérifier s'il y a des sauvegardes
if [ ! -d "backups" ] || [ -z "$(ls -A backups/*.tar.gz 2>/dev/null)" ]; then
    echo "❌ Aucune sauvegarde trouvée dans le dossier backups/"
    echo "💡 Utilisez: npm install pour réinstaller les dépendances"
    exit 1
fi

# Lister les sauvegardes disponibles
echo "📋 Sauvegardes disponibles:"
ls -la backups/*.tar.gz | awk '{print NR ": " $9 " (" $5 " bytes, " $6 " " $7 " " $8 ")"}'

echo ""
read -p "Quelle sauvegarde voulez-vous utiliser ? (numéro): " backup_num

# Sélectionner le fichier de sauvegarde
backup_file=$(ls backups/*.tar.gz | sed -n "${backup_num}p")

if [ -z "$backup_file" ]; then
    echo "❌ Numéro de sauvegarde invalide"
    exit 1
fi

echo "📦 Extraction de: $backup_file"

# Créer un dossier temporaire pour l'extraction
temp_dir="temp_restore_$$"
mkdir -p $temp_dir
tar -xzf "$backup_file" -C $temp_dir

# Restaurer les fichiers critiques
echo "🔄 Restauration des fichiers critiques..."

critical_files=(
    "next.config.js"
    "package.json"
    "tsconfig.json"
    "prisma/schema.prisma"
)

for file in "${critical_files[@]}"; do
    if [ -f "$temp_dir/$file" ]; then
        cp "$temp_dir/$file" "$file"
        echo "✅ $file restauré"
    fi
done

# Restaurer la base de données
echo "🗄️  Restauration de la base de données..."
if [ -f "$temp_dir"/*.db ]; then
    latest_db=$(ls -t "$temp_dir"/*.db | head -1)
    if [[ "$latest_db" == *"prod"* ]]; then
        cp "$latest_db" "prisma/prod.db"
        echo "✅ Base de données de production restaurée"
    else
        cp "$latest_db" "prisma/prisma/dev.db"
        echo "✅ Base de données de développement restaurée"
    fi
fi

# Nettoyer le dossier temporaire
rm -rf $temp_dir

# Réinstaller les dépendances
echo "📦 Réinstallation des dépendances..."
rm -rf node_modules .next
npm install

# Générer le client Prisma
echo "🔄 Génération du client Prisma..."
npx prisma generate

# Tester la compilation
echo "🧪 Test de compilation..."
if npm run build; then
    echo "✅ Compilation réussie !"
    echo ""
    echo "🎉 RESTAURATION TERMINÉE AVEC SUCCÈS !"
    echo "🚀 Vous pouvez maintenant relancer le serveur avec: npm run dev"
else
    echo "❌ Erreur de compilation"
    echo "💡 Vérifiez les logs d'erreur ci-dessus"
    echo "💡 Vous pouvez essayer: npm install --force"
fi

echo ""
echo "📝 Log de restauration:"
echo "   - Sauvegarde utilisée: $backup_file"
echo "   - Date: $(date)"
echo "   - Fichiers restaurés: Configuration, DB, dépendances"