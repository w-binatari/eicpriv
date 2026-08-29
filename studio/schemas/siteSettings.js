export default {
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Site title',
      type: 'string',
    },
    {
      name: 'description',
      title: 'Default meta description',
      type: 'text',
      rows: 3,
    },
    {
      name: 'defaultOgImage',
      title: 'Default social image',
      type: 'image',
    },
    {
      name: 'googleSiteVerification',
      title: 'Google Search Console verification code',
      type: 'string',
    },
  ],
};
