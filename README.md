# PlantMate+

A personality-driven plant matching app. Answer a short quiz and get matched with the plant that
actually fits your lifestyle, light conditions, and personality.

## What it does

- **Plant match quiz** - scores every plant against your answers and shows your top 3 matches with
  a personalised explanation of why each one fits you
- **Plant detail panel** - tap any plant to see traits, care info, and personality notes
- **Play & Win** - a badge quiz that awards Bronze, Silver, or Gold based on your plant knowledge
- **Accounts** - save your match, track quiz history, and earn badges (backend in progress)

## Running locally

```bash
npm install
npm run dev      # localhost:3000
npm run build    # production build
npm run lint     # ESLint
```

The quiz and results page work without a backend. Auth and badge saving require the Express API
running on `localhost:5000`.

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19, TypeScript |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion |
| Database | PostgreSQL 17.9 (in progress) |
| Backend | Node.js + Express + bcrypt + JWT (in progress) |

## Project structure

```
app/            Pages (home, quiz, results, about, contact)
components/     Shared UI components
data/           Static JSON - plants, traits, quiz questions
lib/            Style helpers and constants
public/images/  Plant images and SVG assets
```

See `TOMORROW.md` for the full roadmap.
See `ABOUT_THE_CREATOR.md` for background on the project and its creator.
