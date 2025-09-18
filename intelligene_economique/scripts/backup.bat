@echo off
REM Script de sauvegarde automatique pour Windows
REM Intelligence Économique

set DATE=%date:~6,4%%date:~3,2%%date:~0,2%_%time:~0,2%%time:~3,2%%time:~6,2%
set DATE=%DATE: =0%
set BACKUP_DIR=backups
set PROJECT_NAME=intelligene_economique

echo 🔄 Démarrage sauvegarde automatique - %DATE%

REM Créer le dossier de sauvegarde
if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"

REM Sauvegarde de la base de données
echo 📊 Sauvegarde base de données...
if exist "prisma\prisma\dev.db" (
    copy "prisma\prisma\dev.db" "%BACKUP_DIR%\dev_%DATE%.db" >nul
    echo ✅ dev.db sauvegardée
)

if exist "prisma\prod.db" (
    copy "prisma\prod.db" "%BACKUP_DIR%\prod_%DATE%.db" >nul
    echo ✅ prod.db sauvegardée
)

REM Sauvegarde des fichiers critiques
echo ⚙️ Sauvegarde fichiers critiques...

if exist "next.config.js" copy "next.config.js" "%BACKUP_DIR%\" >nul
if exist "package.json" copy "package.json" "%BACKUP_DIR%\" >nul
if exist "tsconfig.json" copy "tsconfig.json" "%BACKUP_DIR%\" >nul
if exist "prisma\schema.prisma" copy "prisma\schema.prisma" "%BACKUP_DIR%\" >nul

REM Créer un fichier d'information sur la sauvegarde
echo Sauvegarde du %date% à %time% > "%BACKUP_DIR%\backup_%DATE%_info.txt"
echo Fichiers sauvegardés: >> "%BACKUP_DIR%\backup_%DATE%_info.txt"
dir /b "%BACKUP_DIR%\*%DATE%*" >> "%BACKUP_DIR%\backup_%DATE%_info.txt"

REM Nettoyer les anciennes sauvegardes (garder 7 jours)
echo 🧹 Nettoyage anciennes sauvegardes...
forfiles /p "%BACKUP_DIR%" /s /m "*backup*" /d -7 /c "cmd /c del @path" 2>nul

echo.
echo ✅ Sauvegarde terminée !
echo 📁 Dossier: %BACKUP_DIR%
echo 📅 Date: %date% %time%

REM Log de la sauvegarde
echo %DATE% - Sauvegarde réussie >> "%BACKUP_DIR%\backup.log"

pause