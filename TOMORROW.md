# Plant Mate — Progress & Next Steps

---

## What's Done ✅

### Frontend
- Results page — full 3-column layout, plant image, Play & Win card, auth modal wired up
- Play & Win quiz page (`app/quiz/badge/page.tsx`) — countdown, 2x2 grid, flower progress bar, badge result
- `InteractivePlantImage` — clickable hotspots, mobile/desktop popups

### Backend (`plant-mate-api` — separate repo)
- Express server running on port 5000
- PostgreSQL database `plant_mate` with `users` and `play_scores` tables
- All endpoints built and working:
  - `POST /register` — create account
  - `POST /login` — sign in, return JWT
  - `POST /reset-password` — change password by email
  - `POST /play/submit` — save score, award badge (protected)
  - `GET /play/badge/:userId` — get user's best badge (protected)
- Swagger UI docs at `http://localhost:5000/docs`
- README in the API repo

---

## What's Next 🔜

### 1. Wire up the frontend to the backend
The backend exists but the frontend doesn't talk to it yet.

- **Auth modal** (`components/AuthModal.jsx`) — it already calls `http://localhost:5000` but needs testing end-to-end: register a real user, log in, get a token, store it in localStorage
- **Play & Win quiz** — when a player finishes, call `POST /play/submit` with their score if they're logged in. Show the badge they earned from the API response
- **Results page** — after quiz completes, save the plant match to the backend (optional but makes the profile page possible)

### 2. User profile page (`/profile`)
A page only logged-in users can see. Show:
- Their plant match
- Their best badge
- Quiz history

Needs a new DB table when ready:
```sql
CREATE TABLE quiz_results (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  plant_id INTEGER NOT NULL,
  taken_at TIMESTAMP DEFAULT NOW()
);
```

### 3. Dev vs Production environments (future)
Right now everything runs locally with one `.env`. When deploying to real users:
- **Dev** - local database, test data, you can break things freely
- **Production** - real server (Railway / Render / Supabase), real users, never touch directly

Steps when ready:
1. Deploy the Express API to Railway or Render (free tier)
2. Create a hosted PostgreSQL database (Railway includes one, or use Supabase)
3. Add a `.env.production` pointing to the real database
4. The frontend uses `NEXT_PUBLIC_API_URL` env var to switch between local and prod API

---

## Professional Backend — What to Learn & Build 📚

This is the roadmap for making the backend production-quality. Good to understand even if not all of it gets built right now.

### Security essentials (do these before going public)

**Input validation**
Every endpoint should validate what comes in before touching the database. Right now if someone sends a blank email or a 1-character password it still tries to insert. Use `zod` or `joi`:
```js
// example with zod
const schema = z.object({ email: z.string().email(), password: z.string().min(8) });
schema.parse(req.body); // throws if invalid
```

**Rate limiting**
Stops someone from hammering `/login` thousands of times to guess passwords. One package, 5 lines of code:
```bash
npm install express-rate-limit
```
```js
const rateLimit = require("express-rate-limit");
app.use("/login", rateLimit({ windowMs: 15 * 60 * 1000, max: 10 }));
```

**Refresh tokens (proper JWT auth)**
Right now we issue one JWT that lasts 7 days in localStorage. Real apps use two tokens:
- Access token — lasts 15 min, stored in memory (not localStorage)
- Refresh token — lasts 30 days, stored in an httpOnly cookie (JS can't touch it)

When the access token expires, the frontend silently gets a new one using the refresh token. Much safer.

**Email verification on register**
When a user signs up, send them a verification email before their account is active. Use `Resend` (free tier, very easy) or `Nodemailer`. This is also what powers proper password reset (send a reset link, not just change by email).

**HTTPS**
When deployed, always use HTTPS. Railway and Render handle this automatically - no extra work needed.

---

### Database concepts to understand (important for your company work)

**Migrations**
Right now the tables were created manually in pgAdmin. In professional projects, every database change is written as a migration file - a numbered SQL script that gets applied in order. Tools: `node-postgres-migrate` or `db-migrate`. Means the whole team always has the same database structure.

**Indexes**
When you query by email in the users table (`WHERE email = $1`), Postgres scans every row. An index makes it instant:
```sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_play_scores_user_id ON play_scores(user_id);
```
Important once the table has thousands of rows.

**Foreign keys (what we already have)**
`play_scores.user_id REFERENCES users(id)` means Postgres enforces the relationship - you can't have a score without a valid user. `ON DELETE CASCADE` means if a user is deleted, their scores are deleted too automatically.

**Transactions**
When two things must happen together or not at all, use a transaction:
```js
await pool.query("BEGIN");
try {
  await pool.query("INSERT INTO play_scores ...");
  await pool.query("UPDATE users SET badge ...");
  await pool.query("COMMIT");
} catch {
  await pool.query("ROLLBACK"); // undo everything if either fails
}
```
The `/play/submit` endpoint should use this - right now if the badge update fails after the score saves, the data is inconsistent.

**Environment separation (dev/prod databases)**
Professional teams always have at least two databases: one for development (fake data, can reset anytime) and one for production (real users, never delete, always back up). Same code, different `.env`.

---

## Full Database Schema to Aim For

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  email_verified BOOLEAN DEFAULT FALSE,
  badge VARCHAR(10) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE play_scores (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  badge_earned VARCHAR(10),
  played_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE quiz_results (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  plant_id INTEGER NOT NULL,
  taken_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE saved_plants (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  plant_id INTEGER NOT NULL,
  saved_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, plant_id)
);
```

---

## Feature Ideas (longer term)

| Feature | Why it matters |
|---|---|
| User profile page (`/profile`) | Shows match, badge, history - makes app feel personal |
| "Save my match" button | One call, stores plant result - makes profile possible |
| Plant browse page (`/plants`) | Pure frontend, great for SEO, no backend needed |
| Google / GitHub OAuth login | Removes friction of creating an account |
| Email verification + proper reset | Required before going public |
| Watering / care log | Turns it from a quiz into a real tool |
| Shareable result card | Natural viral loop for this kind of app |
| Admin dashboard | See user count, badge stats, how the app is being used |

---

## The User Journey to Build Toward

```
Take quiz
  -> Get personalised plant match
    -> Create account to save it
      -> Come back -> see history in profile
        -> Play badge quiz -> earn badges
          -> Log plant care
            -> Share your match
```

Build the journey end-to-end before adding anything off this path.
