# Configuration pour déploiement Hostinger avec Node.js

## 🚀 Guide de déploiement actualisé

### 1. Configuration Hostinger
Votre hébergement Hostinger doit supporter **Node.js** pour ce projet Next.js avec API routes et base de données.

#### Plans compatibles :
- **Business Hosting** (Node.js 16+)
- **Cloud Hosting** 
- **VPS Hosting**

### 2. Variables d'environnement
Créez `.env.production` sur le serveur :

```bash
DATABASE_URL="file:./prod.db"
NEXTAUTH_URL="https://votre-domaine.com"
NEXTAUTH_SECRET="votre-secret-key-very-long-and-secure"
NODE_ENV="production"
```

### 3. Déploiement

#### Via File Manager (Recommandé) :
1. Build local : `npm run build`
2. Compressez le projet en ZIP
3. Uploadez via hPanel File Manager
4. Décompressez dans `public_html`
5. Installez les dépendances : `npm install --production`
6. Lancez : `npm start`

#### Via FTP automatique :
```bash
# Configurez vos identifiants
HOSTINGER_HOST=ftp.votre-domaine.com
HOSTINGER_USER=username
HOSTINGER_PASS=password

# Déployez
npm run deploy:hostinger
```

### 4. Configuration Node.js sur Hostinger

#### Dans hPanel :
1. **Advanced → Node.js Selector**
2. Sélectionnez Node.js 18+ 
3. Document Root : `public_html`
4. Startup file : `server.js`
5. Redémarrez l'application

#### Créez `server.js` :
```javascript
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
```

### 5. Base de données

#### SQLite (Incluse) :
- Fonctionne directement
- Fichier `.db` créé automatiquement
- Parfait pour commencer

#### MySQL (Recommandé pour production) :
1. Créez une base MySQL dans hPanel
2. Modifiez `DATABASE_URL` :
```bash
DATABASE_URL="mysql://user:pass@localhost:3306/dbname"
```
3. Exécutez : `npx prisma migrate deploy`

### 6. Optimisations

#### Performance :
- Compression Gzip activée
- Cache des assets statiques
- CDN Hostinger (si disponible)

#### Sécurité :
- SSL automatique
- Headers de sécurité
- Protection DDoS

### 7. Alternative : Hébergements spécialisés Next.js

Si Node.js n'est pas disponible sur votre plan Hostinger :

#### **Vercel** (Recommandé)
- Deploy gratuit depuis Git
- Optimisé pour Next.js
- Base de données incluse

#### **Netlify**
- Alternative solide
- Fonctions serverless
- Git integration

#### **Railway**
- Simple et efficace
- $5/mois
- Databases incluses

### 8. Migration vers un hébergeur spécialisé

```bash
# Deploy sur Vercel
npm i -g vercel
vercel

# Deploy sur Netlify
npm i -g netlify-cli
netlify deploy --prod

# Deploy sur Railway
# Push vers Git → auto-deploy
```

### 💡 Recommandation

Pour un site de magazine avec CMS, je recommande **Vercel** ou **Railway** plutôt qu'un hébergement partagé traditionnel pour :
- Meilleure performance
- Scaling automatique  
- Moins de configuration
- Prix compétitif
- Support technique spécialisé
