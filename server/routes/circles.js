import express from 'express';
import { query } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/v1/circles — Lister les cercles publics
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await query(
      `SELECT c.*, u.name AS creator_name,
              COUNT(DISTINCT cm.user_id) AS member_count
       FROM circles c
       JOIN users u ON u.id = c.creator_id
       LEFT JOIN circle_members cm ON cm.circle_id = c.id
       WHERE c.is_public = true
       GROUP BY c.id, u.name
       ORDER BY member_count DESC, c.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/v1/circles — Créer un cercle
router.post('/', authenticateToken, async (req, res) => {
  const { name, description, location, is_public = true } = req.body;
  if (!name) return res.status(400).json({ error: 'Nom du cercle requis' });

  try {
    const result = await query(
      `INSERT INTO circles (name, description, location, is_public, creator_id)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, description, location, is_public, req.user.id]
    );
    // Ajouter le créateur comme membre
    await query(
      'INSERT INTO circle_members (circle_id, user_id, role) VALUES ($1, $2, $3)',
      [result.rows[0].id, req.user.id, 'admin']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/v1/circles/:id/join — Rejoindre un cercle
router.post('/:id/join', authenticateToken, async (req, res) => {
  try {
    const circle = await query('SELECT * FROM circles WHERE id = $1', [req.params.id]);
    if (!circle.rows[0]) return res.status(404).json({ error: 'Cercle non trouvé' });

    await query(
      'INSERT INTO circle_members (circle_id, user_id, role) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING',
      [req.params.id, req.user.id, 'member']
    );
    res.json({ message: 'Vous avez rejoint le cercle' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/v1/circles/:id — Détail d'un cercle
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const result = await query(
      `SELECT c.*, u.name AS creator_name,
              json_agg(json_build_object('id', usr.id, 'name', usr.name, 'role', cm.role)) AS members
       FROM circles c
       JOIN users u ON u.id = c.creator_id
       LEFT JOIN circle_members cm ON cm.circle_id = c.id
       LEFT JOIN users usr ON usr.id = cm.user_id
       WHERE c.id = $1
       GROUP BY c.id, u.name`,
      [req.params.id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Cercle non trouvé' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
