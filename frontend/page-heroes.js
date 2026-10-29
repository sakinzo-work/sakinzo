(function () {
  const catalog = window.SakinzoPageCovers;
  if (!catalog) return;
  const rawSlug = document.body.dataset.page || (location.pathname.split('/').pop() || 'index.html').replace(/\.html$/, '');
  const slug = catalog.aliases[rawSlug] || rawSlug;
  if (slug === 'index') { document.querySelector('.hero')?.classList.add('home-hero-photo'); return; }
  // Service templates already render their own cover images.
  if (slug === 'services' || window.SakinzoServices?.some(service => service.slug === slug)) return;
  function safeImage(value) {
    try {
      const url = new URL(value, location.href);
      if (/^https?:$/.test(url.protocol) || (url.protocol === 'data:' && /^data:image\//i.test(value))) return url.href;
    } catch {}
  }
  function refresh() {
    const hero = document.querySelector('.hero,.hero-band');
    if (!hero) return;
    const details = window.SAKINZO_HERO_COVER || {};
    const cover = catalog.get(slug, details);
    if (!cover) return;
    const fallback = catalog.get(slug, { category: details.category });
    const src = safeImage(cover.image) || safeImage(fallback.image);
    let image = hero.querySelector(':scope > .page-hero-image');
    if (!image) {
      image = document.createElement('img'); image.className = 'page-hero-image'; image.alt = '';
      image.fetchPriority = 'high'; image.decoding = 'async'; image.width = cover.width; image.height = cover.height;
      image.addEventListener('error', () => {
        const replacement = safeImage(fallback.image);
        if (image.src !== replacement) { image.dataset.failedImage = image.src; image.src = replacement; refresh(); }
      });
      hero.prepend(image);
    }
    if (image.src !== src && image.dataset.failedImage !== src) image.src = src;
    hero.classList.add('page-hero-photo'); hero.dataset.heroPage = slug;
    hero.style.setProperty('--page-cover-fit', cover.fit || 'cover');
    hero.style.setProperty('--page-cover-position', cover.position || 'right center');
    hero.style.setProperty('--page-cover-mobile-position', cover.mobilePosition || '78% center');
    const header = document.querySelector('header');
    const inset = header && getComputedStyle(header).position === 'fixed' ? Math.max(0, header.offsetHeight - hero.getBoundingClientRect().top - scrollY) : 0;
    hero.style.setProperty('--page-hero-top-inset', `${inset}px`);
    if (['project', 'blog'].includes(slug) && /^https?:/.test(image.src) && document.querySelector('meta[property="og:image"]')?.content !== image.src) {
      window.SakinzoSEO?.updatePage({ image: image.src });
    }
  }
  let queued = false;
  const schedule = () => {
    if (queued) return;
    queued = true; requestAnimationFrame(() => { queued = false; refresh(); });
  };
  // Blog and project content arrives asynchronously and replaces its hero.
  new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true });
  addEventListener('resize', schedule);
  window.SakinzoPageHeroes = { refresh };
  refresh();
})();
