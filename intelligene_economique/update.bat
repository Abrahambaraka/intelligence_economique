@echo off
REM Script de mise à jour pour Windows
REM Intelligence Économique

echo 🚀 Mise à jour du site Intelligence Économique
echo ============================================

if not exist "package.json" (
    echo ❌ Erreur: Exécutez ce script depuis la racine du projet
    pause
    exit /b 1
)

echo Choisissez votre méthode de déploiement:
echo 1) Vercel (automatique via Git)
echo 2) Hostinger (FTP)
echo 3) Build local seulement
echo 4) Test local

set /p choice="Votre choix (1-4): "

if "%choice%"=="1" (
    echo 📤 Déploiement Vercel via Git...
    git add .
    set /p message="Message de commit: "
    git commit -m "%message%"
    git push origin main
    echo ✅ Push effectué! Vercel déploie automatiquement.
    echo 🌐 Vérifiez sur votre dashboard Vercel
) else if "%choice%"=="2" (
    echo 📦 Build pour Hostinger...
    call npm run build
    if %errorlevel%==0 (
        echo 📤 Upload vers Hostinger...
        call npm run deploy:hostinger
        echo ✅ Déploiement Hostinger terminé!
    ) else (
        echo ❌ Erreur lors du build
        pause
        exit /b 1
    )
) else if "%choice%"=="3" (
    echo 📦 Build local uniquement...
    call npm run build
    echo ✅ Build terminé! Fichiers dans .next/
) else if "%choice%"=="4" (
    echo 🔧 Test en mode développement...
    call npm run dev
) else (
    echo ❌ Choix invalide
    pause
    exit /b 1
)

echo.
echo 🎉 Opération terminée!
echo 📋 Vérifiez votre site à l'adresse:
echo    - Local: http://localhost:3000
echo    - Production: https://votre-domaine.com
pause
