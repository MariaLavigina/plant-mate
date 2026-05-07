# Plant Mate 🌿

A fun, interactive web app that helps you find your perfect houseplant match — and rewards you for learning about plants.

## What it does

**Plant Match Quiz** — Answer a few questions about your lifestyle (light levels, how often you water, pets at home, etc.) and Plant Mate scores every plant in its database to find your best match. The results page shows your matched plant with an interactive image you can tap to explore facts about different parts of the plant.

**Play & Win** — A 10-question trivia game drawn from a bank of 50 plant questions. Score enough points to earn a Bronze, Silver, or Gold badge. A free account keeps your badge and tracks your progress over time.

## Tech stack

- **Frontend:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4
- **Backend:** Node.js, Express, PostgreSQL 17.9 *(in progress)*
- **Auth:** JWT + bcrypt

## Running locally

```bash
# Install dependencies (only needed once when you first set up the project)
npm install

# Start the development server — open http://localhost:3000 to see the app
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The app runs without a backend — the quiz and results page are fully client-side. Auth and badge saving require the Express API running on port `5000`.

## Project structure

```
app/            Next.js pages (quiz, results, play, about)
components/     Shared UI components (Navbar, AuthModal, InteractivePlantImage, …)
data/           Static JSON — plants, traits, quiz questions, play-and-win questions
lib/            Shared utilities and style helpers
public/images/  Plant images and badge SVGs
```
