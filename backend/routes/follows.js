const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middleware/auth');

router.post('/:userId', authMiddleware, async (req, res) => {
  try {
    const followerId = req.user.id;
    const followingId = parseInt(req.params.userId);

    if (followerId === followingId) {
      return res.status(400).json({ error: 'You cannot follow yourself' });
    }

    const result = await pool.query(
      'INSERT INTO follows (follower_id, following_id) VALUES ($1, $2) RETURNING *',
      [followerId, followingId],
    );
    res.status(201).json({ follow: result.rows[0] });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ error: 'Already following' });
    }
    if (err.code === '23503') {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:userId', authMiddleware, async (req, res) => {
  try {
    const followerId = req.user.id;
    const followingId = parseInt(req.params.userId);

    const result = await pool.query(
      'DELETE FROM follows WHERE follower_id = $1 AND following_id = $2 RETURNING *',
      [followerId, followingId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Not following this user' });
    }

    res.json({ message: 'Unfollowed', follow: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
