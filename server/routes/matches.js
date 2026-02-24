import express from 'express';
import { query } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/v1/matches — Obtenir les meilleures correspondances pour l'utilisateur connecté
router.get('/', authenticateToken, async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;

  try {
    // Algorithme de résonance : compte les valeurs en commun
    const result = await query(
      `SELECT
         u.id, u.name, u.location, u.bio, u.avatar_url,
         COUNT(DISTINCT uv2.value_id) AS shared_values_count,
         array_agg(DISTINCT v.name) FILTER (WHERE v.name IS NOT NULL) AS shared_values
       FROM users u
       JOIN user_values uv2 ON uv2.user_id = u.id
       JOIN user_values uv1 ON uv1.value_id = uv2.value_id AND uv1.user_id = $1
       JOIN values_list v ON v.id = uv2.value_id
       WHERE u.id != $1
       GROUP BY u.id
       ORDER BY shared_values_count DESC, u.created_at DESC
       LIMIT $2`,
      [req.user.id, limit]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/v1/matches/revelation — "Saviez-vous que..."
router.get('/revelation', authenticateToken, async (req, res) => {
  try {
    const result = await query(
      `SELECT COUNT(DISTINCT u.id) AS count, $1::text AS location
       FROM users u
       JOIN user_values uv2 ON uv2.user_id = u.id
       JOIN user_values uv1 ON uv1.value_id = uv2.value_id AND uv1.user_id = $2
       WHERE u.id != $2`,
      [req.query.location || 'votre région', req.user.id]
    );

    const count = parseInt(result.rows[0]?.count || 0);
    res.json({
      count,
      message: `${count} personnes partagent au moins une de vos valeurs profondes !`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
