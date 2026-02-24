import express from 'express';
import { query } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

const PACT_TEXT = `Je choisis de privilégier la joie comme boussole dans mes choix.
Je reconnais que la réalité est une fiction collective que nous pouvons choisir consciemment.
Je m'engage à respecter les visions du monde des autres, même différentes de la mienne.
Je choisis de chercher ce qui nous unit plutôt que ce qui nous sépare.
Je m'engage à contribuer à un monde où chacun peut incarner sa version la plus joyeuse de lui-même.
"Et si le but du jeu était simplement de jouer avec joie ?"`;

// GET /api/v1/pact — Obtenir le texte du pacte + statut de signature
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM pact_signatures WHERE user_id = $1',
      [req.user.id]
    );
    const countResult = await query('SELECT COUNT(*) FROM pact_signatures');

    res.json({
      text: PACT_TEXT,
      signed: result.rows.length > 0,
      signed_at: result.rows[0]?.signed_at || null,
      total_signatories: parseInt(countResult.rows[0].count),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/v1/pact/sign — Signer le pacte
router.post('/sign', authenticateToken, async (req, res) => {
  try {
    await query(
      'INSERT INTO pact_signatures (user_id) VALUES ($1) ON CONFLICT (user_id) DO NOTHING',
      [req.user.id]
    );
    res.json({ message: 'Pacte signé avec joie !', signed: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/v1/pact/signatories — Liste des signataires
router.get('/signatories', authenticateToken, async (req, res) => {
  try {
    const result = await query(
      `SELECT u.id, u.name, u.location, ps.signed_at
       FROM pact_signatures ps
       JOIN users u ON u.id = ps.user_id
       ORDER BY ps.signed_at DESC
       LIMIT 50`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
