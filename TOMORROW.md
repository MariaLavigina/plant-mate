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

---

## Ideas for Making This a Real, Professional Product 💡

These are additional ideas beyond the immediate plan above. Use this as a roadmap - not everything needs to happen at once.

---

### Auth improvements

**Use refresh tokens alongside access tokens.**
Right now the plan issues one JWT per login. Real apps issue two: a short-lived access token (15 min, stored in memory) and a long-lived refresh token (7-30 days, stored in an httpOnly cookie). This keeps users logged in across sessions without storing JWTs in localStorage, which is a security risk.

**Add input validation on the backend.**
Before any data touches PostgreSQL, validate it. Use `zod` (already in the frontend) server-side too, or use `joi`. Catches bad emails, empty passwords, SQL-injection attempts.

**Rate limiting on auth routes.**
Install `express-rate-limit`. One npm install, a few lines of code. Stops someone hammering `/login` thousands of times. Essential before going public.

**Email verification on register.**
When a user signs up, send them a verification email before their account is active. Use `Nodemailer` with a Gmail app password, or `Resend` (free tier, much easier to set up). This is also what powers the reset-password flow.

---

### New pages and features

**User profile page (`/profile`)**
A logged-in user's home. Show:
- their plant match result (save it to DB after the quiz completes)
- their current badge (bronze / silver / gold)
- quiz history (date taken, plant matched, score)
- a "Retake quiz" button

Requires one more DB table:
```sql
CREATE TABLE quiz_results (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  plant_id INTEGER NOT NULL,
  score INTEGER NOT NULL,
  taken_at TIMESTAMP DEFAULT NOW()
);
```

**"Save my match" button on results page**
A small button that appears only when the user is logged in. One API call: `POST /plants/save`. Shows up in their profile. Simple feature, makes the app feel personal and sticky.

**Plant browse / encyclopedia page (`/plants`)**
A page listing all plants with filter chips by trait (pet-safe, low light, dramatic, trailing, etc.). Pure frontend - no backend needed. Uses the existing `plants.json` data. Gives users something to explore beyond their quiz result, and is great for SEO if the site goes public.

**Shareable result card**
A "Share my match" button on the results page that generates a styled card the user can screenshot or share as a link (e.g. `/share/monstera-deliciosa?score=87`). People love sharing personality quiz results - this is the natural viral loop for this kind of app.

**Plant care log (the "real app" feature)**
Let users log when they watered, fertilised, or repotted a plant. Even a simple "I watered it today" button with a timestamp makes this a tool rather than just a quiz. Backend endpoints:
```
POST /care-log   { plant_id, action: "watered" | "fertilised" | "repotted", note? }
GET  /care-log/:userId  -> history list
```
A care history timeline in the profile would be genuinely useful and set this apart from every other "which plant are you" quiz online.

---

### Small UX improvements worth doing soon

- **Progress bar on the quiz** - the "Question 3 of 9" text is fine, but a visual bar would feel much more polished
- **Back button on the quiz** - users should be able to change their answer on the previous question
- **Wire up the contact form** - use Nodemailer or a service like Formspree (free) so messages actually arrive
- **Error state on results page** - if `localStorage` is empty or malformed, currently the page crashes silently; redirect gracefully

---

### Longer-term ideas (pick and choose)

| Idea | Effort | Why it matters |
|---|---|---|
| Google / GitHub OAuth login | Medium | Removes the friction of creating an account |
| "X other people got this plant" counter | Low | Makes results feel social and real |
| Browser push notifications for watering reminders | Medium | Genuinely useful, very sticky |
| Plant of the week (rotating feature) | Low | Gives users a reason to come back |
| Admin dashboard (user count, badge stats) | Medium | Lets you see how the app is being used |
| Open Graph image for result sharing | Medium | Makes shared links look great on social media |

---

### Database - full schema to aim for

```sql
-- already planned
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

-- new additions
CREATE TABLE quiz_results (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  plant_id INTEGER NOT NULL,
  score INTEGER NOT NULL,
  taken_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE saved_plants (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  plant_id INTEGER NOT NULL,
  saved_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, plant_id)
);

CREATE TABLE care_log (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  plant_id INTEGER NOT NULL,
  action VARCHAR(20) NOT NULL,
  note TEXT,
  logged_at TIMESTAMP DEFAULT NOW()
);
```

---

### The natural user journey to build toward

```
Take quiz
  -> Get personalised result
    -> Create account to save it
      -> Come back -> see your history
        -> Play the badge quiz -> earn badges
          -> Log your plant care
            -> Share your match
```

Every feature above is a step in that journey. Build the journey end-to-end before adding anything off the path.
