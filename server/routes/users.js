import express from 'express';
import { query } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/v1/users/me
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const result = await query(
      `SELECT u.id, u.name, u.email, u.location, u.bio, u.avatar_url, u.created_at,
              array_agg(DISTINCT uv.value_id) FILTER (WHERE uv.value_id IS NOT NULL) AS value_ids
       FROM users u
       LEFT JOIN user_values uv ON uv.user_id = u.id
       WHERE u.id = $1
       GROUP BY u.id`,
      [req.user.id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Utilisateur non trouvé' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT /api/v1/users/me — Mettre à jour le profil
router.put('/me', authenticateToken, async (req, res) => {
  const { name, location, bio, value_ids } = req.body;

  try {
    await query(
      `UPDATE users SET name = COALESCE($1, name), location = COALESCE($2, location),
       bio = COALESCE($3, bio) WHERE id = $4`,
      [name, location, bio, req.user.id]
    );

    // Mettre à jour les valeurs si fournies
    if (Array.isArray(value_ids)) {
      await query('DELETE FROM user_values WHERE user_id = $1', [req.user.id]);
      if (value_ids.length > 0) {
        const placeholders = value_ids.map((_, i) => `($1, $${i + 2})`).join(', ');
        await query(
          `INSERT INTO user_values (user_id, value_id) VALUES ${placeholders}`,
          [req.user.id, ...value_ids]
        );
      }
    }

    res.json({ message: 'Profil mis à jour' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/v1/users/:id — Profil public
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const result = await query(
      `SELECT u.id, u.name, u.location, u.bio, u.avatar_url, u.created_at,
              array_agg(DISTINCT v.name) FILTER (WHERE v.name IS NOT NULL) AS values
       FROM users u
       LEFT JOIN user_values uv ON uv.user_id = u.id
       LEFT JOIN values_list v ON v.id = uv.value_id
       WHERE u.id = $1
       GROUP BY u.id`,
      [req.params.id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Utilisateur non trouvé' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
