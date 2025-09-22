// Script pour tester la connexion admin rapidement
const express = require('express');

// Simuler une connexion admin rapide
async function quickLogin() {
  try {
    console.log('🔑 Test de connexion admin...');
    
    // Simuler l'appel à l'API de login
    const testCode = 'admin123';
    console.log(`📝 Code utilisé: ${testCode}`);
    
    // Test du code via la fonction auth
    const { verifyAdminCode } = require('../src/lib/auth.ts');
    
    if (verifyAdminCode && verifyAdminCode(testCode)) {
      console.log('✅ Code admin valide !');
      console.log('🌐 Ouvrez: http://localhost:3000/admin');
      console.log('🔐 Utilisez le code: admin123');
    } else {
      console.log('❌ Code admin invalide');
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    console.log('💡 Assurez-vous que le serveur Next.js fonctionne (npm run dev)');
  }
}

quickLogin();