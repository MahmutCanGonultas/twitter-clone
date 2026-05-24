# Twitter Clone

Full-stack Twitter benzeri bir uygulama. Backend Node.js/Express, frontend React ile yazıldı. Temel sosyal medya işlevleri mevcut: tweet atma, beğenme, takip etme.

---

## Teknolojiler

**Backend**
- Node.js + Express
- PostgreSQL (`pg` kütüphanesi)
- JWT ile kimlik doğrulama
- bcrypt ile şifre hashleme

**Frontend**
- React 19 + Vite
- React Router v7
- TanStack Query (data fetching ve cache)
- Axios

---

## Özellikler

- Kayıt ve giriş (JWT tabanlı)
- Tweet oluşturma ve silme
- Tweet beğenme / beğeniyi geri alma
- Kullanıcı takip etme / takibi bırakma
- Profil sayfası (kullanıcının tweetleri)
- Responsive tasarım, dark mode desteği

---

## Kurulum

### Gereksinimler

- Node.js 18+
- PostgreSQL

### Veritabanı

PostgreSQL'de `twitter_clone` adında bir veritabanı oluşturup şu tabloları ekle:

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

`backend/.env` dosyası oluştur:

```
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=twitter_clone
DB_USER=postgres
DB_PASSWORD=sifren
JWT_SECRET=istedigin_bir_sey
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

Tarayıcıda `http://localhost:5173` aç.

---

## API Endpoints

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| POST | `/auth/register` | Kayıt ol |
| POST | `/auth/login` | Giriş yap |
| GET | `/auth/me` | Mevcut kullanıcı |
| GET | `/tweets` | Tüm tweetler |
| POST | `/tweets` | Tweet at |
| DELETE | `/tweets/:id` | Tweet sil |
| POST | `/likes/:tweetId` | Beğen |
| DELETE | `/likes/:tweetId` | Beğeniyi kaldır |
| POST | `/follows/:userId` | Takip et |
| DELETE | `/follows/:userId` | Takibi bırak |
| GET | `/users/:username` | Kullanıcı profili |
| GET | `/users/:username/tweets` | Kullanıcının tweetleri |

---

## Proje Yapısı

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
