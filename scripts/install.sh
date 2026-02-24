#!/bin/bash
# Script d'installation complet pour Le Rêve Commun

set -e

echo ""
echo "✨ Installation de Le Rêve Commun..."
echo ""

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js non trouvé. Installez Node.js 18+ depuis https://nodejs.org"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js $NODE_VERSION détecté. Version 18+ requise."
    exit 1
fi

echo "✅ Node.js $(node -v) détecté"

# Installer dépendances racine
echo "📦 Installation des dépendances backend..."
npm install --silent

# Installer dépendances client
echo "📦 Installation des dépendances frontend..."
cd client && npm install --silent && cd ..

echo ""
echo "✅ Installation terminée !"
echo ""
echo "📋 Prochaines étapes :"
echo "   1. Éditez .env avec vos paramètres PostgreSQL"
echo "   2. Créez la base : psql -c 'CREATE DATABASE revecommun;'"
echo "   3. Initialisez : npm run db:init"
echo "   4. (Optionnel) Données test : npm run simulate -- --users 50 && npm run db:seed"
echo "   5. Lancez : npm run dev"
echo ""
echo "✨ Bienvenue dans Le Rêve Commun !"
