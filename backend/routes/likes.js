const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middleware/auth');

router.post('/:tweetId', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const tweetId = parseInt(req.params.tweetId);

    const result = await pool.query(
      'INSERT INTO likes (user_id, tweet_id) VALUES ($1, $2) RETURNING *',
      [userId, tweetId],
    );

    res.status(201).json({ like: result.rows[0] });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ error: 'Already liked' });
    }
    if (err.code === '23503') {
      return res.status(404).json({ error: 'Tweet not found' });
    }
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:tweetId', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const tweetId = parseInt(req.params.tweetId);

    const result = await pool.query(
      'DELETE FROM likes WHERE user_id = $1 AND tweet_id = $2 RETURNING *',
      [userId, tweetId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Not liked' });
    }

    res.json({ message: 'Unliked', like: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
