/**
 * Builders for schema.org structured data (JSON-LD) used across the site.
 * FAQPage entries are always built from the same arrays that render the
 * visible FAQs, so the structured data matches the page text exactly.
 */

export const SITE_URL = 'https://gaia-vesta-mcyr.vercel.app';

export const GAIA_ORG_REF = {
  '@type': 'Organization',
  name: 'Gaia Vesta',
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/favicon-512.png`,
} as const;

export type FaqItem = { q: string; a: string };

export function faqPageSchema(faqs: FaqItem[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export function webAppSchema(name: string, path: string, description: string) {
  return {
    '@type': 'WebApplication',
    name,
    url: `${SITE_URL}${path}`,
    description,
    applicationCategory: 'LifestyleApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    provider: GAIA_ORG_REF,
  };
}

export function articleSchema(headline: string, path: string, description: string) {
  return {
    '@type': 'Article',
    headline,
    url: `${SITE_URL}${path}`,
    description,
    author: GAIA_ORG_REF,
    publisher: GAIA_ORG_REF,
  };
}

export function webPageSchema(name: string, path: string, description: string) {
  return {
    '@type': 'WebPage',
    name,
    url: `${SITE_URL}${path}`,
    description,
    isPartOf: { '@type': 'WebSite', name: 'Gaia Vesta', url: `${SITE_URL}/` },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

/** Home → Tools → page crumb trail shared by the tool pages. */
export function toolBreadcrumb(pageName: string, pagePath: string) {
  return breadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Tools', path: '/tools' },
    { name: pageName, path: pagePath },
  ]);
}
