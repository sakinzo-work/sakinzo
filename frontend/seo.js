(function () {
  const file = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const slug = document.body?.dataset?.page || file.replace(/\.html$/, '');
  const pages = {
    index: ['Sakin.zo | AI, IoT & Custom Software Development Company', 'Sakin.zo builds scalable AI, IoT, FinTech, blockchain, eCommerce and custom software solutions that transform businesses.', 'custom software development company, AI development company, IoT development services, fintech software development, blockchain development, ecommerce development'],
    contactus: ['Contact Sakin.zo | Start Your Software Project', 'Talk to Sakin.zo about AI, IoT, FinTech, blockchain, eCommerce or custom software development for your business.', 'contact software development company, hire software developers, custom software project'],
    'who-we-are': ['About Sakin.zo | Product Engineering & Software Experts', 'Meet Sakin.zo, a product engineering partner creating reliable digital products through strategy, design, AI and software development.', 'software product engineering company, digital product development partner, Sakinzo company'],
    careers: ['Careers at Sakin.zo | Build Meaningful Digital Products', 'Join Sakin.zo and build meaningful AI, IoT, FinTech and custom software products with a collaborative engineering team.', 'Sakinzo careers, software developer jobs, technology careers'],
    leadership: ['Sakin.zo Leadership | Product & Engineering Experts', 'Meet the leaders guiding Sakin.zo product strategy, engineering excellence and long-term client success.', 'Sakinzo leadership, software engineering leaders'],
    'ai-development': ['AI Development Company | Custom AI Solutions | Sakin.zo', 'Build practical custom AI solutions that automate work, improve decisions and create better digital experiences with Sakin.zo.', 'AI development company, custom AI solutions, machine learning development, AI software company'],
    'ai-agent-development': ['AI Agent Development Services | Sakin.zo', 'Sakin.zo builds secure AI agents that connect business knowledge, tools and workflows with reliable human oversight.', 'AI agent development company, custom AI agents, business automation agents'],
    'iot-development': ['IoT Development Services & Connected Platforms | Sakin.zo', 'End-to-end IoT development from device integration and cloud platforms to monitoring, analytics and connected applications.', 'IoT development company, IoT software development, connected device platform, IoT cloud services'],
    'fintech-development': ['FinTech Software Development Company | Sakin.zo', 'Secure FinTech software, digital wallets, payment systems and financial platforms engineered for trust and growth.', 'fintech software development company, payment app development, digital wallet development'],
    'blockchain-development': ['Blockchain Development Company | Sakin.zo', 'Build secure blockchain products, smart contracts and Web3 applications around clear business value with Sakin.zo.', 'blockchain development company, smart contract development, Web3 development services'],
    'ecommerce-development': ['eCommerce Development Company & Platforms | Sakin.zo', 'High-performance eCommerce platforms and connected shopping experiences designed to convert and scale.', 'ecommerce development company, custom ecommerce platform, online store development'],
    'full-cycle-development': ['Full-Cycle Software Product Development | Sakin.zo', 'One experienced Sakin.zo team for product discovery, UX design, software engineering, launch and continuous growth.', 'full cycle software development, product development company, custom application development'],
    blog: ['Software, AI & IoT Insights | Sakin.zo Blog', 'Practical Sakin.zo insights on software engineering, AI, IoT, product strategy and digital transformation.', 'software development blog, AI insights, IoT insights, product engineering'],
    news: ['Sakin.zo News | Company & Technology Updates', 'Read the latest Sakin.zo company news, partnerships, technology updates and team milestones.', 'Sakinzo news, technology company updates'],
    opensource: ['Open Source Software by Sakin.zo', 'Explore open source tools, reference projects and engineering knowledge from the Sakin.zo team.', 'Sakinzo open source, software engineering tools'],
    project: ['Software Project Case Study | Sakin.zo', 'Explore a Sakin.zo software project, its business challenge, solution, technology and product experience.', 'software development case study, custom software project, digital product case study']
  };
  const storyPages = ['ev-charging','market-access','multi-currency-wallet','iot-cloud-platform','smart-hvac'];
  const config = pages[slug] || (storyPages.includes(slug)
    ? [`${document.title.replace(/\s*\|.*$/, '')} Case Study | Sakin.zo`, 'Explore how Sakin.zo combines product strategy, design and software engineering to deliver measurable business outcomes.', 'software development case study, digital transformation case study, Sakinzo projects']
    : [document.title || 'Sakin.zo', 'Sakin.zo creates AI, IoT, FinTech and custom software products that transform businesses.', 'Sakinzo, custom software development, product engineering']);

  const upsertMeta = (key, value, property) => {
    if (!value) return;
    const attr = property ? 'property' : 'name';
    let el = document.head.querySelector(`meta[${attr}="${key}"]`);
    if (!el) { el = document.createElement('meta'); el.setAttribute(attr, key); document.head.appendChild(el); }
    el.setAttribute('content', value);
  };
  const cleanPath = /^(index\.html)?$/i.test(file) ? location.pathname.replace(/index\.html$/i, '') : location.pathname;
  const projectId = slug === 'project' ? new URLSearchParams(location.search).get('id') : '';
  const canonicalUrl = `${location.origin}${cleanPath}${projectId ? `?id=${encodeURIComponent(projectId)}` : ''}`;
  document.title = config[0];
  upsertMeta('description', config[1]);
  upsertMeta('keywords', config[2]);
  upsertMeta('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
  upsertMeta('googlebot', 'index, follow, max-image-preview:large, max-snippet:-1');
  upsertMeta('og:type', slug === 'index' ? 'website' : 'article', true);
  upsertMeta('og:site_name', 'Sakin.zo', true);
  upsertMeta('og:title', config[0], true);
  upsertMeta('og:description', config[1], true);
  upsertMeta('og:url', canonicalUrl, true);
  upsertMeta('twitter:card', 'summary');
  upsertMeta('twitter:title', config[0]);
  upsertMeta('twitter:description', config[1]);
  let canonical = document.head.querySelector('link[rel="canonical"]');
  if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical); }
  canonical.href = canonicalUrl;

  if (slug === 'index') {
    const data = {
      '@context': 'https://schema.org',
      '@graph': [
        { '@type': 'Organization', '@id': `${location.origin}/#organization`, name: 'Sakin.zo', alternateName: 'Sakinzo', url: canonicalUrl, logo: `${location.origin}${cleanPath}favicon.svg`, email: 'hello@sakinzo.com', description: config[1], sameAs: ['https://www.linkedin.com/company/sakinzo'] },
        { '@type': 'WebSite', '@id': `${location.origin}/#website`, url: canonicalUrl, name: 'Sakin.zo', alternateName: 'Sakinzo', publisher: { '@id': `${location.origin}/#organization` }, inLanguage: 'en' },
        { '@type': 'ProfessionalService', name: 'Sakin.zo Software Development', url: canonicalUrl, image: `${location.origin}${cleanPath}favicon.svg`, description: config[1], serviceType: ['Custom Software Development','AI Development','IoT Development','FinTech Development','Blockchain Development','eCommerce Development'] }
      ]
    };
    const script = document.createElement('script'); script.type = 'application/ld+json'; script.textContent = JSON.stringify(data); document.head.appendChild(script);
  }
})();
