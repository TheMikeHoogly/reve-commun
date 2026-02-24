import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const schema = `
-- Extension pour UUID
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Utilisateurs
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  location VARCHAR(100),
  bio TEXT,
  avatar_url VARCHAR(500),
  is_simulated BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Liste des valeurs philosophiques
CREATE TABLE IF NOT EXISTS values_list (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  category VARCHAR(50), -- spiritualite, economie, social, ecologie, communication
  emoji VARCHAR(10)
);

-- Valeurs choisies par les utilisateurs
CREATE TABLE IF NOT EXISTS user_values (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  value_id INTEGER REFERENCES values_list(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, value_id)
);

-- Cercles de co-création
CREATE TABLE IF NOT EXISTS circles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(150) NOT NULL,
  description TEXT,
  location VARCHAR(100),
  is_public BOOLEAN DEFAULT true,
  creator_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Membres des cercles
CREATE TABLE IF NOT EXISTS circle_members (
  circle_id UUID REFERENCES circles(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(20) DEFAULT 'member', -- admin, member
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (circle_id, user_id)
);

-- Projets dans la pépinière
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  needed_skills TEXT,
  location VARCHAR(100),
  creator_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Coups de coeur sur les projets
CREATE TABLE IF NOT EXISTS project_likes (
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  liked_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (project_id, user_id)
);

-- Signatures du Pacte de Résonance
CREATE TABLE IF NOT EXISTS pact_signatures (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE PRIMARY KEY,
  signed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index utiles
CREATE INDEX IF NOT EXISTS idx_user_values_user ON user_values(user_id);
CREATE INDEX IF NOT EXISTS idx_user_values_value ON user_values(value_id);
CREATE INDEX IF NOT EXISTS idx_circle_members_user ON circle_members(user_id);
`;

const seedValues = `
INSERT INTO values_list (name, description, category, emoji) VALUES
  ('Joie consciente', 'Choisir la joie comme boussole de vie', 'spiritualite', '✨'),
  ('Non-dualité', 'Explorer la conscience au-delà des opposés', 'spiritualite', '☯️'),
  ('Communication Non-Violente', 'Exprimer besoins et sentiments avec bienveillance', 'communication', '💬'),
  ('Revenu de Base Inconditionnel', 'Soutenir un revenu garanti pour tous', 'economie', '🌱'),
  ('Économie circulaire', 'Zéro déchet, ressources partagées', 'economie', '♻️'),
  ('Décroissance choisie', 'Moins mais mieux, vivre avec moins', 'economie', '🌿'),
  ('Écologie profonde', 'Connexion spirituelle avec la nature', 'ecologie', '🌍'),
  ('Permaculture', 'Concevoir des systèmes inspirés de la nature', 'ecologie', '🥦'),
  ('Intelligence collective', 'Sagesse des groupes, décisions partagées', 'social', '🧠'),
  ('Slow living', 'Ralentir pour vivre plus intensément', 'social', '🐢'),
  ('Parentalité consciente', 'Élever les enfants avec présence et empathie', 'social', '👶'),
  ('Méditation / Pleine conscience', 'Présence au moment présent', 'spiritualite', '🧘'),
  ('Chamanisme contemporain', 'Rituels et connexion aux mondes subtils', 'spiritualite', '🔮'),
  ('Accords Toltèques', 'Les 4 accords pour une vie libre', 'spiritualite', '📜'),
  ('Habitat alternatif', 'Tiny houses, écovillages, habitats partagés', 'social', '🏡'),
  ('Arts créatifs', 'Expression artistique comme voie de transformation', 'social', '🎨'),
  ('Alimentation consciente', 'Végétarisme, végétalisme, alimentation locale', 'ecologie', '🥗'),
  ('Monnaies complémentaires', 'SEL, cryptos alternatives, échanges locaux', 'economie', '💱'),
  ('Éducation alternative', 'Freinet, Montessori, unschooling', 'social', '📚'),
  ('Guérison émotionnelle', 'Thérapies alternatives, travail sur soi', 'spiritualite', '💜')
ON CONFLICT DO NOTHING;
`;

async function initDb() {
  const client = await pool.connect();
  try {
    console.log('🔧 Création du schéma...');
    await client.query(schema);
    console.log('🌱 Insertion des valeurs de base...');
    await client.query(seedValues);
    console.log('✅ Base de données initialisée avec succès !');
  } catch (err) {
    console.error('❌ Erreur lors de l\'initialisation :', err.message);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

initDb();
