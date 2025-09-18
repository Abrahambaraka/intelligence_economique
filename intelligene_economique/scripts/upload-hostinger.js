
// Importation des modules nécessaires
const FTPClient = require('ftp'); // Module pour gérer la connexion FTP
const fs = require('fs'); // Module pour gérer les fichiers locaux
const path = require('path'); // Module pour gérer les chemins de fichiers

// Configuration FTP Hostinger

// Paramètres de connexion FTP à Hostinger
// À personnaliser avec vos identifiants et informations d'accès
const ftpConfig = {
  host: process.env.HOSTINGER_HOST || 'ftp.votre-domaine.com', // Adresse du serveur FTP
  user: process.env.HOSTINGER_USER || 'votre-username', // Nom d'utilisateur FTP
  password: process.env.HOSTINGER_PASS || 'votre-password', // Mot de passe FTP
  port: 21, // Port FTP standard
  secure: false, // Mettre à true si vous utilisez FTPS
  connTimeout: 60000, // Temps d'attente de connexion
  pasvTimeout: 60000, // Temps d'attente en mode passif
  keepalive: 60000 // Durée de maintien de la connexion
};


// Création du client FTP
const client = new FTPClient();

// Fonction pour uploader récursivement
// Fonction pour uploader un dossier local vers le serveur FTP Hostinger
// Cette fonction est récursive et gère les sous-dossiers
function uploadDir(localDir, remoteDir) {
  return new Promise((resolve, reject) => {
    const files = fs.readdirSync(localDir);
    let uploaded = 0;
    
    // Si le dossier est vide, on termine
    if (files.length === 0) {
      resolve();
      return;
    }

    files.forEach(file => {
      const localPath = path.join(localDir, file);
      const remotePath = `${remoteDir}/${file}`;
      const stat = fs.statSync(localPath);

      // Si c'est un dossier, on le crée sur le serveur et on appelle la fonction récursivement
      if (stat.isDirectory()) {
        client.mkdir(remotePath, true, (err) => {
          if (err && err.code !== 550) { // 550 = le dossier existe déjà
            console.error(`Erreur création dossier ${remotePath}:`, err);
          }
          uploadDir(localPath, remotePath).then(() => {
            uploaded++;
            if (uploaded === files.length) resolve();
          }).catch(reject);
        });
      } else {
        client.put(localPath, remotePath, (err) => {
          if (err) {
            console.error(`Erreur upload ${file}:`, err);
            reject(err);
          } else {
            console.log(`✅ Uploaded: ${file}`);
            uploaded++;
            if (uploaded === files.length) resolve();
          }
        });
      }
    });
  });
}

// Script principal
console.log('🚀 Démarrage upload vers Hostinger...');

client.on('ready', async () => {
  try {
    console.log('📡 Connecté au serveur FTP');
    
    // Aller dans le dossier public_html
    await new Promise((resolve, reject) => {
      client.cwd('public_html', (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    
    console.log('📁 Dossier public_html trouvé');
    
    // Upload du dossier .next et autres fichiers nécessaires
    console.log('📤 Upload des fichiers Next.js...');
    await uploadDir('./.next', '.next');
    await uploadDir('./public', 'public');
    
    // Upload des fichiers de configuration
    const configFiles = ['package.json', 'next.config.js'];
    for (const file of configFiles) {
      if (fs.existsSync(file)) {
        await new Promise((resolve, reject) => {
          client.put(file, file, (err) => {
            if (err) reject(err);
            else {
              console.log(`✅ Uploaded: ${file}`);
              resolve();
            }
          });
        });
      }
    }
    
    console.log('✅ Upload terminé avec succès !');
    console.log('🌐 Votre site est maintenant en ligne');
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    client.end();
  }
});

client.on('error', (err) => {
  console.error('❌ Erreur FTP:', err);
});

// Connexion
client.connect(ftpConfig);
