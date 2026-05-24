# Twitter Clone

A full-stack Twitter-like app built with Node.js/Express on the backend and React on the frontend. Covers the core social features: posting tweets, liking, and following other users.

---

## Stack

**Backend**
- Node.js + Express
- PostgreSQL (`pg`)
- JWT authentication
- bcrypt for password hashing

**Frontend**
- React 19 + Vite
- React Router v7
- TanStack Query (data fetching & caching)
- Axios

---

## Features

- Register and login (JWT-based sessions)
- Post and delete tweets
- Like / unlike tweets
- Follow / unfollow users
- Profile pages with user's tweet history
- Responsive layout with dark mode support

---

## Setup

### Requirements

- Node.js 18+
- PostgreSQL

### Database

Create a database called `twitter_clone` and run the following:

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  password TEXT NOT NULL
);

CREATE TABLE tweets (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE follows (
  follower_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  following_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  PRIMARY KEY (follower_id, following_id)
);

CREATE TABLE likes (
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  tweet_id INTEGER REFERENCES tweets(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, tweet_id)
);
```

### Backend

```bash
cd backend
npm install
```

Create a `backend/.env` file:

```
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=twitter_clone
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=whatever_you_want
```

```bash
node index.js
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Create account |
| POST | `/auth/login` | Login |
| GET | `/auth/me` | Current user info |
| GET | `/tweets` | Get all tweets |
| POST | `/tweets` | Post a tweet |
| DELETE | `/tweets/:id` | Delete a tweet |
| POST | `/likes/:tweetId` | Like a tweet |
| DELETE | `/likes/:tweetId` | Unlike a tweet |
| POST | `/follows/:userId` | Follow a user |
| DELETE | `/follows/:userId` | Unfollow a user |
| GET | `/users/:username` | Get user profile |
| GET | `/users/:username/tweets` | Get user's tweets |

---

## Project Structure

```
twitter-project/
├── backend/
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── tweets.js
│   │   ├── follows.js
│   │   ├── likes.js
│   │   └── users.js
│   ├── db.js
│   └── index.js
└── frontend/
    └── src/
        ├── api/
        ├── components/
        ├── contexts/
        └── pages/
```
