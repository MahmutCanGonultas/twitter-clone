require('dotenv').config();

const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();

app.use(cors());
app.use(express.json());
const authRoutes = require('./routes/auth');
const tweetRoutes = require('./routes/tweets');

app.use('/auth', authRoutes);
app.use('/tweets', tweetRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Server is runnig' });
});

app.get('/db-test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ time: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
