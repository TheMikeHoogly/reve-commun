import express from 'express';
import { query } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/v1/values — Liste de toutes les valeurs disponibles
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await query('SELECT * FROM values_list ORDER BY category, name');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
