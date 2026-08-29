export default {
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    {
      name: 'metaTitle',
      title: 'Meta title',
      type: 'string',
      description: 'Overrides the page title in search results (50–60 chars ideal).',
    },
    {
      name: 'metaDescription',
      title: 'Meta description',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(160),
    },
    {
      name: 'ogImage',
      title: 'Social share image',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'noIndex',
      title: 'Hide from search engines',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'canonicalUrl',
      title: 'Canonical URL (optional)',
      type: 'url',
    },
  ],
};
