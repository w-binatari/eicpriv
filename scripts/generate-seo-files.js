import { mkdirSync, writeFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { STATIC_PAGES, SITE, absoluteUrl } from '../lib/site-config.js';
import { getSanityClient, isSanityConfigured, POSTS_QUERY } from '../lib/sanity-client.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const publicDir = resolve(root, 'public');

function formatDate(dateStr) {
  if (!dateStr) return new Date().toISOString().slice(0, 10);
  return new Date(dateStr).toISOString().slice(0, 10);
}

async function fetchBlogPosts() {
  if (!isSanityConfigured()) {
    console.log('[seo] Sanity not configured — sitemap will include static pages only.');
    return [];
  }

  const client = getSanityClient();
  try {
    const posts = await client.fetch(POSTS_QUERY);
    console.log(`[seo] Fetched ${posts.length} blog post(s) from Sanity.`);
    return posts;
  } catch (error) {
    console.warn('[seo] Could not fetch Sanity posts:', error.message);
    return [];
  }
}

function buildSitemap(staticPages, posts) {
  const urls = [
    ...staticPages.map((page) => ({
      loc: absoluteUrl(page.path),
      lastmod: formatDate(),
      changefreq: page.changefreq,
      priority: page.priority,
    })),
    ...posts.map((post) => ({
      loc: absoluteUrl(`/blog/${post.slug}.html`),
      lastmod: formatDate(post.publishedAt),
      changefreq: 'monthly',
      priority: '0.7',
    })),
  ];

  const body = urls
    .map(
      (entry) => `  <url>
    <loc>${entry.loc}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;
}

function buildLlmsTxt(posts) {
  const recentPosts = posts.slice(0, 10);
  const postLines =
    recentPosts.length > 0
      ? recentPosts
          .map((post) => `- [${post.title}](${absoluteUrl(`/blog/${post.slug}.html`)})`)
          .join('\n')
      : '- Blog posts will appear here once published in Sanity CMS.';

  return `# ${SITE.name}

> ${SITE.description}

## About
${SITE.shortName} provides entrepreneurship training, innovation consulting, capacity building, and startup support across the Niger Delta and Nigeria.

## Key pages
- [Home](${absoluteUrl('/')})
- [What We Do](${absoluteUrl('/what-we-do.html')})
- [News & Insights (Blog)](${absoluteUrl('/blog/')})

## Recent articles
${postLines}

## Programmes
- Entrepreneurship & Digital Skills
- Technical & Vocational Training
- Management Consulting
- Business Linkages & Incubation
- HSEQ Services

## Contact
- Email: ${SITE.email}
- Phone: ${SITE.phone}
- Address: ${SITE.address.street}, ${SITE.address.city}, ${SITE.address.region}, ${SITE.address.country}

## Social
- LinkedIn: https://www.linkedin.com/company/entrepreneurship-innovation-centre-limited/
- Instagram: https://www.instagram.com/e.icentreltd/
- Facebook: https://web.facebook.com/profile.php?id=100084852630204
`;
}

function buildRobotsTxt() {
  return `User-agent: *
Allow: /

# AI / LLM crawlers — site summary at /llms.txt
# See https://llmstxt.org/

Sitemap: ${absoluteUrl('/sitemap.xml')}
`;
}

async function main() {
  mkdirSync(publicDir, { recursive: true });

  const posts = await fetchBlogPosts();

  writeFileSync(resolve(publicDir, 'sitemap.xml'), buildSitemap(STATIC_PAGES, posts));
  writeFileSync(resolve(publicDir, 'llms.txt'), buildLlmsTxt(posts));
  writeFileSync(resolve(publicDir, 'robots.txt'), buildRobotsTxt());

  console.log('[seo] Generated public/sitemap.xml, public/llms.txt, public/robots.txt');
}

main();
