import express from 'express';
import { query } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/v1/projects
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await query(
      `SELECT p.*, u.name AS creator_name,
              COUNT(DISTINCT pl.user_id) AS likes_count,
              bool_or(pl.user_id = $1) AS user_liked
       FROM projects p
       JOIN users u ON u.id = p.creator_id
       LEFT JOIN project_likes pl ON pl.project_id = p.id
       GROUP BY p.id, u.name
       ORDER BY likes_count DESC, p.created_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/v1/projects
router.post('/', authenticateToken, async (req, res) => {
  const { title, description, needed_skills, location } = req.body;
  if (!title || !description) {
    return res.status(400).json({ error: 'Titre et description requis' });
  }

  try {
    const result = await query(
      `INSERT INTO projects (title, description, needed_skills, location, creator_id)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [title, description, needed_skills, location, req.user.id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/v1/projects/:id/like
router.post('/:id/like', authenticateToken, async (req, res) => {
  try {
    const existing = await query(
      'SELECT id FROM project_likes WHERE project_id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );

    if (existing.rows.length > 0) {
      await query('DELETE FROM project_likes WHERE project_id = $1 AND user_id = $2', [
        req.params.id,
        req.user.id,
      ]);
      return res.json({ liked: false });
    }

    await query('INSERT INTO project_likes (project_id, user_id) VALUES ($1, $2)', [
      req.params.id,
      req.user.id,
    ]);
    res.json({ liked: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
