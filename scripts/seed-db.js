/**
 * Seeder - Importe les données simulées générées par simulation/scraper-simulator.js
 * Usage : npm run db:seed
 */
import dotenv from 'dotenv';
import pg from 'pg';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function seed() {
  const client = await pool.connect();
  try {
    const dataPath = join(__dirname, '../simulation/test-data/users.json');
    let users;
    try {
      users = JSON.parse(readFileSync(dataPath, 'utf-8'));
    } catch {
      console.log('⚠️  Aucune donnée simulée trouvée. Lancez d\'abord : npm run simulate -- --users 50');
      return;
    }

    console.log(`🌱 Insertion de ${users.length} utilisateurs simulés...`);
    let inserted = 0;

    for (const user of users) {
      try {
        const result = await client.query(
          `INSERT INTO users (name, email, password_hash, location, bio, is_simulated)
           VALUES ($1, $2, $3, $4, $5, true)
           ON CONFLICT (email) DO NOTHING RETURNING id`,
          [user.name, user.email, user.password_hash, user.location, user.bio]
        );

        if (result.rows[0] && user.value_ids?.length > 0) {
          for (const valueId of user.value_ids) {
            await client.query(
              'INSERT INTO user_values (user_id, value_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
              [result.rows[0].id, valueId]
            );
          }
          inserted++;
        }
      } catch (err) {
        console.error(`Erreur pour ${user.email}:`, err.message);
      }
    }

    console.log(`✅ ${inserted} utilisateurs insérés avec leurs valeurs.`);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
