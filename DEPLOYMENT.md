# Experiment 3: Deploy the Travel Booking Application

WanderMoon is deployed three ways from the same code: GitHub Pages, Netlify and Vercel.

## Why the code changed

All three platforms host static files only. Before this experiment the REST API lived inside the Vite dev server, so a deployed site would have had no `/api`. Now:

- `server/mockApi.js` exposes one plain function, `handleRequest()`. The dev server still uses it.
- `src/api/browserApi.js` plugs the same function into Axios in the production build, so the API runs inside the browser.
- Result: one build works on all three platforms, and nothing needs a backend.
- Bookings and accounts live in memory, so a page refresh clears them (you log in again with the demo account).

Other changes: `basename` for the router and base-aware paths in the service worker and manifest (needed for GitHub Pages sub-folders), `scripts/copy-404.js`, `netlify.toml`, `vercel.json`, `.github/workflows/deploy.yml`, Privacy and Terms pages.

## a) Production build

```
npm install
npm run build
npm run preview
```

- `npm run build` writes the site to `dist/` (split chunks, hashed file names, plus `dist/404.html`).
- `npm run preview` serves `dist/` locally, usually at http://localhost:4173. Check here before deploying.
- Optional: `npm test` runs the Jest tests, including `src/__tests__/Deploy.test.js` for search and booking.

## Put the project on GitHub first (needed for all three)

```
git init
git add .
git commit -m "WanderMoon deploy"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

`.gitignore` already skips `node_modules` and `dist`.

## b) GitHub Pages

1. Push the project to `main`. The workflow in `.github/workflows/deploy.yml` is included.
2. On GitHub open **Settings > Pages**, and under **Build and deployment > Source** choose **GitHub Actions**.
3. Open the **Actions** tab and wait for "Deploy to GitHub Pages" to turn green (push again or use **Run workflow** if it ran before step 2).
4. Your site: `https://<your-username>.github.io/<repo-name>/`

The workflow builds with `--base=/<repo-name>/` because project sites live in a sub-folder. If your repository is named `<your-username>.github.io`, change that part of the workflow to `--base=/`.

## c) Netlify

1. Sign in at netlify.com with GitHub, then **Add new site > Import an existing project**.
2. Pick the repository. Build command `npm run build` and publish directory `dist` are filled in from `netlify.toml`.
3. Click **Deploy**. Your site: `https://<random-name>.netlify.app` (rename it under **Site configuration > Change site name**).

Without Git: run `npm run build`, then drag the `dist` folder onto the Netlify "Deploys" page.

## d) Vercel

1. Sign in at vercel.com with GitHub, then **Add New > Project** and import the repository.
2. Vercel detects Vite and reads `vercel.json`. Leave the settings as they are and click **Deploy**.
3. Your site: `https://<project-name>.vercel.app`

CLI alternative: `npm i -g vercel`, then `vercel` and `vercel --prod` inside the project folder.

Pushing to `main` redeploys all three automatically.

## e) Verify package search and booking features

Do this on each of the three URLs. Tick every line.

| # | Step | Expected |
|---|------|----------|
| 1 | Open the site URL | Home page loads, no blank screen |
| 2 | Open `/packages` directly or refresh on it | Login page (not a platform 404), because Packages needs login |
| 3 | Log in with `demo@wandermoon.com` / `demo123` | Header shows "Hi, Demo" |
| 4 | Open Packages | Six packages load after a short loader |
| 5 | Search destination "goa" | Only Goa Beach Getaway remains |
| 6 | Search "xyz" | Empty result, no crash |
| 7 | Use the type, budget, duration and rating filters | List narrows each time |
| 8 | Open a package | Details, travel info and departures with seats left |
| 9 | Go through Booking: dates, travelers, summary, payment | Seat check works; total shows 10% discount for 4+ travelers and 5% tax |
| 10 | Confirm the booking | Booking appears in My Bookings |
| 11 | Edit traveler details, then Cancel Booking | Details update, then booking disappears |
| 12 | Log out | Booking pages redirect to Login |
| 13 | Open `/privacy` and `/terms` | Both pages load |
| 14 | Open DevTools > Application | Service worker active, manifest found |

Record the three URLs and a pass or fail for each row for your lab report.

## f) Compare the deployment platforms

| | GitHub Pages | Netlify | Vercel |
|---|---|---|---|
| Setup | Workflow file plus a Pages setting | Import repo, nearly zero config | Import repo, nearly zero config |
| Build | GitHub Actions (you write the workflow) | Netlify servers | Vercel servers |
| URL | `user.github.io/repo/` (sub-folder) | `name.netlify.app` | `name.vercel.app` |
| Base path needed | Yes (`--base`) | No | No |
| SPA routing | 404.html trick | `/*` redirect rule | `rewrites` rule |
| Custom security headers | Not supported | `netlify.toml` | `vercel.json` |
| Backend options | None (static only) | Functions, forms | Serverless functions |
| Preview per pull request | No | Yes | Yes |
| Free plan | Free for public repos | Free tier | Free tier (non-commercial use) |
| Custom domain and HTTPS | Yes | Yes | Yes |
| Rollback | Re-run an old workflow | One click on an old deploy | One click on an old deploy |

Limits and prices change, so check each pricing page before relying on them.

**Summary:** GitHub Pages is the simplest if the code is already on GitHub, but it has the most quirks (sub-folder path, 404 trick, no headers). Netlify and Vercel are almost equal for this app: faster setup, previews, proper SPA rewrites and security headers. Vercel is the natural pick for Next.js; Netlify has built-in forms. For a real backend, choose Netlify or Vercel and move the API into their functions.

## Before sharing the site publicly

- Free subdomains are fine for the lab. A custom domain is added in each platform's **Domains** settings.
- Favicon: already set (`public/icons`).
- Privacy Policy and Terms pages: added at `/privacy` and `/terms`.
