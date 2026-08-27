/** Shared site configuration for build scripts and Sanity integration. */
export const SITE = {
  name: 'Entrepreneurship & Innovation Centre Ltd',
  shortName: 'E&I Centre',
  url: 'https://www.eicng.com',
  description:
    'ISO 9001:2015 certified Human Capital Development and Management Consultancy in Port Harcourt, Nigeria.',
  defaultOgImage: '/assets/logo/logo-nav.webp',
  locale: 'en_NG',
  email: 'info@eicng.com',
  phone: '+2347040001168',
  address: {
    street: 'No. 41 Mbonu Street, D-Line',
    city: 'Port Harcourt',
    region: 'Rivers State',
    country: 'Nigeria',
  },
};

/** Static pages included in sitemap (blog posts added at build time). */
export const STATIC_PAGES = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/what-we-do.html', priority: '0.9', changefreq: 'monthly' },
  { path: '/blog/', priority: '0.8', changefreq: 'weekly' },
];

export function absoluteUrl(path = '/') {
  if (path.startsWith('http')) return path;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${SITE.url}${normalized}`;
}
