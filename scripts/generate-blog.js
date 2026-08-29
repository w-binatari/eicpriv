import { mkdirSync, writeFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { SITE, absoluteUrl } from '../lib/site-config.js';
import { getSanityClient, isSanityConfigured, POSTS_QUERY } from '../lib/sanity-client.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const blogDir = resolve(root, 'blog');

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatDisplayDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function postTypeLabel(type) {
  const labels = { news: 'News', article: 'Article', announcement: 'Announcement' };
  return labels[type] || 'Article';
}

function seoHead({ title, description, path, type = 'website', image, publishedAt }) {
  const pageTitle = `${title} | ${SITE.shortName}`;
  const desc = escapeHtml(description);
  const canonical = absoluteUrl(path);
  const ogImage = absoluteUrl(image || SITE.defaultOgImage);

  const articleMeta =
    type === 'article' && publishedAt
      ? `\n  <meta property="article:published_time" content="${new Date(publishedAt).toISOString()}" />`
      : '';

  const jsonLd =
    type === 'article'
      ? `\n  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": ${JSON.stringify(title)},
    "description": ${JSON.stringify(description)},
    "datePublished": ${JSON.stringify(publishedAt ? new Date(publishedAt).toISOString() : undefined)},
    "author": { "@type": "Organization", "name": ${JSON.stringify(SITE.name)} },
    "publisher": {
      "@type": "Organization",
      "name": ${JSON.stringify(SITE.name)},
      "logo": { "@type": "ImageObject", "url": ${JSON.stringify(absoluteUrl(SITE.defaultOgImage))} }
    },
    "mainEntityOfPage": { "@type": "WebPage", "@id": ${JSON.stringify(canonical)} },
    "image": ${JSON.stringify(ogImage)}
  }
  </script>`
      : '';

  return `<meta name="description" content="${desc}" />
  <meta name="author" content="${SITE.shortName}" />
  <link rel="canonical" href="${canonical}" />
  <meta property="og:title" content="${escapeHtml(pageTitle)}" />
  <meta property="og:description" content="${desc}" />
  <meta property="og:type" content="${type}" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:site_name" content="${SITE.shortName}" />
  <meta property="og:image" content="${ogImage}" />
  <meta property="og:locale" content="${SITE.locale}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(pageTitle)}" />
  <meta name="twitter:description" content="${desc}" />
  <meta name="twitter:image" content="${ogImage}" />${articleMeta}${jsonLd}`;
}

function sharedNav(active = '') {
  const link = (href, label, key) =>
    `<li><a href="${href}"${active === key ? ' class="active" aria-current="page"' : ''}>${label}</a></li>`;

  return `<nav id="navbar" aria-label="Main navigation">
    <div class="nav-inner">
      <a class="logo" href="/" aria-label="E&amp;I Centre Home">
        <img class="header-wordmark" src="/assets/logo/logo-nav.webp" alt="Entrepreneurship &amp; Innovation Centre Ltd" width="808" height="202" />
      </a>
      <ul class="nav-links" id="navLinks" role="list">
        ${link('/#about', 'About Us', 'about')}
        ${link('/what-we-do.html', 'What We Do', 'what-we-do')}
        ${link('/blog/', 'News &amp; Insights', 'blog')}
        ${link('/#venture', 'Venture Creation Program', 'venture')}
        ${link('/#tech-ideas', 'Tech-Ideas Hub', 'tech-ideas')}
        ${link('/#contact', 'Contact', 'contact')}
        <li class="mobile-cta-item"><a class="nav-cta" href="/#contact">Partner With Us</a></li>
      </ul>
      <a class="nav-cta desktop-cta" href="/#contact" id="navCta">Partner With Us</a>
      <button class="nav-hamburger" id="navToggle" aria-label="Toggle navigation" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </div>
  </nav>`;
}

function sharedFooter() {
  return `<footer>
    <div class="footer-grid">
      <div class="footer-brand">
        <a class="logo logo-footer" href="/" aria-label="E&amp;I Centre Home" style="margin-bottom:12px;">
          <img loading="lazy" decoding="async" class="footer-wordmark" src="/assets/logo/logo-footer.webp" alt="Entrepreneurship &amp; Innovation Centre Ltd" width="420" height="140" />
        </a>
        <p>The premier entrepreneurship and innovation hub in Rivers State, building capacity, driving innovation, and empowering the next generation of Nigerian leaders.</p>
      </div>
      <div class="footer-col">
        <h4>Quick Links</h4>
        <ul>
          <li><a href="/#about">About Us</a></li>
          <li><a href="/what-we-do.html">What We Do</a></li>
          <li><a href="/blog/">News &amp; Insights</a></li>
          <li><a href="/#contact">Contact Us</a></li>
        </ul>
      </div>
      <div class="footer-col footer-contact">
        <address class="footer-address">${SITE.address.street}<br>${SITE.address.city}<br>${SITE.address.region}, ${SITE.address.country}</address>
        <div class="footer-contact-lines">
          <a class="footer-contact-line" href="mailto:${SITE.email}">${SITE.email}</a>
        </div>
      </div>
    </div>
    <div class="footer-bottom"><p>Copyright © ${new Date().getFullYear()}. All rights reserved.</p></div>
  </footer>`;
}

function renderPortableTextBlock(block) {
  if (block._type !== 'block' || !block.children) return '';
  const text = block.children.map((child) => escapeHtml(child.text || '')).join('');
  const style = block.style || 'normal';
  if (style === 'h2') return `<h2>${text}</h2>`;
  if (style === 'h3') return `<h3>${text}</h3>`;
  if (style === 'blockquote') return `<blockquote>${text}</blockquote>`;
  return `<p>${text}</p>`;
}

function renderBody(body) {
  if (!Array.isArray(body)) return '<p>Content unavailable.</p>';
  return body.map(renderPortableTextBlock).join('\n');
}

function buildListingPage(posts) {
  const cards =
    posts.length > 0
      ? posts
          .map(
            (post) => `<article class="blog-card" data-type="${escapeHtml(post.postType || 'article')}">
        <div class="blog-card-meta">
          <span class="blog-card-type">${postTypeLabel(post.postType)}</span>
          <time datetime="${post.publishedAt || ''}">${formatDisplayDate(post.publishedAt)}</time>
        </div>
        <h2><a href="/blog/${escapeHtml(post.slug)}.html">${escapeHtml(post.title)}</a></h2>
        <p>${escapeHtml(post.excerpt || '')}</p>
        <a class="blog-card-link" href="/blog/${escapeHtml(post.slug)}.html">Read more →</a>
      </article>`
          )
          .join('\n')
      : `<div class="blog-empty">
        <h2>Articles coming soon</h2>
        <p>News, articles, and announcements will appear here once content is published in Sanity CMS.</p>
      </div>`;

  const filterButtons =
    posts.length > 0
      ? `<div class="blog-filters" role="tablist" aria-label="Filter posts">
        <button class="tab-btn active" type="button" data-filter="all" aria-selected="true">All</button>
        <button class="tab-btn" type="button" data-filter="news" aria-selected="false">News</button>
        <button class="tab-btn" type="button" data-filter="article" aria-selected="false">Articles</button>
        <button class="tab-btn" type="button" data-filter="announcement" aria-selected="false">Announcements</button>
      </div>`
      : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>News &amp; Insights | ${SITE.shortName}</title>
  ${seoHead({
    title: 'News & Insights',
    description: 'Latest news, articles, and announcements from E&I Centre on entrepreneurship, innovation, and training in Nigeria.',
    path: '/blog/',
  })}
  <link rel="icon" href="/assets/favicon.png" type="image/png" />
  <link rel="stylesheet" href="/style.css" />
</head>
<body>
  <div class="contact-ribbon" id="contactRibbon" aria-label="Contact information">
    <div class="contact-ribbon-inner">
      <a href="mailto:${SITE.email}">${SITE.email}</a>
      <a href="tel:${SITE.phone}">${SITE.phone}</a>
    </div>
  </div>
  ${sharedNav('blog')}
  <main class="blog-page">
    <section class="blog-hero" aria-labelledby="blog-heading">
      <h1 id="blog-heading">News &amp; Insights</h1>
      <p>Updates on training, innovation, partnerships, and entrepreneurship across the Niger Delta.</p>
    </section>
    ${filterButtons}
    <section class="blog-grid" id="blogGrid" aria-live="polite">${cards}</section>
  </main>
  ${sharedFooter()}
  <script type="module" src="/main.js"></script>
  <script type="module" src="/blog/blog-filters.js"></script>
</body>
</html>`;
}

function buildPostPage(post) {
  const metaTitle = post.seo?.metaTitle || post.title;
  const metaDescription = post.seo?.metaDescription || post.excerpt || SITE.description;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(metaTitle)} | ${SITE.shortName}</title>
  ${seoHead({
    title: metaTitle,
    description: metaDescription,
    path: `/blog/${post.slug}.html`,
    type: 'article',
    image: post.imageUrl,
    publishedAt: post.publishedAt,
  })}
  <link rel="icon" href="/assets/favicon.png" type="image/png" />
  <link rel="stylesheet" href="/style.css" />
</head>
<body>
  <div class="contact-ribbon" id="contactRibbon" aria-label="Contact information">
    <div class="contact-ribbon-inner">
      <a href="mailto:${SITE.email}">${SITE.email}</a>
    </div>
  </div>
  ${sharedNav('blog')}
  <main class="blog-page blog-post-page">
    <article>
      <header class="blog-post-header">
        <p class="blog-post-meta">
          <span class="blog-card-type">${postTypeLabel(post.postType)}</span>
          <time datetime="${post.publishedAt || ''}">${formatDisplayDate(post.publishedAt)}</time>
          ${post.authorName ? `<span>By ${escapeHtml(post.authorName)}</span>` : ''}
        </p>
        <h1>${escapeHtml(post.title)}</h1>
        ${post.excerpt ? `<p class="blog-post-excerpt">${escapeHtml(post.excerpt)}</p>` : ''}
      </header>
      ${post.imageUrl ? `<img class="blog-post-image" src="${escapeHtml(post.imageUrl)}" alt="" loading="lazy" />` : ''}
      <div class="blog-post-body">${renderBody(post.body)}</div>
      <p class="blog-back-link"><a href="/blog/">← Back to News &amp; Insights</a></p>
    </article>
  </main>
  ${sharedFooter()}
  <script type="module" src="/main.js"></script>
</body>
</html>`;
}

async function main() {
  mkdirSync(blogDir, { recursive: true });

  let posts = [];
  if (isSanityConfigured()) {
    const client = getSanityClient();
    try {
      posts = await client.fetch(POSTS_QUERY);
      console.log(`[blog] Fetched ${posts.length} post(s) from Sanity.`);
    } catch (error) {
      console.warn('[blog] Sanity fetch failed:', error.message);
    }
  } else {
    console.log('[blog] Sanity not configured — generating empty blog listing.');
  }

  writeFileSync(resolve(blogDir, 'index.html'), buildListingPage(posts));

  for (const post of posts) {
    if (!post.slug) continue;
    writeFileSync(resolve(blogDir, `${post.slug}.html`), buildPostPage(post));
  }

  writeFileSync(
    resolve(blogDir, 'blog-filters.js'),
    `document.querySelectorAll('.blog-filters .tab-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter;
    document.querySelectorAll('.blog-filters .tab-btn').forEach((b) => {
      const active = b === btn;
      b.classList.toggle('active', active);
      b.setAttribute('aria-selected', String(active));
    });
    document.querySelectorAll('.blog-card').forEach((card) => {
      const match = filter === 'all' || card.dataset.type === filter;
      card.style.display = match ? '' : 'none';
    });
  });
});
`
  );

  console.log(`[blog] Generated blog/index.html${posts.length ? ` and ${posts.length} post page(s)` : ''}.`);
}

main();
