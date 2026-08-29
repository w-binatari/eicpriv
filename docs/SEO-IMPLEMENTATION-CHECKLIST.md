# E&I Centre — SEO & Sanity CMS Implementation Checklist

**Project:** eic-website (www.eicng.com)  
**Document version:** 1.0  
**Last updated:** 27 August 2026  
**Prepared by:** Cursor Cloud Agent

---

## Summary

| Status | Count |
|--------|-------|
| Done (this session) | 18 |
| Remaining (requires your action) | 12 |

---

## A. General site SEO

| ID | Task | Status | Notes |
|----|------|--------|-------|
| A1 | Add canonical URLs on all static pages | **DONE** | Added to `index.html` and `what-we-do.html` |
| A2 | Add Open Graph tags (url, image, locale, site_name) | **DONE** | All static pages |
| A3 | Add Twitter Card meta tags | **DONE** | `summary_large_image` on all static pages |
| A4 | Add JSON-LD structured data | **DONE** | `Organization` on homepage; `WebPage` on What We Do |
| A5 | Maintain `robots.txt` | **DONE** | Generated at build via `scripts/generate-seo-files.js` |
| A6 | Dynamic `sitemap.xml` with lastmod | **DONE** | Includes `/`, `/what-we-do.html`, `/blog/`; blog posts added when Sanity connected |
| A7 | Create `llms.txt` for AI crawlers | **DONE** | Generated at `public/llms.txt` on each build |
| A8 | Google Search Console verification | **REMAINING** | Add meta tag from GSC to pages or DNS TXT record |
| A9 | Submit sitemap to Google Search Console | **REMAINING** | After deploy: submit `https://www.eicng.com/sitemap.xml` |
| A10 | Bing Webmaster Tools sitemap submit | **REMAINING** | Optional but recommended |

---

## B. Blog / News & Insights (SEO content hub)

| ID | Task | Status | Notes |
|----|------|--------|-------|
| B1 | Create `/blog/` listing page | **DONE** | `blog/index.html` — filter tabs for news, articles, announcements |
| B2 | Blog post detail page template | **DONE** | Generated as `/blog/{slug}.html` at build time |
| B3 | Add blog link to main navigation | **DONE** | Nav + footer on all pages |
| B4 | Blog-specific CSS | **DONE** | Added to `style.css` |
| B5 | Blog post filter UI (news / article / announcement) | **DONE** | `blog/blog-filters.js` |
| B6 | Homepage “Latest news” teaser section | **REMAINING** | Recommended for internal linking once posts exist |
| B7 | Publish first 3–5 SEO-targeted articles | **REMAINING** | Content creation in Sanity Studio |
| B8 | Category landing pages (optional) | **REMAINING** | e.g. `/blog/category/training.html` |

---

## C. Sanity CMS integration

| ID | Task | Status | Notes |
|----|------|--------|-------|
| C1 | Sanity Studio scaffold (`/studio`) | **DONE** | Schemas: post, author, category, siteSettings, seo |
| C2 | Blog post schema with SEO fields | **DONE** | `studio/schemas/post.js` + `objects/seo.js` |
| C3 | Sanity read client for build scripts | **DONE** | `lib/sanity-client.js` |
| C4 | Build script: fetch posts → HTML pages | **DONE** | `scripts/generate-blog.js` |
| C5 | Build script: update sitemap + llms.txt from Sanity | **DONE** | `scripts/generate-seo-files.js` |
| C6 | Environment variable template | **DONE** | `.env.example` |
| C7 | Studio setup documentation | **DONE** | `studio/README.md` |
| C8 | **Create Sanity project & add Project ID to `.env`** | **REMAINING** | See “Connecting Sanity” below |
| C9 | Install studio deps & run editor locally | **REMAINING** | `npm install --prefix studio && npm run studio:dev` |
| C10 | Deploy Sanity Studio (optional hosted editor) | **REMAINING** | `npm run studio:deploy` → e.g. `eic-website.sanity.studio` |
| C11 | Sanity webhook → auto-rebuild on publish | **REMAINING** | Triggers Vercel/Netlify deploy when posts change |
| C12 | CORS origins in Sanity project settings | **REMAINING** | Add `https://www.eicng.com` if using client-side preview |

---

## D. Build & deployment pipeline

| ID | Task | Status | Notes |
|----|------|--------|-------|
| D1 | `prebuild` runs SEO + blog generation | **DONE** | `npm run generate:all` |
| D2 | Vite MPA includes dynamic blog pages | **DONE** | `vite.config.js` globs `blog/*.html` |
| D3 | Track SEO files in git | **DONE** | Updated `.gitignore` for `public/robots.txt`, `sitemap.xml`, `llms.txt` |
| D4 | Add `SANITY_PROJECT_ID` to hosting env vars | **REMAINING** | Vercel/Netlify project settings |
| D5 | Verify production deploy includes `/blog/` and `/llms.txt` | **REMAINING** | After next deploy |

---

## E. Content & SEO strategy (editorial)

| ID | Task | Status | Notes |
|----|------|--------|-------|
| E1 | Keyword map for target queries | **REMAINING** | e.g. “entrepreneurship training Port Harcourt”, “OGTAN training Nigeria” |
| E2 | Editorial calendar (2–4 posts/month) | **REMAINING** | Mix news + evergreen articles |
| E3 | Unique meta title/description per post in Sanity | **REMAINING** | Use SEO object on each post |
| E4 | OG image per post (1200×630 recommended) | **REMAINING** | Upload in Sanity `mainImage` or `seo.ogImage` |
| E5 | Internal links from posts to `/what-we-do.html` | **REMAINING** | In post body links |

---

## Done — files changed this session

| File / area | Change |
|-------------|--------|
| `index.html` | Canonical, OG, Twitter, JSON-LD Organization, blog nav link |
| `what-we-do.html` | Canonical, OG, Twitter, JSON-LD WebPage, blog nav link |
| `style.css` | Blog page styles |
| `package.json` | Sanity client, build scripts, md-to-pdf |
| `vite.config.js` | Dynamic blog page inputs |
| `.gitignore` | Allow tracking SEO public files |
| `.env.example` | Sanity env template |
| `lib/site-config.js` | Shared site URL and page list |
| `lib/sanity-client.js` | Sanity API client + GROQ query |
| `scripts/generate-seo-files.js` | robots.txt, sitemap.xml, llms.txt |
| `scripts/generate-blog.js` | Blog listing + post HTML generation |
| `blog/index.html` | Generated listing (empty state until Sanity connected) |
| `public/robots.txt` | Regenerated with sitemap reference |
| `public/sitemap.xml` | 3 URLs including `/blog/` |
| `public/llms.txt` | AI crawler summary file |
| `studio/` | Full Sanity Studio scaffold with schemas |

---

## Remaining — your action items

### Priority 1 — Connect Sanity (≈15 minutes)

1. Go to [sanity.io/manage](https://www.sanity.io/manage) and create a project named **EIC Website**.
2. Copy the **Project ID**.
3. Create `.env` in the repo root:

   ```
   SANITY_PROJECT_ID=your-project-id-here
   SANITY_DATASET=production
   ```

4. Install and start the studio:

   ```bash
   npm install --prefix studio
   npm run studio:dev
   ```

5. Create a **Blog Post**, fill SEO fields, and **Publish**.
6. Rebuild the site:

   ```bash
   npm run build
   ```

   This generates `/blog/your-slug.html` and adds it to the sitemap.

7. Add `SANITY_PROJECT_ID` and `SANITY_DATASET` to your **Vercel/Netlify environment variables** so production builds fetch posts.

### Priority 2 — Auto-publish pipeline

1. In Sanity → **API → Webhooks**, create a webhook on `post` create/update/delete.
2. Point it to your host’s **Deploy Hook** URL (Vercel: Settings → Git → Deploy Hooks).
3. Every publish in Sanity triggers a rebuild with fresh blog pages and sitemap.

### Priority 3 — Search engine registration

1. Verify domain in [Google Search Console](https://search.google.com/search-console).
2. Submit `https://www.eicng.com/sitemap.xml`.
3. Optionally verify in Bing Webmaster Tools.

### Priority 4 — Content

1. Publish 3–5 initial posts (mix of news + evergreen articles).
2. Add a homepage teaser linking to latest posts (can be done in a follow-up PR).

---

## Connecting Sanity — how it works

```
┌─────────────────────┐     publish      ┌──────────────────────┐
│  Sanity Studio      │ ───────────────► │  Sanity Content API  │
│  (studio/)          │                  │  (CDN, read-only)    │
└─────────────────────┘                  └──────────┬───────────┘
                                                    │
                              npm run build         │ GROQ fetch
                                                    ▼
                                         ┌──────────────────────┐
                                         │  generate-blog.js    │
                                         │  generate-seo-files  │
                                         └──────────┬───────────┘
                                                    │
                                                    ▼
                                         ┌──────────────────────┐
                                         │  Static HTML output  │
                                         │  /blog/*.html        │
                                         │  sitemap.xml         │
                                         │  llms.txt            │
                                         └──────────────────────┘
```

**Yes, Sanity can be connected** — the code is ready. You only need:

- A Sanity project ID in `.env` (local) and hosting env vars (production)
- Published posts in the studio

No runtime JavaScript fetches from Sanity in the browser; everything is **pre-rendered at build time** for maximum SEO.

---

## Useful commands

```bash
npm run dev              # Dev server (auto-generates blog + SEO files)
npm run generate:all     # Regenerate blog pages, sitemap, llms.txt
npm run build            # Full production build
npm run studio:dev       # Open Sanity content editor (after studio npm install)
npm run studio:deploy    # Host studio at *.sanity.studio
```

---

## Questions?

For Sanity setup details see `studio/README.md`.  
For environment variables see `.env.example`.
