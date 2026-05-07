# Plant Mate — Progress Summary & Tomorrow's Plan

## What's Done ✅

### UI — Results Page (`app/results/page.tsx`)
- Full 3-column layout: **Plant Match text | Plant image | Play & Win card**
- Plant image is responsive (mobile: height-first `h-[60vh]`, desktop: `h-[calc(100vh-280px)]`) — no cropping
- Desktop page does NOT scroll vertically (`lg:h-[calc(100vh-80px)] lg:overflow-hidden`)
- Frosted glass "stage" wraps the plant text + image together (elegant, subtle)
- "Why this plant fits you" section — personalised text based on quiz answers
- Play & Win card: dark background, 3 badge images (Bronze / Silver / Gold), "Play & Grow" button
- On desktop dark mode: Play & Win card is fully transparent (blends into gradient)
- On mobile: Play & Win card slightly overlaps the plant image (`-mt-16`)
- Auth modal wired up to "Play & Grow" button (register flow)

### Other
- `CLAUDE.md` and `.env.local` added to `.gitignore` so they never get committed
- `InteractivePlantImage` updated with `imageClassName` prop for flexible image sizing

---

## What Still Needs to Be Done 🔜

### 1. Backend — Express API (separate project, not in this repo)
Endpoints needed:
- `POST /register` — create user (name, email, password hash)
- `POST /login` — verify password, return JWT
- `POST /reset-password` — send reset email or update password
- `POST /play/submit` — save quiz score + award badge
- `GET /play/badge/:userId` — return user's current badge

Stack: **Node.js + Express + bcrypt + JWT + PostgreSQL**

### 2. Play & Win Page (`app/play/page.tsx`)
- 10 random questions pulled from `data/play-and-win.json` (50 questions total)
- Multiple choice, one at a time or all at once
- Scoring logic: Bronze / Silver / Gold threshold
- Show earned badge at the end
- Save badge to backend if user is logged in

### 3. Swagger UI on the backend
- Add `swagger-ui-express` so the API is self-documented and easy to test

---

## Database — What to Do in the Morning 🗄️

### Step 1 — ✅ PostgreSQL 17.9 already installed on this machine

### Step 2 — Create the database
Open **pgAdmin** or the **psql** terminal and run:
```sql
CREATE DATABASE plant_mate;
```

### Step 3 — Create tables
Run this in the `plant_mate` database:

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  badge VARCHAR(10) DEFAULT NULL,  -- 'bronze', 'silver', 'gold'
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE play_scores (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  badge_earned VARCHAR(10),
  played_at TIMESTAMP DEFAULT NOW()
);
```

### Step 4 — Create the backend project (Node/Express)
In a **new folder** (e.g. `plant-mate-api`), run:
```bash
npm init -y
npm install express pg bcrypt jsonwebtoken cors dotenv
npm install --save-dev nodemon
```

Create a `.env` file:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=plant_mate
DB_USER=postgres
DB_PASSWORD=your_password_here
JWT_SECRET=some_long_random_string
PORT=5000
```

---

## Files to Know About
| File | Purpose |
|------|---------|
| `app/results/page.tsx` | Results page — fully redesigned this session |
| `components/InteractivePlantImage.jsx` | Plant image with clickable hotspots |
| `data/play-and-win.json` | 50 questions for the Play & Win game (exists but page not built yet) |
| `data/plants.json` | Plant data with traits and hotspots |
| `data/quiz_questions.json` | Quiz questions that map to trait IDs |
| `lib/styles.ts` | Shared dark/light mode style helpers |

---

## Quick Reminder — Tomorrow's Priority Order
1. Install PostgreSQL + create `plant_mate` database + tables
2. Scaffold the Express backend in a new folder
3. Build `/register`, `/login`, `/reset-password` endpoints
4. Build `app/play/page.tsx` — the Play & Win game page
5. (Optional) Add Swagger UI to the backend

Good night! 🌱
