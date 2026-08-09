# Deploy to Vercel

Recommended: use Vercel for instant hosting and easy mobile access.

1. Create a Vercel account at https://vercel.com and connect your GitHub account.
2. From Vercel dashboard, click "New Project" → import your GitHub repository.
3. Set build settings (Vercel usually detects Next.js app automatically):
   - Framework: Next.js
   - Build Command: `pnpm build` or `npm run build`
   - Output Directory: (leave empty for App Router)
4. Set Environment Variables in Vercel Dashboard → Environment Variables:
   - `DATABASE_URL` (if you use a DB)
   - `BETTER_AUTH_SECRET`
   - `NEXT_PUBLIC_APP_URL` (set to your production URL)

5. Deploy. Vercel will build and provide a public URL you can open from your phone/iPad.

Notes:
- If your project uses Postgres or Prisma in production, configure a managed DB (e.g., Supabase, Neon, PlanetScale) and set `DATABASE_URL` accordingly.
- If you removed AI features, you don't need `GEMINI_API_KEY`. If you add AI back, set it in Vercel as well.
- For environment-specific secrets do NOT commit them into git.

Troubleshooting:
- If build fails due to package manager differences, try switching to npm/yarn in Vercel project settings.
- Missing `.env.local` values will cause server-side errors; ensure required env vars are set.
