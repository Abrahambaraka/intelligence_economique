#!/bin/bash

# Script de sauvegarde automatique pour Intelligence Économique
# À exécuter quotidiennement via cron

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="backups"
PROJECT_NAME="intelligene_economique"

echo "🔄 Démarrage sauvegarde automatique - $DATE"

# Créer le dossier de sauvegarde
mkdir -p $BACKUP_DIR

# Sauvegarde de la base de données
echo "📊 Sauvegarde base de données..."
if [ -f "prisma/prisma/dev.db" ]; then
    cp prisma/prisma/dev.db $BACKUP_DIR/dev_$DATE.db
    echo "✅ dev.db sauvegardée"
fi

if [ -f "prisma/prod.db" ]; then
    cp prisma/prod.db $BACKUP_DIR/prod_$DATE.db
    echo "✅ prod.db sauvegardée"
fi

# Sauvegarde des fichiers de configuration critiques
echo "⚙️ Sauvegarde fichiers critiques..."
CRITICAL_FILES=(
    "next.config.js"
    "package.json"
    "tsconfig.json"
    "prisma/schema.prisma"
    "src/app/layout.tsx"
    "src/app/page.tsx"
    "src/app/globals.css"
    "src/lib/types.ts"
    "src/lib/prisma.ts"
    "src/lib/categories.ts"
)

for file in "${CRITICAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        # Créer la structure de dossiers si nécessaire
        mkdir -p "$BACKUP_DIR/$(dirname $file)"
        cp "$file" "$BACKUP_DIR/$file"
        echo "✅ $file sauvegardé"
    fi
done

# Sauvegarde des variables d'environnement (sans les secrets)
echo "🔐 Sauvegarde configuration environnement..."
if [ -f ".env.example" ]; then
    cp .env.example $BACKUP_DIR/
fi

# Créer un archive compressée
echo "📦 Compression de la sauvegarde..."
tar -czf "$BACKUP_DIR/${PROJECT_NAME}_backup_$DATE.tar.gz" -C $BACKUP_DIR . 2>/dev/null

# Nettoyer les fichiers temporaires
rm -f $BACKUP_DIR/*.db
rm -rf $BACKUP_DIR/src $BACKUP_DIR/prisma
rm -f $BACKUP_DIR/*.js $BACKUP_DIR/*.json $BACKUP_DIR/.env.example

# Nettoyer les anciennes sauvegardes (garder 7 jours)
echo "🧹 Nettoyage anciennes sauvegardes..."
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

# Statistiques
BACKUP_SIZE=$(du -h "$BACKUP_DIR/${PROJECT_NAME}_backup_$DATE.tar.gz" | cut -f1)
BACKUP_COUNT=$(ls -1 $BACKUP_DIR/*.tar.gz 2>/dev/null | wc -l)

echo ""
echo "✅ Sauvegarde terminée !"
echo "📁 Fichier: ${PROJECT_NAME}_backup_$DATE.tar.gz"
echo "📏 Taille: $BACKUP_SIZE"
echo "📊 Total sauvegardes: $BACKUP_COUNT"
echo "📅 Date: $(date)"

# Log de la sauvegarde
echo "$DATE - Sauvegarde réussie - $BACKUP_SIZE" >> $BACKUP_DIR/backup.log