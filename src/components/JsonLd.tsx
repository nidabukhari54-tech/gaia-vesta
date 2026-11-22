/**
 * Renders a JSON-LD structured-data block.
 * Accepts one schema object or an array (emitted as a single @graph).
 * Plain React — no helmet-style library, matching how the app handles titles.
 */
export function JsonLd({ data }: { data: object | object[] }) {
  const payload = Array.isArray(data)
    ? { '@context': 'https://schema.org', '@graph': data }
    : { '@context': 'https://schema.org', ...data };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}
