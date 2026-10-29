/* Generate complete, crawlable service pages from the shared public catalog.
   Run this before scripts/update-seo.js after editing services-data.js. */
const fs = require('node:fs');
const path = require('node:path');
const services = require('../frontend/services-data');
const root = path.join(__dirname, '../frontend');
const esc = text => String(text).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const arrow = '<svg viewBox="0 0 10 6" fill="none" aria-hidden="true"><path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
const logo = '<svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true"><path d="M6 8L18 2L30 8L26 14L18 11L10 14Z" fill="#1673FF"/><path d="M6 8L10 14L6 20L18 34L30 20L26 14L18 11L10 14Z" fill="#1673FF" opacity=".85"/><path d="M10 14L18 11L26 14L18 28Z" fill="white" opacity=".35"/></svg><span class="logo-txt">Sakin<span>.zo</span></span>';
const groups = [...new Set(services.map(service => service.group))];
const links = {
  'About Us': [['Who We Are', 'who-we-are.html'], ['Careers', 'careers.html'], ['Contacts', 'contactus.html'], ['Leadership', 'leadership.html']],
  'Success Stories': [['Cloud ecosystem for EV charging', 'ev-charging.html'], ['AI-Based Market Access Tool', 'market-access.html'], ['Multi-currency Wallet', 'multi-currency-wallet.html'], ['IoT Cloud Platform', 'iot-cloud-platform.html'], ['Smart HVAC Monitoring with AI', 'smart-hvac.html']],
  Services: [['All services', 'services.html'], ...services.map(service => [service.name, service.href])],
  Insights: [['News', 'news.html'], ['Opensource', 'opensource.html'], ['Blog', 'blog.html']]
};
const anchorList = items => items.map(([name, href]) => `<a href="${href}">${esc(name)}</a>`).join('');
const serviceMenu = `<a class="service-menu-all" href="services.html">Explore all services <span aria-hidden="true">↗</span></a><div class="service-menu-columns">${groups.map(group => `<div><p class="service-menu-label">${esc(group)}</p>${anchorList(services.filter(service => service.group === group).map(service => [service.name, service.href]))}</div>`).join('')}</div>`;
function header() {
  return `<a class="service-skip" href="#main-content">Skip to content</a>
  <header class="hdr" data-service-header><div class="hdr-inner"><a href="index.html" class="logo" aria-label="Sakinzo home">${logo}</a><nav aria-label="Main navigation">${Object.entries(links).map(([name, items]) => `<div class="ndrop${name === 'Services' ? ' service-nav-group' : ''}"><button class="nbtn" type="button" aria-expanded="false">${name}${arrow}</button><div class="drop${name === 'Services' ? ' service-menu' : ''}">${name === 'Services' ? serviceMenu : anchorList(items)}</div></div>`).join('')}</nav><div class="hdr-right"><span class="lang">EN${arrow}</span><a href="contactus.html#form-section" class="btn-git">Get in touch</a></div><button class="hamburger" id="hamburger" type="button" aria-label="Menu" aria-controls="mobileMenu" aria-expanded="false"><span></span><span></span><span></span></button></div></header>
  <div class="mobile-menu" id="mobileMenu">${Object.entries(links).map(([name, items], index) => `<div class="mob-item"><button class="mob-link" type="button" data-mobile-toggle aria-expanded="false" aria-controls="mobile-group-${index}">${name}${arrow}</button><div class="mob-sub" id="mobile-group-${index}">${anchorList(items)}</div></div>`).join('')}<a href="contactus.html#form-section" class="mob-cta">Get in touch</a></div>`;
}
const footer = `<footer class="site-footer"><div class="footer-inner"><a class="brand" href="index.html">Sakin<span>.zo</span></a><div class="footer-links"><a href="services.html">All services</a><a href="who-we-are.html">About</a><a href="blog.html">Insights</a><a href="contactus.html">Contact</a></div><span>© 2026 Sakinzo</span></div></footer>`;
const cta = `<section class="service-cta"><div class="wrap"><div><span class="kicker">Let’s build something useful</span><h2>What would you like to make possible?</h2><p>Tell us about your product, your team and the challenge ahead.</p></div><a class="btn btn-blue" href="contactus.html#form-section">Start a conversation <span aria-hidden="true">↗</span></a></div></section>`;
function document(slug, title, content) {
  const cover = (services.find(service => service.slug === slug) || services[0]).cover;
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${esc(title)}</title>
  <link rel="icon" href="favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="favicon.svg">
  <link rel="manifest" href="site.webmanifest">
  <meta name="theme-color" content="#061326">
  <link rel="preload" as="image" href="${cover.image}" fetchpriority="high">
  <link rel="stylesheet" href="subpage.css">
  <link rel="stylesheet" href="services.css">
  <script src="service-page.js" defer></script>
</head>
<body class="service-page" data-page="${slug}">
  ${header()}
  <main id="main-content">${content}</main>
  ${footer}
</body>
</html>
`;
}
function card(service, index) {
  return `<a class="service-card" href="${service.href}" aria-labelledby="card-${service.slug}"><span class="service-card-top"><span class="service-index" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span><span class="service-card-arrow" aria-hidden="true">↗</span></span><h3 id="card-${service.slug}">${esc(service.name)}</h3><p>${esc(service.summary)}</p><span class="service-card-link">Explore service <span aria-hidden="true">→</span></span></a>`;
}
function heroImage(cover) {
  if (!cover || !fs.existsSync(path.join(root, cover.image))) throw new Error('A valid service cover image is required.');
  return `<img class="service-hero-image" src="${cover.image}" width="${cover.width}" height="${cover.height}" alt="" fetchpriority="high" decoding="async" style="--cover-position:${cover.position};--cover-mobile-position:${cover.mobilePosition}">`;
}
for (const service of services) {
  const related = service.related.map(slug => services.find(item => item.slug === slug));
  if (related.some(item => !item)) throw new Error(`Unknown related service on ${service.slug}`);
  const content = `
    <section class="hero service-hero service-hero-photo">${heroImage(service.cover)}<div class="wrap"><nav class="service-breadcrumbs" aria-label="Breadcrumb"><a href="index.html">Home</a><span aria-hidden="true">/</span><a href="services.html">Services</a><span aria-hidden="true">/</span><span aria-current="page">${esc(service.name)}</span></nav><div class="service-hero-grid"><div><span class="service-eyebrow">${esc(service.name)}</span><h1>${esc(service.headline)}</h1><p class="service-hero-copy">${esc(service.summary)}</p><div class="service-hero-actions"><a class="btn btn-blue" href="contactus.html#form-section">Discuss your project <span aria-hidden="true">↗</span></a><a class="service-hero-secondary" href="#capabilities">Explore capabilities <span aria-hidden="true">↓</span></a></div></div></div></div></section>
    <nav class="service-section-nav" aria-label="On this page"><div class="wrap"><a href="#overview">Overview</a><a href="#capabilities">Capabilities</a><a href="#deliverables">Deliverables</a><a href="#delivery">How we work</a><a href="#faq">FAQs</a></div></nav>
    <section class="service-section" id="overview"><div class="wrap service-overview"><div><span class="kicker">The opportunity</span><h2>${esc(service.overviewTitle)}</h2></div><div>${service.overview.map(paragraph => `<p>${esc(paragraph)}</p>`).join('')}</div></div></section>
    <section class="service-section service-soft" id="capabilities"><div class="wrap"><div class="service-section-heading"><span class="kicker">What we can help with</span><h2>Capabilities for the work ahead.</h2></div><div class="service-capabilities">${service.capabilities.map(([name, description], index) => `<article><span class="service-index" aria-hidden="true">0${index + 1}</span><h3>${esc(name)}</h3><p>${esc(description)}</p></article>`).join('')}</div></div></section>
    <section class="service-section" id="deliverables"><div class="wrap service-deliverables"><div><span class="kicker">What you take forward</span><h2>Clear outputs.<br>Useful next steps.</h2><p>We agree the scope and handover with you before delivery begins.</p></div><ul>${service.deliverables.map(item => `<li><span aria-hidden="true">✓</span>${esc(item)}</li>`).join('')}</ul></div></section>
    <section class="service-section service-dark" id="delivery"><div class="wrap"><div class="service-section-heading"><span class="kicker">How we work</span><h2>A shared plan, from start to handover.</h2></div><ol class="service-process">${service.process.map(([name, description], index) => `<li><span class="service-step-number" aria-hidden="true">0${index + 1}</span><h3>${esc(name)}</h3><p>${esc(description)}</p></li>`).join('')}</ol></div></section>
    <section class="service-section" id="faq"><div class="wrap service-faq-grid"><div><span class="kicker">Before we start</span><h2>A few useful answers.</h2><p>Have something else in mind?<br><a href="contactus.html#form-section">Talk to our team <span aria-hidden="true">↗</span></a></p></div><div class="service-faqs">${service.faqs.map(([question, answer]) => `<details><summary>${esc(question)}</summary><p>${esc(answer)}</p></details>`).join('')}</div></div></section>
    <section class="service-section service-soft"><div class="wrap"><div class="service-section-heading service-related-heading"><div><span class="kicker">Keep exploring</span><h2>Connected services.</h2></div><a href="services.html">View all services <span aria-hidden="true">↗</span></a></div><div class="service-grid">${related.map((item, index) => card(item, index)).join('')}</div></div></section>${cta}`;
  fs.writeFileSync(path.join(root, service.href), document(service.slug, service.seoTitle, content));
}
const content = `<section class="hero service-hero service-hero-photo service-hub-hero">${heroImage(services[0].cover)}<div class="wrap"><nav class="service-breadcrumbs" aria-label="Breadcrumb"><a href="index.html">Home</a><span aria-hidden="true">/</span><span aria-current="page">Services</span></nav><span class="service-eyebrow">Strategy. Design. Engineering.</span><h1>Good ideas.<br><span>Built into useful products.</span></h1><div class="service-hub-intro"><p>From the first product question to the systems that keep it running, find the expertise your next step needs.</p><a class="btn btn-blue" href="contactus.html#form-section">Find your starting point <span aria-hidden="true">↗</span></a></div></div></section><nav class="service-section-nav" aria-label="Service categories"><div class="wrap"><a href="#engineering">Engineering &amp; delivery</a><a href="#technology">Technology solutions</a></div></nav>${groups.map((group, index) => `<section class="service-section${index ? ' service-soft' : ''}" id="${index ? 'technology' : 'engineering'}"><div class="wrap"><div class="service-section-heading"><span class="kicker">${index ? 'Specialist expertise' : 'Across the product lifecycle'}</span><h2>${esc(group)}</h2><p>${index ? 'Connect emerging technology and industry workflows to a practical product use case.' : 'Plan, design, build and operate software with a connected delivery team.'}</p></div><div class="service-grid">${services.filter(service => service.group === group).map(service => card(service, services.indexOf(service))).join('')}</div></div></section>`).join('')}${cta}`;
fs.writeFileSync(path.join(root, 'services.html'), document('services', 'Software Development & Product Engineering Services | Sakin.zo', content));

// Link the existing homepage service cards and accordion actions in their HTML.
const whatWeDo = { iot: 'iot-development', 'full-cycle': 'full-cycle-development', ecommerce: 'ecommerce-development', blockchain: 'blockchain-development', ai: 'ai-development', fintech: 'fintech-development' };
const cardStyles = { 'iot-bg': 'iot', 'full-bg': 'full-cycle', 'ecom-bg': 'ecommerce', 'bc-bg': 'blockchain', 'ai-bg': 'ai', 'fintech-bg': 'fintech' };
const accordion = ['web-mobile-development', 'devops-solutions', 'architecture-design', 'poc-mvp-development', 'qa-testing', 'ux-ui-design', 'business-analysis'];
for (const filename of ['index.html', 'index1.html', 'newindex.html', 'preindex.html']) {
  const file = path.join(root, filename); let html = fs.readFileSync(file, 'utf8'), index = 0;
  html = html.replace(/<a\b[^>]*class="wwd-card[^>]*>/g, tag => {
    const classes = tag.match(/class="([^"]*)"/)[1].split(/\s+/);
    const key = tag.match(/data-service-key="([^"]+)"/)?.[1] || cardStyles[classes.find(name => cardStyles[name])];
    if (!whatWeDo[key]) return tag;
    let result = tag.replace(/href="[^"]*"/, `href="${whatWeDo[key]}.html"`);
    if (!result.includes('data-service-key=')) result = result.replace(/>$/, ` data-service-key="${key}">`);
    return result;
  });
  html = html.replace(/<a\b[^>]*class="svc-link"[^>]*>/g, tag => tag.replace(/href="[^"]*"/, `href="${accordion[index++]}.html"`));
  if (index !== accordion.length) throw new Error(`Expected seven service actions in ${filename}, found ${index}`);
  fs.writeFileSync(file, html);
}
console.log(`Built ${services.length} service detail pages, services.html, and linked homepage service actions.`);
