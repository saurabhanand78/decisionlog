# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```powershell
npm install
npm run dev       # Vite dev server at http://localhost:5173
npm run build     # production build to dist/ (the only automated check; there is no lint or test setup)
npm run preview   # serve the built dist/
```

`.claude/launch.json` defines a `decisionlog` config for starting the dev server from the Claude desktop app's preview pane.

## What this is

DecisionLog is a frontend-only decision journal and outcome tracker: React 18, Vite, Tailwind CSS v3, Recharts, lucide-react. By design there is no backend, database, auth, API keys or AI integration. Keep it that way unless asked.

## Architecture

- **State lives in one hook.** `src/lib/useDecisions.js` is the only code that touches localStorage (key `decisionlog.decisions.v1`). It loads on first render, seeds sample data if storage is empty or corrupt, and writes back in a `useEffect` on every change. `App.jsx` calls it once and passes data and callbacks down as props. There is no context or store. To add a backend later, replace this hook.
- **Routing is state, not a router.** `App.jsx` holds `view = { name, id }` and switches screens with `navigate(name, id)`. Names are `dashboard`, `journal`, `form` (with an `id` it edits, without it creates), `detail` and `settings`. There are no URLs, and Back does not step through screens. Detail pages highlight the Journal nav item.
- **Derived data is never stored.** `src/lib/logic.js` holds the pure helpers. `getStatus(decision)` computes Awaiting Review, Review Due or Reviewed from `review` and `reviewDate` versus today. `computeStats(decisions)` produces every KPI and chart dataset. Do not add a stored `status` field. Positive Outcome Rate is `null` (not 0) when nothing is reviewed, and the UI shows an empty state for it.
- **Decision shape:** `{ id, title, category, decisionDate, description, reason, expectedOutcome, confidence, reviewDate, createdAt, review }`, where `review` is `null` or `{ actualOutcome, rating, lessons, again, reviewedOn }`. Dates are local-time `YYYY-MM-DD` strings. Use the `logic.js` helpers (`todayISO`, `offsetDate`, `parseISO`) instead of `new Date("YYYY-MM-DD")`, which parses as UTC and shifts the day.
- **Sample data is relative to today.** `src/lib/sampleData.js` builds decisions with `offsetDate(...)`, so overdue and upcoming reviews stay meaningful whenever the app is opened. Reset Demo Data re-runs it.
- **Shared UI** (badges, `ConfirmModal`, `Toast`, `EmptyState`, category and rating colors) is in `src/components/ui.jsx`. Reusable Tailwind classes (`.card`, `.btn-*`, `.input`, `.label`) are in `src/index.css`.

## Gotchas

- Keep the `.fade-up` animation on `animation-fill-mode: backwards`. A lingering transform from `both` makes the wrapper the containing block for `position: fixed` and breaks modal positioning.
- Tailwind's `sr-only` is absolutely positioned. Inside the journal table it needs a `relative` ancestor or it causes horizontal page scroll.
- Recharts hides overlapping axis ticks, so the category bar chart sets `interval={0}`.
