(function (root, factory) {
  const catalog = factory(typeof module === 'object' && module.exports ? require('./services-data') : root.SakinzoServices || []);
  if (typeof module === 'object' && module.exports) module.exports = catalog;
  else root.SakinzoPageCovers = catalog;
})(typeof window === 'object' ? window : globalThis, function (services) {
  const asset = (file, description, width = 2172, height = 724) => ({ image: `assets/${file}`, description, width, height, fit: 'cover', position: 'right center', mobilePosition: '78% center' });
  const service = slug => services.find(item => item.slug === slug)?.cover;
  const pages = {
    index: asset('sakinzo-hero-desktop-waves.webp', 'Connected digital network waves for software product engineering', 1671, 941),
    'who-we-are': asset('page-company.webp', 'A product engineering team collaborating in a modern studio', 2167, 725),
    careers: asset('page-careers.webp', 'Software engineers learning and building together', 2170, 725),
    leadership: asset('page-leadership.webp', 'Product and engineering leaders discussing a shared roadmap', 2170, 725),
    contactus: asset('page-leadership.webp', 'A collaborative meeting to plan a software project', 2170, 725),
    'ev-charging': asset('page-ev-charging.webp', 'An electric vehicle connected to a smart charging station'),
    'market-access': service('business-analysis'),
    'multi-currency-wallet': service('fintech-development'),
    'iot-cloud-platform': service('iot-development'),
    'smart-hvac': asset('page-smart-hvac.webp', 'Connected building ventilation and intelligent temperature monitoring'),
    news: asset('page-company.webp', 'A collaborative technology team sharing ideas and company updates', 2167, 725),
    opensource: service('web-mobile-development'),
    blog: asset('page-insights.webp', 'An editorial workspace with engineering books, notes and a laptop'),
    project: service('web-mobile-development'),
    services: services[0]?.cover
  };
  const aliases = { newindex: 'index', preindex: 'index', index1: 'index', constactus2: 'contactus' };
  function categoryCover(category) {
    const text = String(category || '').toLowerCase();
    if (/hvac|climate|ventilation/.test(text)) return pages['smart-hvac'];
    if (/charging|electric vehicle/.test(text)) return pages['ev-charging'];
    if (/blockchain|web3|crypto/.test(text)) return service('blockchain-development');
    if (/fintech|financ|wallet|bank|payment/.test(text)) return service('fintech-development');
    if (/ecommerce|e-commerce|commerce|store/.test(text)) return service('ecommerce-development');
    if (/iot|robot|connected|smart home/.test(text)) return service('iot-development');
    if (/\bai\b|artificial intelligence|machine learning/.test(text)) return service('ai-development');
    if (/cloud|devops/.test(text)) return service('devops-solutions');
    if (/web|mobile|android|\bios\b|software|engineering/.test(text)) return service('web-mobile-development');
  }
  function get(slug, details = {}) {
    slug = aliases[slug] || slug;
    const cover = (['project', 'blog'].includes(slug) && categoryCover(details.category)) || service(slug) || pages[slug];
    return cover && { ...cover, ...(details.image ? { image: details.image } : {}) };
  }
  return { pages, aliases, get };
});
