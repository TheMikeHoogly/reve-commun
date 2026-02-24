# Le Rêve Commun ✨

> "Et si le but du jeu était simplement de jouer avec joie ?"

Plateforme de connexion pour les bâtisseurs d'un monde fondé sur la joie, la bienveillance et la co-création.

## Démarrage rapide

### Prérequis

- Node.js 18+
- PostgreSQL 14+ (en cours d'exécution)

### Installation

```bash
# 1. Installer toutes les dépendances
npm run install:all

# 2. Configurer les variables d'environnement
# Éditez .env avec vos paramètres PostgreSQL :
#   DATABASE_URL=postgresql://postgres:VOTRE_MOT_DE_PASSE@localhost:5432/revecommun

# 3. Créer la base de données
# Dans psql ou pgAdmin : CREATE DATABASE revecommun;

# 4. Initialiser le schéma + valeurs de base
npm run db:init

# 5. (Optionnel) Générer des utilisateurs de test
npm run simulate -- --users 50
npm run db:seed

# 6. Lancer l'application
npm run dev
```

L'application sera disponible sur :
- **Frontend** : http://localhost:3000
- **API** : http://localhost:5000
- **Santé** : http://localhost:5000/api/health

## Fonctionnalités

| Feature | Description |
|---------|-------------|
| **Résonances** | Matching d'âmes par valeurs profondes (Jaccard similarity) |
| **Constellation** | Visualisation canvas du réseau de connexions |
| **Cercles** | Groupes locaux de co-création |
| **Pépinière** | Dépôt de projets alternatifs avec coups de coeur |
| **Pacte de Résonance** | Engagement signable pour la joie consciente |
| **Profil de valeurs** | 20 valeurs dans 5 catégories |

## Structure du projet

```
reve-commun/
├── server/           → API Express (port 5000)
│   ├── routes/       → Endpoints REST
│   ├── middleware/   → Auth JWT
│   └── db.js         → Pool PostgreSQL
├── client/           → React + Vite (port 3000)
│   └── src/
│       ├── pages/    → Vues principales
│       ├── components/ → Composants réutilisables
│       └── context/  → AuthContext
├── simulation/       → Générateur de données synthétiques
├── scripts/          → Init DB, Seed
└── CLAUDE.md         → Instructions pour Claude Code
```

## API Endpoints

| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/api/v1/auth/register` | Inscription |
| POST | `/api/v1/auth/login` | Connexion |
| GET | `/api/v1/users/me` | Profil courant |
| PUT | `/api/v1/users/me` | Modifier profil |
| GET | `/api/v1/matches` | Mes résonances |
| GET | `/api/v1/matches/revelation` | "Saviez-vous que..." |
| GET | `/api/v1/circles` | Lister cercles |
| POST | `/api/v1/circles` | Créer cercle |
| POST | `/api/v1/circles/:id/join` | Rejoindre cercle |
| GET | `/api/v1/projects` | Pépinière |
| POST | `/api/v1/projects` | Créer projet |
| POST | `/api/v1/projects/:id/like` | Coup de coeur |
| GET | `/api/v1/pact` | Pacte + statut |
| POST | `/api/v1/pact/sign` | Signer le pacte |
| GET | `/api/v1/values` | Liste des valeurs |

## Inspiration philosophique

- *Conversations avec Dieu* — Neale Donald Walsch
- *Les Quatre Accords Toltèques* — Don Miguel Ruiz
- *Communication Non-Violente* — Marshall Rosenberg
- *Revenu de Base Inconditionnel* — mouvement mondial
- La joie comme critère ultime de choix conscient

---

*Ce projet incarne déjà, dans sa conception, la philosophie qu'il veut promouvoir.*
