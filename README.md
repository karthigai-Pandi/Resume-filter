# Resume Filter Demo

A full-stack demo for hiring officers to filter resumes against a job description.

## Architecture

- `backend/` — Node.js + Express API
- `frontend/` — React + Vite UI

## Run locally

### Option 1 — From the root folder

```powershell
cd "c:\Users\USER'\Desktop\Resume filter"
npm install-all
```

Then run both servers together:

```powershell
npm start
```

Or, if you want separate windows, use:

```powershell
npm run start-backend
```

and

```powershell
npm run start-frontend
```

### Option 2 — From each subfolder

```powershell
cd "c:\Users\USER'\Desktop\Resume filter\backend"
npm install
npm start
```

In another window:

```powershell
cd "c:\Users\USER'\Desktop\Resume filter\frontend"
npm install
npm run dev
```

5. Open the app

- Frontend: `http://localhost:3000`
- Backend health check: `http://localhost:3001/api/health`

## How it works

- Paste your job description into the text area.
- Upload one or more plain `.txt` resume files.
- Click **Run Filter** to score candidates.
- The backend calculates a match score, grade, verdict, strengths, gaps, salary estimate, and red flags.

## Notes

- This demo uses text-based resume matching for a fast local prototype.
- You can extend the backend to add PDF or DOCX parsing and AI ranking later.
