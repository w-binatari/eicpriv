# Sanity Studio — E&I Centre

Content management for blog posts, news, and SEO fields.

## Setup

1. Create a Sanity project at [sanity.io/manage](https://www.sanity.io/manage) (or log in with `npx sanity login`).
2. Copy your **Project ID** into the root `.env` file:

   ```
   SANITY_PROJECT_ID=your-project-id
   SANITY_DATASET=production
   ```

3. Install studio dependencies and start the editor:

   ```bash
   npm install --prefix studio
   npm run studio:dev
   ```

4. Open the studio (usually `http://localhost:3333`), create **Blog Post** documents, and publish.

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
