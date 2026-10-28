(function () {
  const services = window.SakinzoServices;
  if (!services?.length) return;
  const groups = [...new Set(services.map(service => service.group))];
  const slug = (location.pathname.split('/').pop() || '').replace(/\.html$/, '');
  const escape = text => String(text).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const links = items => items.map(service => `<a href="${service.href}"${slug === service.slug ? ' aria-current="page"' : ''}>${escape(service.name)}</a>`).join('');
  const all = `<a class="service-menu-all" href="services.html"${slug === 'services' ? ' aria-current="page"' : ''}>Explore all services <span aria-hidden="true">↗</span></a>`;
  document.querySelectorAll('header .ndrop,header .nav-group').forEach(group => {
    const button = group.querySelector('.nbtn,.nav-btn'), menu = group.querySelector('.drop,.dropdown');
    if (!button || !menu || button.textContent.trim() !== 'Services') return;
    group.classList.add('service-nav-group'); menu.classList.add('service-menu');
    button.setAttribute('aria-haspopup', 'true');
    menu.innerHTML = `${all}<div class="service-menu-columns">${groups.map(name => `<div><p class="service-menu-label">${escape(name)}</p>${links(services.filter(service => service.group === name))}</div>`).join('')}</div>`;
  });
  document.querySelectorAll('.mob-item,.mobile-nav-group').forEach(group => {
    const button = group.querySelector('.mob-link,.mobile-nav-toggle'), menu = group.querySelector('.mob-sub,.mobile-nav-items');
    if (button?.textContent.trim() !== 'Services' || !menu) return;
    menu.innerHTML = `${all}${groups.map(name => `<p class="service-mobile-label">${escape(name)}</p>${links(services.filter(service => service.group === name))}`).join('')}`;
  });
  // Footer service columns use the same destinations and include the directory.
  document.querySelectorAll('.ft-col,.fnav-col').forEach(column => {
    const title = column.querySelector('.ft-col-ttl,h4');
    if (title?.textContent.trim() !== 'Services') return;
    const container = column.querySelector('.ft-col-links') || column;
    container.querySelectorAll('a').forEach(link => {
      const name = link.textContent.trim().toLowerCase();
      const service = services.find(service => service.name.toLowerCase() === name) || ({ 'iot development': services.find(service => service.slug === 'iot-development'), 'ecommerce': services.find(service => service.slug === 'ecommerce-development'), 'full-cycle dev': services.find(service => service.slug === 'full-cycle-development') })[name];
      if (service) link.href = service.href;
    });
    if (!container.querySelector('a[href="services.html"]')) {
      const link = document.createElement('a'); link.href = 'services.html'; link.textContent = 'All services'; container.append(link);
    }
  });
})();
