(function () {
  const header = document.querySelector('[data-service-header]');
  if (!header) return;
  const hamburger = document.getElementById('hamburger'), mobile = document.getElementById('mobileMenu');
  function closeMobile() {
    hamburger.classList.remove('open'); mobile.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false'); document.body.style.overflow = '';
  }
  hamburger.addEventListener('click', () => {
    const open = hamburger.getAttribute('aria-expanded') !== 'true';
    hamburger.classList.toggle('open', open); mobile.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open)); document.body.style.overflow = open ? 'hidden' : '';
  });
  mobile.querySelectorAll('[data-mobile-toggle]').forEach(button => button.addEventListener('click', () => {
    const open = button.getAttribute('aria-expanded') !== 'true';
    button.setAttribute('aria-expanded', String(open)); button.classList.toggle('active', open); button.nextElementSibling.classList.toggle('open', open);
  }));
  mobile.addEventListener('click', event => { if (event.target.closest('a')) closeMobile(); });
  function closeDropdowns() {
    header.querySelectorAll('.ndrop').forEach(group => { group.classList.remove('open'); group.querySelector('.nbtn').setAttribute('aria-expanded', 'false'); });
  }
  header.querySelectorAll('.nbtn').forEach(button => button.addEventListener('click', event => {
    event.stopPropagation();
    const group = button.closest('.ndrop'), open = !group.classList.contains('open');
    closeDropdowns(); group.classList.toggle('open', open); button.setAttribute('aria-expanded', String(open));
  }));
  document.addEventListener('click', event => { if (!header.contains(event.target)) closeDropdowns(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') { closeDropdowns(); if (mobile.classList.contains('open')) { closeMobile(); hamburger.focus(); } } });
  matchMedia('(min-width:1025px)').addEventListener('change', event => { if (event.matches) closeMobile(); });
})();
