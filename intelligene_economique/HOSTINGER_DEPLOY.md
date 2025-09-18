# Guide de déploiement sur Hostinger

## 📋 Prérequis

1. **Compte Hostinger** avec hébergement web
2. **Domaine configuré** sur votre hébergement
3. **Accès FTP** (disponible dans hPanel)

## 🔧 Configuration

### 1. Variables d'environnement
Créez un fichier `.env.local` avec vos informations Hostinger :

```bash
HOSTINGER_HOST=ftp.votre-domaine.com
HOSTINGER_USER=votre-username-ftp
HOSTINGER_PASS=votre-password-ftp
NEXT_PUBLIC_SITE_URL=https://votre-domaine.com
```

### 2. Installation des dépendances
```bash
npm install ftp --save-dev
```

## 🚀 Déploiement

### Méthode automatique :
```bash
npm run deploy:hostinger
```

### Méthode manuelle :

#### 1. Build du projet
```bash
npm run build
```

#### 2. Export statique
```bash
npm run export
```

#### 3. Upload FTP
```bash
npm run upload
```

## 📁 Structure sur Hostinger

```
public_html/
├── index.html
├── _next/
│   ├── static/
│   └── ...
├── images/
├── .htaccess
└── ...
```

## ⚙️ Configuration Hostinger

### 1. Dans hPanel :
- Allez dans **Gestionnaire de fichiers**
- Assurez-vous que votre domaine pointe vers `public_html`
- Activez SSL gratuit

### 2. Base de données (si nécessaire) :
- Créez une base MySQL dans hPanel
- Mettez à jour `DATABASE_URL` dans `.env.production`

### 3. PHP (si utilisé avec API routes) :
- Version PHP 8.1+ recommandée
- Extensions : `pdo_mysql`, `curl`, `zip`

## 🔒 Sécurité

### SSL Certificate :
1. Dans hPanel → SSL
2. Activez "Force HTTPS"
3. Le `.htaccess` redirigera automatiquement

### Optimisations :
- Compression Gzip activée
- Cache des assets statiques
- Headers de sécurité

## 🐛 Dépannage

### Erreur 404 sur les routes :
- Vérifiez que `.htaccess` est uploadé
- Mode de réécriture Apache activé

### Images ne s'affichent pas :
- Vérifiez les permissions (755 pour dossiers, 644 pour fichiers)
- Chemins relatifs dans le code

### Site lent :
- Activez la compression dans hPanel
- Optimisez les images avant upload
- Utilisez le CDN Hostinger si disponible

## 📞 Support

- Documentation Hostinger : https://support.hostinger.com
- Chat support 24/7 disponible
- Base de connaissances complète

## 💡 Tips

1. **Sauvegarde** : Hostinger fait des backups automatiques
2. **Analytics** : Intégrez Google Analytics
3. **Performance** : Surveillez via PageSpeed Insights
4. **SEO** : Soumettez votre sitemap à Google Search Console
