# 🌐 GUIDE CONFIGURATION DNS - intelligenceconomique.com
# Comment pointer votre domaine vers votre VPS

## 📋 INFORMATIONS NÉCESSAIRES

**Votre VPS IP :** `195.35.3.36`
**Votre domaine :** `intelligenceconomique.com`

## 🎯 ÉTAPES À SUIVRE

### 1. Accéder à votre panel Hostinger

1. Connectez-vous à : https://hpanel.hostinger.com
2. Utilisez vos identifiants Hostinger
3. Allez dans la section **"Domaines"**

### 2. Sélectionner votre domaine

1. Trouvez `intelligenceconomique.com` dans la liste
2. Cliquez sur **"Gérer"** ou **"Manage"**
3. Allez dans **"Zone DNS"** ou **"DNS Zone"**

### 3. Configurer les enregistrements DNS

**IMPORTANT :** Supprimez d'abord les anciens enregistrements A existants

#### Ajoutez ces enregistrements :

```
Type: A
Nom: @ (ou laissez vide)
Valeur: 195.35.3.36
TTL: 3600 (ou Auto)
```

```
Type: A  
Nom: www
Valeur: 195.35.3.36
TTL: 3600 (ou Auto)
```

#### Optionnel - Enregistrement CNAME :
```
Type: CNAME
Nom: www
Valeur: intelligenceconomique.com
TTL: 3600
```

### 4. Exemple visuel de configuration

```
┌─────────────────────────────────────────────────────────┐
│ Type │ Nom    │ Valeur           │ TTL  │ Actions      │
├──────┼────────┼──────────────────┼──────┼──────────────┤
│ A    │ @      │ 195.35.3.36      │ 3600 │ ✅ Ajouter   │
│ A    │ www    │ 195.35.3.36      │ 3600 │ ✅ Ajouter   │
└─────────────────────────────────────────────────────────┘
```

### 5. Sauvegarder les modifications

1. Cliquez sur **"Sauvegarder"** ou **"Save"**
2. Confirmez les modifications

## ⏱️ TEMPS DE PROPAGATION

- **Minimum :** 15-30 minutes
- **Maximum :** 24-48 heures
- **Moyenne :** 1-4 heures

## 🔍 VÉRIFIER LA PROPAGATION DNS

### Méthode 1 : En ligne
Visitez : https://dnschecker.org
- Entrez : `intelligenceconomique.com`
- Vérifiez que l'IP `195.35.3.36` apparaît

### Méthode 2 : Ligne de commande
```cmd
nslookup intelligenceconomique.com
```
Devrait retourner : `195.35.3.36`

### Méthode 3 : Test direct
```cmd
ping intelligenceconomique.com
```

## 🚀 APRÈS PROPAGATION DNS

Une fois le DNS propagé, je configurerai automatiquement SSL :

```bash
ssh root@195.35.3.36 "certbot --nginx -d intelligenceconomique.com -d www.intelligenceconomique.com --non-interactive --agree-tos --email admin@intelligenceconomique.com"
```

## 🎯 RÉSULTAT FINAL

Une fois terminé, votre site sera accessible via :
- ✅ http://intelligenceconomique.com
- ✅ https://intelligenceconomique.com (avec SSL)
- ✅ https://www.intelligenceconomique.com

## 🆘 EN CAS DE PROBLÈME

### DNS ne se propage pas
1. Vérifiez que les enregistrements sont corrects
2. Attendez plus longtemps (jusqu'à 24h)
3. Contactez le support Hostinger

### Erreur "domaine introuvable"
1. Vérifiez l'orthographe des enregistrements
2. Assurez-vous d'avoir supprimé les anciens
3. Rechargez la configuration DNS

### Site inaccessible après DNS
1. Testez d'abord : http://195.35.3.36 (doit marcher)
2. Vérifiez la propagation DNS
3. Attendez la propagation complète

---

## 📞 AIDE SUPPLÉMENTAIRE

**Panel Hostinger :** https://hpanel.hostinger.com
**Support Hostinger :** Live chat dans le panel
**Documentation :** https://support.hostinger.com

**Une fois la configuration DNS faite, prévenez-moi pour que je configure SSL automatiquement !** 🔒