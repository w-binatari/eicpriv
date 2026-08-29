# Sanity Studio — E&I Centre

Content management for blog posts, news, and SEO fields.

## Project

| Setting | Value |
|---------|-------|
| **Project ID** | `5c0bo9xi` |
| **Organization ID** | `oeqj3n4qi` (dashboard only) |
| **Dataset** | `production` |

Root `.env` (copy from `.env.example` if missing):

```
SANITY_PROJECT_ID=5c0bo9xi
SANITY_DATASET=production
```

## Setup

1. Copy `.env.example` to `.env` in the repo root (already configured if you cloned after setup).
2. Install studio dependencies and start the editor:

   ```bash
   npm install --prefix studio
   npm run studio:dev
   ```

3. Open the studio (usually `http://localhost:3333`), create **Blog Post** documents, and publish.

## Connecting to the website

The Vite site reads published posts at **build time** via the Sanity Content API:

- `scripts/generate-blog.js` — generates `/blog/index.html` and `/blog/{slug}.html`
- `scripts/generate-seo-files.js` — updates `sitemap.xml` and `llms.txt` with blog URLs

Run a full build after publishing:

```bash
npm run build
```

## Auto-deploy on publish (recommended)

In Sanity → **API → Webhooks**, add a webhook that triggers your hosting provider (Vercel/Netlify) deploy hook when a `post` document is created or updated.

## Deploy studio (optional)

Host the editor at `studio.eicng.com`:

```bash
npm run studio:deploy
```

Requires `npx sanity login` once.
