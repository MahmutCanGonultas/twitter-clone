const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.user.id;

    const result = await pool.query(
      'INSERT INTO tweets (user_id, content) VALUES ($1, $2) RETURNING *',
      [userId, content],
    );

    res.status(201).json({ tweet: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM tweets ORDER BY created_at DESC',
    );
    res.json({ tweets: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const tweetId = req.params.id;
    const userId = req.user.id;

    const result = await pool.query(
      'DELETE FROM tweets WHERE id = $1 AND user_id = $2 RETURNING *',
      [tweetId, userId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tweet not found or not yours' });
    }

    res.json({ message: 'Tweet deleted', tweet: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
