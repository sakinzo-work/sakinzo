/* Refresh crawlable metadata without requiring JavaScript, API credentials or a browser.
   Usage: node scripts/update-seo.js [https://your-domain/path/] [YYYY-MM-DD] */
const fs = require('node:fs');
const path = require('node:path');
const { metadata } = require('../frontend/seo');
const services = require('../frontend/services-data');
const root = path.join(__dirname, '../frontend');
const site = new URL(process.argv[2] || 'https://sakinzo-work.github.io/sakinzo/frontend/');
if (!/^https?:$/.test(site.protocol)) throw new Error('Provide an HTTP(S) site URL.');
if (!site.pathname.endsWith('/')) site.pathname += '/';
const changedOn = process.argv[3] || new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
if (!/^\d{4}-\d{2}-\d{2}$/.test(changedOn)) throw new Error('Provide a YYYY-MM-DD modification date.');
const archived = { newindex: 'index', preindex: 'index', index1: 'index', constactus2: 'contactus' };
const escape = text => String(text).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const sitemap = [];
for (const filename of fs.readdirSync(root).filter(file => file.endsWith('.html') && !/^(admin|ad|google.*)\.html$/.test(file))) {
  const slug = filename.replace(/\.html$/, ''), page = archived[slug] || slug;
  const [title, description, keywords] = metadata(page);
  const url = new URL(page === 'index' ? './' : `${page}.html`, site).href;
  const cover = (services.find(service => service.slug === page) || (page === 'services' ? services[0] : null))?.cover;
  const image = new URL(cover?.image || 'assets/sakinzo-hero-desktop-waves.webp', site).href;
  const imageDescription = cover?.description || 'Sakin.zo software product engineering';
  const tags = [
    `    <title>${escape(title)}</title>`,
    ...Object.entries({ description, keywords, robots: archived[slug] ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1', googlebot: archived[slug] ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1', 'twitter:card': 'summary_large_image', 'twitter:title': title, 'twitter:description': description, 'twitter:image': image, 'twitter:image:alt': imageDescription }).map(([key, value]) => `    <meta name="${key}" content="${escape(value)}">`),
    ...Object.entries({ 'og:type': ['blog', 'project'].includes(page) ? 'article' : 'website', 'og:site_name': 'Sakin.zo', 'og:title': title, 'og:description': description, 'og:url': url, 'og:locale': 'en_US', 'og:image': image, 'og:image:alt': imageDescription }).map(([key, value]) => `    <meta property="${key}" content="${escape(value)}">`),
    `    <link rel="canonical" href="${escape(url)}">`,
    `    <link rel="alternate" hreflang="en" href="${escape(url)}">`,
    `    <link rel="alternate" hreflang="x-default" href="${escape(url)}">`
  ];
  const organization = { '@type': 'Organization', '@id': `${site.href}#organization`, name: 'Sakin.zo', alternateName: 'Sakinzo', url: site.href, logo: new URL('favicon.svg', site).href, email: 'hello@sakinzo.com', sameAs: ['https://www.linkedin.com/company/sakinzo'] };
  const graph = [
    { '@type': 'WebPage', '@id': `${url}#webpage`, name: title, description, url, inLanguage: 'en', isPartOf: { '@id': `${site.href}#website` }, about: { '@id': `${site.href}#organization` } },
    organization,
    { '@type': 'WebSite', '@id': `${site.href}#website`, url: site.href, name: 'Sakin.zo', inLanguage: 'en', publisher: { '@id': `${site.href}#organization` } }
  ];
  if (page === 'index') graph.push({ '@type': 'ProfessionalService', name: 'Sakin.zo Software Development', url, image, description, serviceType: services.map(service => service.name), areaServed: 'Worldwide' });
  const service = services.find(service => service.slug === page);
  if (service) {
    graph[0].mainEntity = { '@id': `${url}#service` };
    graph[0].primaryImageOfPage = { '@type': 'ImageObject', url: image, width: cover.width, height: cover.height };
    graph.push({ '@type': 'Service', '@id': `${url}#service`, name: service.name, serviceType: service.name, description: service.summary, url, image, provider: { '@id': `${site.href}#organization` }, areaServed: 'Worldwide' });
    graph.push({ '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: site.href }, { '@type': 'ListItem', position: 2, name: 'Services', item: new URL('services.html', site).href }, { '@type': 'ListItem', position: 3, name: service.name, item: url }] });
  }
  if (page === 'services') graph.push({ '@type': 'ItemList', name: 'Sakin.zo Services', itemListElement: services.map((service, index) => ({ '@type': 'ListItem', position: index + 1, name: service.name, url: new URL(service.href, site).href })) });
  tags.push(`    <script id="sakinzo-schema" type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c')}</script>`);
  let html = fs.readFileSync(path.join(root, filename), 'utf8');
  html = html.replace(/\s*<!-- sakinzo:seo:start -->[\s\S]*?<!-- sakinzo:seo:end -->/g, '')
    .replace(/<title>[\s\S]*?<\/title>\s*/gi, '')
    .replace(/<meta\b[^>]*(?:name=["'](?:description|keywords|robots|googlebot|twitter:[^"']+)["']|property=["']og:[^"']+["'])[^>]*>\s*/gi, '')
    .replace(/<link\b(?=[^>]*rel=["'](?:canonical|alternate)["'])(?=[^>]*(?:hreflang=|rel=["']canonical["']))[^>]*>\s*/gi, '')
    .replace(/<script\b[^>]*id=["']sakinzo-schema["'][^>]*>[\s\S]*?<\/script>\s*/gi, '')
    .replace(/\s*<script\b[^>]*src=["'](?:seo|i18n|services-data|service-navigation)\.js["'][^>]*>\s*<\/script>/gi, '')
    .replace(/\s*<link\b[^>]*href=["'](?:i18n|service-navigation)\.css["'][^>]*>/gi, '');
  html = html.replace(/\s*<\/head>/i, `\n    <!-- sakinzo:seo:start -->\n${tags.join('\n')}\n    <!-- sakinzo:seo:end -->\n    <link rel="stylesheet" href="service-navigation.css">\n    <link rel="stylesheet" href="i18n.css">\n    <script src="services-data.js" defer></script>\n    <script src="service-navigation.js" defer></script>\n    <script src="seo.js" defer></script>\n    <script src="i18n.js" defer></script>\n</head>`);
  fs.writeFileSync(path.join(root, filename), html);
  if (!archived[slug] && slug !== 'project') sitemap.push(url);
}
fs.writeFileSync(path.join(root, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemap.map(url => `  <url><loc>${escape(url)}</loc><lastmod>${changedOn}</lastmod></url>`).join('\n')}\n</urlset>\n`);
console.log(`Updated public-page metadata and ${sitemap.length} sitemap URLs for ${site.href}`);
