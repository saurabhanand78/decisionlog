# DecisionLog

Personal decision journal and outcome tracker. Make decisions. Track outcomes. Learn from experience.

Frontend only: React + Vite + Tailwind CSS + Recharts + lucide-react. Data lives in browser `localStorage`.

## Run locally

```powershell
npm install
npm run dev
```

Open http://localhost:5173. Use `npm run build` for a production build.

## Structure

- `src/lib/logic.js`: constants, date helpers, status and dashboard calculations
- `src/lib/sampleData.js`: sample decisions with dates relative to today
- `src/lib/useDecisions.js`: the only file that touches localStorage (swap this for an API later)
- `src/components/`: Dashboard, Journal, DecisionForm, DecisionDetail (with review form), Settings, shared UI
