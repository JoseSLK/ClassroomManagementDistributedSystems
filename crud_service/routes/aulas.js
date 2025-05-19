import express from 'express';
import db from '../db.js';

const router = express.Router();

// GET /aulas -> lista todas las aulas
router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM aulas');
        res.json(result.rows);
    } catch (err) {
        console.error('Error al consultar aulas:', err);
        res.status(500).json({ error: 'Error al consultar aulas' });
    }
});

export default router;
