# SEO and phone navigation

The source remains a React application. The production build now also writes
route-specific HTML heads, so titles, descriptions, canonical links, social cards
and JSON-LD are available in the initial HTTP response. Page bodies continue to
render in React. The client reconciles the existing head tags when navigating or
opening an article, without creating duplicate titles or canonical links.

## Content and indexing

- `src/data/metadata.json` holds static page titles and descriptions.
- `src/lib/seo.js` defines canonical URLs and shared business structured data.
- `scripts/build-seo.mjs` builds static route heads and a public content snapshot.
- `api/page.mjs` supplies blog/project metadata, redirects legacy query URLs and
  serves the live content sitemap. It only reads Render's public site-data API.
- Known public content can use its saved metadata immediately while Vercel
  `waitUntil` refreshes the cache. Requests for unknown content check the live API;
  a temporary backend failure returns 503 rather than reporting a false 404.
- `/sitemap.xml` is a sitemap index referencing `/sitemap-static.xml` and
  `/sitemap-live.xml`. New visible blogs and projects appear through the live
  sitemap. Modification dates come from records, not the deployment date.
- Admin routes have `noindex` metadata and an HTTP robots header. Missing pages
  and missing records return 404. The empty project-detail landing route is
  excluded from the sitemap.
- The Google verification meta tag and verification HTML file remain available.

The existing Vercel variables are sufficient: `VITE_SITE_URL` is the canonical
production URL and `VITE_API_BASE` is the public Render API. No new secret is
required. Static routes added later also need a matching entry in the Vercel
rewrite configuration.

## Phone navigation

The menu uses its own opaque navy background and readable foreground colours on
every public page. Its top follows the measured header height; the remaining
dynamic viewport scrolls independently. Background page scrolling is restored on
close, navigation and resizing to desktop. Group controls expose their expanded
state and support keyboard focus and Escape.

## Validation

`npm run build` prepares the production documents and function snapshot.
`npm test` checks HTTP head metadata, escaping, canonicals, sitemap content,
redirect/error responses, React navigation, phone menu behaviour and existing
website features. API tests use public-content fixtures and do not write data.

References: [Google JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics),
[canonical URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls),
[sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap),
and [Vercel background work](https://vercel.com/docs/functions/functions-api-reference/vercel-functions-package#waituntil).
