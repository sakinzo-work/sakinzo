(function () {
  const services = typeof module === 'object' && module.exports ? require('./services-data') : window.SakinzoServices || [];
  const pages = {
    index: ['Sakin.zo | AI, IoT, Robotics & Custom Software Development Company', 'Sakin.zo builds scalable AI, IoT, robotics, connected device, web, FinTech, blockchain, eCommerce and custom software solutions that transform businesses.', 'Sakinzo, Sakin.zo, custom software development company, AI development company, IoT development services, robotics software development, connected device development, IoT device development, web development company, technology solutions company, fintech software development, blockchain development, ecommerce development'],
    contactus: ['Contact Sakin.zo | Start Your Software Project', 'Talk to Sakin.zo about AI, IoT, FinTech, blockchain, eCommerce or custom software development for your business.', 'contact software development company, hire software developers, custom software project'],
    'who-we-are': ['About Sakin.zo | Product Engineering & Software Experts', 'Meet Sakin.zo, a product engineering partner creating reliable digital products through strategy, design, AI and software development.', 'software product engineering company, digital product development partner, Sakinzo company'],
    careers: ['Careers at Sakin.zo | Build Meaningful Digital Products', 'Join Sakin.zo and build meaningful AI, IoT, FinTech and custom software products with a collaborative engineering team.', 'Sakinzo careers, software developer jobs, technology careers'],
    leadership: ['Sakin.zo Leadership | Product & Engineering Experts', 'Meet the leaders guiding Sakin.zo product strategy, engineering excellence and long-term client success.', 'Sakinzo leadership, software engineering leaders'],
    'ai-development': ['AI Development Company | Custom AI Solutions | Sakin.zo', 'Build practical custom AI solutions that automate work, improve decisions and create better digital experiences with Sakin.zo.', 'AI development company, custom AI solutions, machine learning development, AI software company'],
    'ai-agent-development': ['AI Agent Development Services | Sakin.zo', 'Sakin.zo builds secure AI agents that connect business knowledge, tools and workflows with reliable human oversight.', 'AI agent development company, custom AI agents, business automation agents'],
    'iot-development': ['IoT Development Services, Robotics & Connected Platforms | Sakin.zo', 'End-to-end IoT and robotics development from device integration and cloud platforms to monitoring, analytics and connected applications.', 'IoT development company, IoT software development, robotics software development, connected device platform, smart device development, IoT cloud services'],
    'fintech-development': ['FinTech Software Development Company | Sakin.zo', 'Secure FinTech software, digital wallets, payment systems and financial platforms engineered for trust and growth.', 'fintech software development company, payment app development, digital wallet development'],
    'blockchain-development': ['Blockchain Development Company | Sakin.zo', 'Build secure blockchain products, smart contracts and Web3 applications around clear business value with Sakin.zo.', 'blockchain development company, smart contract development, Web3 development services'],
    'ecommerce-development': ['eCommerce Development Company & Platforms | Sakin.zo', 'High-performance eCommerce platforms and connected shopping experiences designed to convert and scale.', 'ecommerce development company, custom ecommerce platform, online store development'],
    'full-cycle-development': ['Full-Cycle Software Product Development | Sakin.zo', 'One experienced Sakin.zo team for product discovery, UX design, software engineering, launch and continuous growth.', 'full cycle software development, product development company, custom application development'],
    blog: ['Software, AI & IoT Insights | Sakin.zo Blog', 'Practical Sakin.zo insights on software engineering, AI, IoT, product strategy and digital transformation.', 'software development blog, AI insights, IoT insights, product engineering'],
    news: ['Sakin.zo News | Company & Technology Updates', 'Read the latest Sakin.zo company news, partnerships, technology updates and team milestones.', 'Sakinzo news, technology company updates'],
    opensource: ['Open Source Software by Sakin.zo', 'Explore open source tools, reference projects and engineering knowledge from the Sakin.zo team.', 'Sakinzo open source, software engineering tools'],
    project: ['Software Project Case Study | Sakin.zo', 'Explore a Sakin.zo software project, its business challenge, solution, technology and product experience.', 'software development case study, custom software project, digital product case study']
  };
  pages.services = ['Software Development & Product Engineering Services | Sakin.zo', 'Explore Sakin.zo services across web and mobile development, AI, IoT, DevOps, design, QA, fintech, blockchain and product strategy.', 'software development services, product engineering services, Sakinzo services'];
  services.forEach(service => { pages[service.slug] = [service.seoTitle, service.summary, service.keywords]; });
  Object.assign(pages, {
    'ev-charging': ['EV Charging Cloud Platform Case Study | Sakin.zo', 'Explore Sakin.zo product engineering for connected EV charging, cloud management, monitoring and digital payment experiences.', 'EV charging software, connected charging platform, IoT case study'],
    'market-access': ['AI Market Access Tool Case Study | Sakin.zo', 'Explore an AI-based market access tool combining data, product strategy and software engineering from Sakin.zo.', 'AI market access software, AI case study, data platforms'],
    'multi-currency-wallet': ['Multi-Currency Wallet Case Study | Sakin.zo', 'Explore Sakin.zo engineering for multi-currency wallets, financial workflows and secure digital payment experiences.', 'multi currency wallet, fintech case study, digital payments'],
    'iot-cloud-platform': ['IoT Cloud Platform Case Study | Sakin.zo', 'Explore how Sakin.zo connects devices, cloud services and monitoring in an IoT platform designed for dependable operations.', 'IoT cloud platform, connected devices, IoT case study'],
    'smart-hvac': ['Smart HVAC Monitoring with AI Case Study | Sakin.zo', 'Explore connected HVAC monitoring with AI, device data and software engineering from Sakin.zo.', 'smart HVAC monitoring, AI IoT case study, connected building software']
  });
  const aliases = { newindex: 'index', preindex: 'index', index1: 'index', constactus2: 'contactus' };
  const metadata = slug => pages[aliases[slug] || slug] || ['Sakin.zo | Software Product Engineering', 'Sakin.zo creates AI, IoT, FinTech and custom software products that transform businesses.', 'Sakinzo, custom software development, product engineering'];
  if (typeof module === 'object' && module.exports) { module.exports = { pages, metadata }; return; }
  const file = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const rawSlug = document.body?.dataset?.page || file.replace(/\.html$/, '');
  const slug = aliases[rawSlug] || rawSlug;
  const config = metadata(slug);
  const archived = Object.hasOwn(aliases, rawSlug);
  const onProxy = location.hostname.endsWith('.translate.goog');
  const sourceUrl = document.head.querySelector('link[rel="canonical"]')?.href || location.href;

  const upsertMeta = (key, value, property) => {
    if (!value) return;
    const attr = property ? 'property' : 'name';
    let el = document.head.querySelector(`meta[${attr}="${key}"]`);
    if (!el) { el = document.createElement('meta'); el.setAttribute(attr, key); document.head.appendChild(el); }
    el.setAttribute('content', value);
  };
  const cleanPath = /^(index\.html)?$/i.test(file) ? location.pathname.replace(/index\.html$/i, '') : archived ? new URL(slug === 'index' ? './' : `${slug}.html`, location.href).pathname : location.pathname;
  const identityKey = slug === 'project' ? 'id' : slug === 'blog' ? 'slug' : '';
  const identity = identityKey ? new URLSearchParams(location.search).get(identityKey) : '';
  const proxySource = new URL(sourceUrl);
  if (identity) proxySource.searchParams.set(identityKey, identity);
  const canonicalUrl = onProxy ? proxySource.href : `${location.origin}${cleanPath}${identity ? `?${identityKey}=${encodeURIComponent(identity)}` : ''}`;
  const cover = window.SakinzoPageCovers?.get(slug) || (services.find(service => service.slug === slug) || (slug === 'services' ? services[0] : null))?.cover;
  const socialImage = new URL(cover?.image || 'assets/sakinzo-hero-desktop-waves.webp', canonicalUrl).href;
  const imageDescription = cover?.description || 'Sakin.zo software product engineering';
  document.title = config[0];
  upsertMeta('description', config[1]);
  upsertMeta('keywords', config[2]);
  upsertMeta('robots', archived ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
  upsertMeta('googlebot', archived ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1');
  upsertMeta('og:type', ['project', 'blog'].includes(slug) ? 'article' : 'website', true);
  upsertMeta('og:site_name', 'Sakin.zo', true);
  upsertMeta('og:title', config[0], true);
  upsertMeta('og:description', config[1], true);
  upsertMeta('og:url', canonicalUrl, true);
  upsertMeta('og:locale', 'en_US', true);
  upsertMeta('og:image', socialImage, true);
  upsertMeta('og:image:alt', imageDescription, true);
  upsertMeta('twitter:card', 'summary_large_image');
  upsertMeta('twitter:title', config[0]);
  upsertMeta('twitter:description', config[1]);
  upsertMeta('twitter:image', socialImage);
  upsertMeta('twitter:image:alt', imageDescription);
  let canonical = document.head.querySelector('link[rel="canonical"]');
  if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical); }
  canonical.href = canonicalUrl;

  if (slug === 'index' && !document.getElementById('sakinzo-schema')) {
    const data = {
      '@context': 'https://schema.org',
      '@graph': [
        { '@type': 'Organization', '@id': `${location.origin}/#organization`, name: 'Sakin.zo', alternateName: 'Sakinzo', url: canonicalUrl, logo: `${location.origin}${cleanPath}favicon.svg`, email: 'hello@sakinzo.com', description: config[1], sameAs: ['https://www.linkedin.com/company/sakinzo'] },
        { '@type': 'WebSite', '@id': `${location.origin}/#website`, url: canonicalUrl, name: 'Sakin.zo', alternateName: 'Sakinzo', publisher: { '@id': `${location.origin}/#organization` }, inLanguage: 'en' },
        { '@type': 'ProfessionalService', name: 'Sakin.zo Software Development', url: canonicalUrl, image: `${location.origin}${cleanPath}favicon.svg`, description: config[1], serviceType: ['Custom Software Development','Web Development','AI Development','AI Agent Development','IoT Development','Robotics Software Development','Connected Device Development','FinTech Development','Blockchain Development','eCommerce Development'], areaServed: 'Worldwide', knowsAbout: ['Artificial Intelligence','Internet of Things','Robotics','Embedded Systems','Connected Devices','Web Applications','Cloud Platforms','FinTech','Blockchain','eCommerce'] },
        { '@type': 'ItemList', name: 'Sakin.zo Technology Services', itemListElement: ['AI Development','IoT Development','Robotics Software','Web Development','FinTech Software','Blockchain Development','eCommerce Development'].map((name, index) => ({ '@type': 'ListItem', position: index + 1, name })) }
      ]
    };
    const script = document.createElement('script'); script.id = 'sakinzo-schema'; script.type = 'application/ld+json'; script.textContent = JSON.stringify(data); document.head.appendChild(script);
  }
  function setLocale(language, available = ['en']) {
    const url = new URL(canonicalUrl);
    if (language !== 'en') url.searchParams.set('lang', language);
    canonical.href = url.href; upsertMeta('og:url', url.href, true);
    const locales = { en: 'en_US', hi: 'hi_IN', ur: 'ur_PK', ar: 'ar_AR', zh: 'zh_CN', 'zh-CN': 'zh_CN', 'zh-TW': 'zh_TW', fr: 'fr_FR', de: 'de_DE', es: 'es_ES', pt: 'pt_PT', ja: 'ja_JP', ko: 'ko_KR' };
    upsertMeta('og:locale', locales[language] || language.replace(/-/g, '_'), true);
    document.head.querySelectorAll('link[data-language-alternate],link[rel="alternate"][hreflang]').forEach(node => node.remove());
    for (const code of [...new Set(['x-default', 'en', ...available])]) {
      const alternate = document.createElement('link'), href = new URL(canonicalUrl);
      if (!['en', 'x-default'].includes(code)) href.searchParams.set('lang', code);
      alternate.rel = 'alternate'; alternate.hreflang = code; alternate.href = href.href; alternate.dataset.languageAlternate = ''; document.head.appendChild(alternate);
    }
    document.querySelectorAll('script[type="application/ld+json"]').forEach(script => {
      try {
        const data = JSON.parse(script.textContent);
        function visit(value) {
          if (!value || typeof value !== 'object') return;
          if (value['@type']) value.inLanguage = language;
          if (['WebPage', 'CreativeWork', 'Service'].includes(value['@type'])) value.url = url.href;
          Object.values(value).forEach(visit);
        }
        visit(data); script.textContent = JSON.stringify(data);
      } catch {}
    });
  }
  function updatePage(meta) {
    if (meta.title) {
      document.title = meta.title;
      upsertMeta('og:title', meta.title, true); upsertMeta('twitter:title', meta.title);
    }
    if (meta.description) {
      upsertMeta('description', meta.description); upsertMeta('og:description', meta.description, true); upsertMeta('twitter:description', meta.description);
    }
    if (meta.type) upsertMeta('og:type', meta.type, true);
    if (meta.image) {
      try {
        const image = new URL(meta.image, location.href);
        if (/^https?:$/.test(image.protocol)) {
          upsertMeta('og:image', image.href, true); upsertMeta('twitter:image', image.href);
          const primary = document.getElementById('sakinzo-schema');
          try { const data = JSON.parse(primary.textContent), page = data['@graph']?.find(item => item['@type'] === 'WebPage'); if (page) { page.primaryImageOfPage = { '@type': 'ImageObject', url: image.href }; primary.textContent = JSON.stringify(data); } } catch {}
        }
      } catch {}
    }
    const script = document.getElementById('sakinzo-schema');
    try {
      const data = JSON.parse(script.textContent), page = data['@graph']?.find(item => item['@type'] === 'WebPage');
      if (page) { if (meta.title) page.name = meta.title; if (meta.description) page.description = meta.description; script.textContent = JSON.stringify(data); }
    } catch {}
  }
  window.SakinzoSEO = { sourceUrl: canonicalUrl, setLocale, updatePage };
  setLocale('en');
  if (window.SAKINZO_PAGE_META) updatePage(window.SAKINZO_PAGE_META);
})();
