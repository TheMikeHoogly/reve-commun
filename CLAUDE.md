# CLAUDE.md — Le Rêve Commun

Instructions persistantes pour toutes les sessions Claude Code sur ce projet.

## Vision du Projet

"Le Rêve Commun" est une plateforme de connexion pour des humains qui partagent une vision
alternative du monde : joie, spiritualité non-duelle, CNV, modèles économiques alternatifs (RBI).
La réalité est une fiction collective que nous pouvons choisir consciemment.
Le critère ultime : la **joie** qu'elle procure.

## Stack Technique

- **Backend** : Node.js 18+ avec Express 4
- **Base de données** : PostgreSQL 14+ via `pg` (node-postgres)
- **Frontend** : React 18 + Tailwind CSS 3 + Vite
- **Auth** : JWT (jsonwebtoken) + bcrypt
- **ORM** : Pas d'ORM lourd — requêtes SQL directes via `pg` pour la lisibilité
- **Tests** : Jest (backend), Vitest (frontend)

## Normes de Codage

- ES Modules (`"type": "module"`) côté serveur
- Async/await partout, pas de callbacks
- Nommage : camelCase variables/fonctions, PascalCase composants React
- Fichiers : kebab-case pour les routes/utils, PascalCase pour les composants
- Indentation : 2 espaces
- Pas de `console.log` en production — utiliser le logger `server/utils/logger.js`

## Décisions Architecturales

1. **Pas d'ORM** : Les requêtes SQL directes sont plus lisibles pour ce projet simple
2. **JWT stateless** : Pas de sessions côté serveur, token stocké dans localStorage
3. **Simulation intégrée** : Le module `/simulation` génère des données synthétiques réalistes
4. **API REST** : Endpoints préfixés `/api/v1/`
5. **Frontend séparé** : Vite dev server sur port 3000, Express API sur port 5000

## Structure des Ports

- `localhost:3000` → Frontend React (Vite)
- `localhost:5000` → Backend Express API
- `localhost:5432` → PostgreSQL

## Variables d'Environnement (.env)

```
DATABASE_URL=postgresql://postgres:password@localhost:5432/revecommun
JWT_SECRET=reve_commun_secret_change_in_production
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## Commandes Utiles

```bash
# Démarrer tout (depuis la racine)
npm run dev

# Backend seul
npm run server

# Frontend seul
npm run client

# Initialiser la base de données
npm run db:init

# Seeder avec des données de test
npm run db:seed

# Générer N utilisateurs simulés
npm run simulate -- --users 50
```

## Philosophie du Code

- Préférer la clarté à l'optimisation prématurée
- Chaque fichier doit avoir une responsabilité claire
- Les composants React restent < 150 lignes
- Les routes Express restent < 50 lignes (logique dans les controllers)

## Bibliothèques Préférées

| Besoin | Bibliothèque |
|--------|-------------|
| Requêtes HTTP client | axios |
| Validation formulaires | react-hook-form |
| Icônes | lucide-react |
| Animations | framer-motion |
| Graphiques/Carte | recharts + d3-force |
| Dates | date-fns |
| UUID | crypto.randomUUID() natif |
| Notifications | react-hot-toast |

## Checklist de Revue

- [ ] Les variables d'environnement sensibles ne sont pas hardcodées
- [ ] Les routes API valident leurs inputs
- [ ] Les erreurs sont gérées avec des messages clairs
- [ ] Les composants React ont des PropTypes ou TypeScript basique
- [ ] Les requêtes SQL utilisent des paramètres préparés (pas de concaténation)

## Phases du Projet

1. ✅ Structure + CLAUDE.md
2. ⬜ Base de données (modèles SQL)
3. ⬜ Backend API (CRUD)
4. ⬜ Authentification JWT
5. ⬜ Module de simulation
6. ⬜ Frontend de base
7. ⬜ Visualisation carte
8. ⬜ Fonctionnalités sociales
9. ⬜ Tests + README
