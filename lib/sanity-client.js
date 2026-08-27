import { createClient } from '@sanity/client';

const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET || 'production';
const apiVersion = process.env.SANITY_API_VERSION || '2024-08-01';
const token = process.env.SANITY_READ_TOKEN;

/** Returns true when Sanity env vars are configured for content fetching. */
export function isSanityConfigured() {
  return Boolean(projectId);
}

/** @returns {import('@sanity/client').SanityClient | null} */
export function getSanityClient() {
  if (!isSanityConfigured()) return null;

  return createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: true,
    token: token || undefined,
  });
}

export const POSTS_QUERY = `
*[_type == "post" && defined(slug.current) && !(_id in path("drafts.**")) && (seo.noIndex != true)]
  | order(publishedAt desc) {
    title,
    "slug": slug.current,
    postType,
    publishedAt,
    excerpt,
    body,
    "seo": seo,
    "imageUrl": coalesce(seo.ogImage.asset->url, mainImage.asset->url),
    "authorName": author->name
  }
`;
