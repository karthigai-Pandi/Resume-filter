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

## Deploy

This project has two deployable parts:

- `backend/` is the Node.js Express API.
- `frontend/` is the React/Vite static site.

### 1. Push the project to GitHub

Commit your code and push it to a GitHub repository. Most hosting platforms can deploy directly from GitHub.

### 2. Deploy the backend

Use a Node hosting service such as Render, Railway, or any VPS.

Recommended settings:

```text
Root directory: backend
Build command: npm install
Start command: npm start
Environment variable: PORT is provided by the host
```

After deployment, test:

```text
https://your-backend-url/api/health
```

It should return:

```json
{ "status": "ok", "version": "1.0.0" }
```

### 3. Deploy the frontend

Use a static hosting service such as Vercel, Netlify, or Cloudflare Pages.

Recommended settings:

```text
Root directory: frontend
Build command: npm run build
Output directory: dist
```

Add this environment variable in the frontend host:

```text
VITE_API_BASE_URL=https://your-backend-url
```

Do not include `/api/filter` in the value. The app adds the API path itself.

### 4. Redeploy frontend after setting the API URL

Vite reads `VITE_API_BASE_URL` during build, so redeploy the frontend after adding or changing that variable.
