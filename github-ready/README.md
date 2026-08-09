# finance-tracker — GitHub-ready package

This folder packages instructions and helper scripts so you can push the current project to GitHub and deploy it to Vercel quickly from your phone/iPad.

## What is included

- `.gitignore` — sensible ignores for Node/Next.js
- `prepare_repo.sh` — Bash script to init git, add remote placeholder and push
- `prepare_repo.ps1` — PowerShell alternative for Windows
- `vercel-deploy.md` — short Vercel setup instructions

## Quick steps to publish to GitHub (desktop or terminal on device)

1. From the project root (the folder that contains this `github-ready` folder), open a terminal.

2. Ensure files are present and install dependencies:

- Using pnpm (recommended):
```bash
pnpm install
pnpm run dev
```

- Or using npm:
```bash
npm install
npm run dev
```

3. Create a new GitHub repository (on github.com) and copy the remote URL.

4. Initialize git and push (replace `<REMOTE_URL>`):

- Bash / macOS / Linux / Termux:
```bash
./github-ready/prepare_repo.sh <REMOTE_URL>
```

- Windows PowerShell:
```powershell
.\github-ready\prepare_repo.ps1 -RemoteUrl "<REMOTE_URL>"
```

5. After push, go to GitHub to confirm the repository.

## Environment variables (create `.env.local` in project root)

At minimum, create `.env.local` with these entries (example values):

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/finance_tracker?schema=public"
BETTER_AUTH_SECRET="replace-with-a-random-secret"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

If you don't use a database locally, some pages still run with demo store, but features requiring Prisma will need a DB.

## Deploy to Vercel (recommended for mobile access)
See `vercel-deploy.md` for step-by-step instructions.

---

If you want, I can also:
- Create a GitHub Actions workflow for CI
- Prepare a one-click Deploy to Vercel button (needs Vercel project settings)
- Zip the project folder for direct download

Tell me which you'd like next.