# Kettle Games website

The official [Kettle Games](https://www.kettle.games) site — a fast, fully
static site built with [Astro](https://astro.build), hosted for free on GitHub
Pages. No Wix, no subscriptions, everything in this repo.

## Quick start

```bash
npm install
npm run dev      # local dev server at http://localhost:4321
npm run build    # production build into dist/
npm run preview  # serve the production build locally
```

Every push to `main` deploys automatically via GitHub Actions
(`.github/workflows/deploy.yml`). In the repo settings, set
**Settings → Pages → Source** to **GitHub Actions** once.

## Editing the site

All content lives in small data files — no HTML required for routine updates.

| I want to…                 | Edit this                                          |
| -------------------------- | -------------------------------------------------- |
| Add/edit a team member     | `src/data/team.json` + photo in `src/assets/team/` |
| Add/edit a game            | `src/data/games.json` + art in `src/assets/`       |
| Change FAQ entries         | `src/data/faq.json`                                |
| Add/remove social links    | `src/data/socials.json` + icon in `src/icons/`     |
| Change email/site metadata | `src/data/site.ts`                                 |
| Edit hero text             | `src/pages/index.astro`                            |
| Edit privacy/accessibility | `src/pages/*.md`                                   |
| Adjust colors/spacing      | `src/styles/global.css` (CSS variables at the top) |

### Example: adding a team member

1. Drop a square-ish photo into `src/assets/team/`, e.g. `sam.jpg`
   (anything ≥ 640px wide looks sharp; Astro optimizes it at build time).
2. Add an entry to `src/data/team.json`:

```json
{
  "name": "Sam Example",
  "role": "Production",
  "photo": "sam.jpg",
  "bio": "One or two sentences about Sam.",
  "links": [
    { "label": "Bluesky", "icon": "bluesky", "url": "https://bsky.app/profile/example.com" }
  ]
}
```

3. Commit and push. That's it — the grid lays itself out.

Games work the same way in `src/data/games.json`; each game gets a logo,
status pill, description, and any number of store buttons.

## Newsletter setup (one-time, ~5 minutes)

Signups are collected into a **Google Sheet you own** via a tiny Google Apps
Script — free, unlimited-enough, and exportable to CSV for whatever email
service you use later.

1. Create a Google Sheet, e.g. *Kettle newsletter signups*.
2. **Extensions → Apps Script**, paste in
   [`docs/newsletter-apps-script.js`](docs/newsletter-apps-script.js)
   (setup details are in that file's header comment).
3. **Deploy → New deployment → Web app**, *Execute as: Me*,
   *Who has access: Anyone* → copy the `/exec` URL.
4. Paste the URL into `newsletterEndpoint` in `src/data/site.ts` and push.

Until the endpoint is configured the site shows an "email us to subscribe"
button instead of the form, so nothing breaks meanwhile.

Also export your existing subscribers from Wix (**Dashboard → Contacts →
Export → CSV**) and paste them into the same sheet so the list stays in one
place.

## Going live on kettle.games (leaving Wix)

The site currently builds for the GitHub Pages preview URL. When you're ready
to point the real domain at it:

1. **Update the Astro config** — in `astro.config.mjs` set
   `site: 'https://www.kettle.games'` and delete the `base` line.
2. **Add the CNAME file** — create `public/CNAME` containing exactly:
   `www.kettle.games`
3. **Tell GitHub about the domain** — repo **Settings → Pages → Custom
   domain** → `www.kettle.games`, and verify the domain under your account's
   **Settings → Pages → Verified domains** (GitHub shows you a TXT record to
   add).
4. **Update DNS where the domain is managed** (if it's registered through
   Wix: Wix dashboard → Domains → kettle.games → Manage DNS — the domain
   registration is separate from the paid site plan and survives cancelling
   it):
   - `www` → **CNAME** → `playfulbacon.github.io`
   - apex `kettle.games` → **A** records →
     `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - Remove the old Wix site records (A/CNAME pointing at Wix).
5. Wait for DNS to propagate (minutes to a few hours), then tick **Enforce
   HTTPS** in the Pages settings.
6. Check everything on the live domain (links, form, phone), then **cancel
   the Wix premium plan**. Keep the domain registration (renew it wherever
   it lives — or transfer to a registrar like Porkbun/Cloudflare later if
   you want cheaper renewals).

Old deep links: `/wordbound-privacy-policy` and `/accessibility-statement`
keep their Wix-era URLs. The Wix blog posts were intentionally not migrated,
so those `/post/...` URLs will 404.

## How it's put together

```
src/
├── data/          ← everything you routinely edit (team, games, faq, socials, site config)
├── assets/        ← images, optimized by Astro at build time
├── icons/         ← inline SVG icons (24×24), referenced by name from data files
├── components/    ← one small component per section
├── layouts/       ← Base (head/meta/header/footer) and Prose (markdown pages)
├── pages/         ← index.astro + markdown pages; file name = URL
└── styles/        ← global.css: palette & typography as CSS variables
```

Design notes: the navy checkerboard background is pure CSS (see `body` in
`global.css`), Poppins is self-hosted in `src/fonts/` (no external requests),
and the whole site ships zero JavaScript except the ~30-line newsletter
submit handler.
