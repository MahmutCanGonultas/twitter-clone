const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
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
    let currentUserId = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        currentUserId = decoded.id;
      } catch {
        // invalid token, treat as unauthenticated
      }
    }

    const query = currentUserId
      ? `SELECT t.id, t.content, t.created_at, t.user_id, u.username,
           COUNT(l.tweet_id)::INTEGER AS like_count,
           EXISTS(SELECT 1 FROM likes WHERE user_id = $1 AND tweet_id = t.id) AS is_liked
         FROM tweets t
         JOIN users u ON t.user_id = u.id
         LEFT JOIN likes l ON l.tweet_id = t.id
         GROUP BY t.id, t.user_id, u.username
         ORDER BY t.created_at DESC`
      : `SELECT t.id, t.content, t.created_at, t.user_id, u.username,
           COUNT(l.tweet_id)::INTEGER AS like_count,
           false AS is_liked
         FROM tweets t
         JOIN users u ON t.user_id = u.id
         LEFT JOIN likes l ON l.tweet_id = t.id
         GROUP BY t.id, t.user_id, u.username
         ORDER BY t.created_at DESC`;

    const result = await pool.query(query, currentUserId ? [currentUserId] : []);
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
