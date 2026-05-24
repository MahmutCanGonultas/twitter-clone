const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middleware/auth');

router.get('/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const result = await pool.query(
      'SELECT id, username FROM users WHERE username = $1',
      [username],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:username/tweets', async (req, res) => {
  try {
    const { username } = req.params;
    const result = await pool.query(
      `SELECT t.id, t.content, t.created_at, t.user_id, u.username,
         COUNT(l.tweet_id)::INTEGER AS like_count,
         false AS is_liked
       FROM tweets t
       JOIN users u ON t.user_id = u.id
       LEFT JOIN likes l ON l.tweet_id = t.id
       WHERE u.username = $1
       GROUP BY t.id, t.user_id, u.username
       ORDER BY t.created_at DESC`,
      [username],
    );
    res.json({ tweets: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:userId/follow-status', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query(
      'SELECT 1 FROM follows WHERE follower_id = $1 AND following_id = $2',
      [req.user.id, userId],
    );
    res.json({ isFollowing: result.rows.length > 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
