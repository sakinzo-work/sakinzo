/* Shared public-site translation. No API keys or submitted form values belong here. */
(function () {
  'use strict';
  const scriptUrl = new URL(document.currentScript.src, location.href);
  const assetRoot = new URL('.', scriptUrl);
  const apiBase = (window.API_BASE || (typeof API_BASE !== 'undefined' ? API_BASE : '') || 'https://sakinzo.onrender.com/api').replace(/\/$/, '');
  const preferenceKey = 'sakinzo.language';
  const proxy = location.hostname.endsWith('.translate.goog');
  const rtl = new Set(['ar', 'arc', 'ckb', 'dv', 'fa', 'he', 'ks', 'ps', 'sd', 'ug', 'ur', 'yi']);
  const excluded = 'script,style,noscript,svg,code,pre,textarea,input,iframe,[contenteditable],.logo,.brand,[translate="no"],.notranslate,[data-no-translate]';
  const sourceRecords = new WeakMap(), schemaRecords = new WeakMap(), dictionary = new Map();
  let languages = [{ code: 'en', name: 'English' }, { code: 'hi', name: 'Hindi' }, { code: 'ur', name: 'Urdu' }];
  let nativeMode = false, current = 'en', desired = 'en', generation = 0, timer, observer, picker, trigger, panel, options, search, note, feedback;
  const normalize = code => { try { return Intl.getCanonicalLocales(code)[0] || 'en'; } catch { return 'en'; } };
  const nameFor = code => languages.find(item => item.code === code)?.name || code;
  const preferred = () => { try { return normalize(localStorage.getItem(preferenceKey) || 'en'); } catch { return 'en'; } };
  const savePreference = code => { try { localStorage.setItem(preferenceKey, code); } catch {} };
  function originalUrl() {
    if (proxy) return new URL(window.SakinzoSEO?.sourceUrl || document.querySelector('link[rel="canonical"]')?.href || assetRoot.href);
    return new URL(location.href);
  }
  function languageUrl(code) {
    const url = originalUrl();
    url.searchParams.delete('lang');
    if (code !== 'en') url.searchParams.set('lang', code);
    return url;
  }
  function externalUrl(code) {
    const source = originalUrl();
    source.searchParams.delete('lang');
    if (code === 'en') return source.href;
    const url = new URL('https://translate.google.com/translate');
    url.searchParams.set('sl', 'en'); url.searchParams.set('tl', code); url.searchParams.set('u', source.href);
    return url.href;
  }
  function isPublicUrl(url) {
    return /^https?:$/.test(url.protocol) && !/^(localhost|127\.|0\.0\.0\.0|\[::1\]|.*\.localhost$)/i.test(url.hostname);
  }
  function message(text, error = false) {
    feedback.textContent = text; feedback.dataset.error = String(error);
  }
  function positionPanel() {
    if (panel.hidden) return;
    const rect = trigger.getBoundingClientRect();
    panel.style.top = `${Math.max(8, Math.min(rect.bottom + 10, innerHeight - panel.offsetHeight - 8))}px`;
    panel.style.left = `${Math.max(12, Math.min(rect.right - panel.offsetWidth, innerWidth - panel.offsetWidth - 12))}px`;
    panel.style.right = 'auto';
  }
  function close(returnFocus = false) {
    panel.hidden = true; trigger.setAttribute('aria-expanded', 'false');
    if (returnFocus) trigger.focus();
  }
  function renderOptions() {
    const query = search.value.trim().toLocaleLowerCase();
    const list = document.createDocumentFragment();
    languages.forEach(({ code, name }) => {
      let nativeName = name;
      try { nativeName = new Intl.DisplayNames([code], { type: 'language' }).of(code) || name; } catch {}
      if (nativeName === code) nativeName = name;
      if (query && !`${name} ${nativeName} ${code}`.toLocaleLowerCase().includes(query)) return;
      const link = document.createElement('a');
      link.className = 'language-option'; link.href = nativeMode ? languageUrl(code).href : externalUrl(code);
      link.dataset.language = code; link.hreflang = code;
      link.setAttribute('aria-current', String(code === current));
      const label = document.createElement('span'); label.textContent = nativeName === name ? name : `${nativeName} · ${name}`;
      label.lang = code; label.dir = 'auto';
      const short = document.createElement('small'); short.textContent = code;
      link.append(label, short); list.append(link);
    });
    options.replaceChildren(list);
    if (!options.children.length) {
      const empty = document.createElement('p'); empty.className = 'language-empty'; empty.textContent = 'No matching languages'; options.append(empty);
    }
    note.textContent = nativeMode ? 'Translates this website, including new content as it loads.' : 'Free website translation opens in Google Translate. Availability depends on Google and your region.';
    positionPanel();
  }
  function installPicker() {
    const old = document.querySelector('header .lang,header .lang-btn');
    const header = document.querySelector('header .hdr-right,header .header-right') || document.querySelector('header .hdr-inner,header .header-wrap,header .nav') || document.querySelector('header');
    if (!header) return false;
    picker = document.createElement('div'); picker.className = 'language-picker'; picker.setAttribute('translate', 'no');
    trigger = document.createElement('button'); trigger.type = 'button'; trigger.className = 'language-trigger';
    trigger.setAttribute('aria-label', 'Change language'); trigger.setAttribute('aria-expanded', 'false'); trigger.setAttribute('aria-controls', 'site-language-panel');
    trigger.innerHTML = '<span class="language-code">EN</span><svg viewBox="0 0 10 6" fill="none" aria-hidden="true"><path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
    picker.append(trigger);
    if (old) old.replaceWith(picker);
    else header.append(picker);
    panel = document.createElement('div'); panel.className = 'language-panel'; panel.id = 'site-language-panel'; panel.hidden = true; panel.setAttribute('translate', 'no');
    panel.innerHTML = '<label for="site-language-search">Choose your language</label><input id="site-language-search" type="search" placeholder="Search languages…" autocomplete="off" aria-controls="site-language-options"><nav id="site-language-options" class="language-options" aria-label="Available languages"></nav><p class="language-note"></p>';
    search = panel.querySelector('input'); options = panel.querySelector('nav'); note = panel.querySelector('.language-note');
    feedback = document.createElement('div'); feedback.className = 'language-feedback'; feedback.setAttribute('role', 'status'); feedback.setAttribute('aria-live', 'polite'); feedback.setAttribute('translate', 'no');
    document.body.append(panel, feedback);
    trigger.addEventListener('click', () => {
      panel.hidden = !panel.hidden; trigger.setAttribute('aria-expanded', String(!panel.hidden));
      if (!panel.hidden) { search.value = ''; renderOptions(); search.focus(); }
    });
    search.addEventListener('input', renderOptions);
    panel.addEventListener('keydown', event => {
      const links = [...options.querySelectorAll('a')];
      const index = links.indexOf(document.activeElement);
      if (event.key === 'ArrowDown') { event.preventDefault(); links[(index + 1) % links.length]?.focus(); }
      if (event.key === 'ArrowUp') { event.preventDefault(); links[index <= 0 ? links.length - 1 : index - 1]?.focus(); }
    });
    options.addEventListener('click', async event => {
      const link = event.target.closest('a[data-language]'); if (!link) return;
      const code = link.dataset.language;
      if (nativeMode && !proxy) { event.preventDefault(); close(true); await setLanguage(code); }
      else if (!isPublicUrl(originalUrl()) && code !== 'en') {
        event.preventDefault(); message('Free website translation needs a public website URL. Deploy the site, or configure Cloud Translation to translate local previews.', true);
      }
    });
    document.addEventListener('click', event => { if (!picker.contains(event.target) && !panel.contains(event.target)) close(); });
    document.addEventListener('keydown', event => { if (event.key === 'Escape' && !panel.hidden) { event.preventDefault(); close(true); } });
    document.addEventListener('focusin', event => { if (!picker.contains(event.target) && !panel.contains(event.target)) close(); });
    addEventListener('resize', positionPanel); addEventListener('scroll', positionPanel, { passive: true });
    renderOptions();
    return true;
  }
  async function getJson(url, options = {}, timeout = 15000) {
    const response = await fetch(url, { ...options, signal: AbortSignal.timeout(timeout) });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Translation is temporarily unavailable. Please try again.');
    return data;
  }
  function textRecord(node, attribute) {
    const value = attribute ? node.getAttribute(attribute) : node.nodeValue;
    let records = sourceRecords.get(node);
    if (!records) { records = new Map(); sourceRecords.set(node, records); }
    let record = records.get(attribute || 'text');
    // Content set by the API or another page script becomes a new English source.
    if (!record || record.output !== value) {
      record = { source: value || '', output: value || '', node, attribute };
      records.set(attribute || 'text', record);
    }
    return record;
  }
  function collect() {
    const records = [], schemas = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: node => node.nodeValue.trim() && !node.parentElement?.closest(excluded) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT
    });
    while (walker.nextNode()) records.push(textRecord(walker.currentNode));
    document.body.querySelectorAll('[placeholder],[title],[alt],[aria-label]').forEach(node => {
      if (node.closest('[translate="no"],.notranslate,[data-no-translate],iframe,svg,[contenteditable]')) return;
      for (const attribute of ['placeholder', 'title', 'alt', 'aria-label']) if (node.getAttribute(attribute)?.trim()) records.push(textRecord(node, attribute));
    });
    if (document.querySelector('title')?.firstChild) records.push(textRecord(document.querySelector('title').firstChild));
    document.head.querySelectorAll('meta[name="description"],meta[name="keywords"],meta[property="og:title"],meta[property="og:description"],meta[name="twitter:title"],meta[name="twitter:description"],meta[property="og:image:alt"],meta[name="twitter:image:alt"]').forEach(node => records.push(textRecord(node, 'content')));
    document.querySelectorAll('script[type="application/ld+json"]').forEach(node => {
      try {
        let row = schemaRecords.get(node);
        if (!row || row.output !== node.textContent) { row = { source: JSON.parse(node.textContent), output: node.textContent }; schemaRecords.set(node, row); }
        const value = JSON.parse(JSON.stringify(row.source));
        function visit(object, parentKey) {
          if (!object || typeof object !== 'object') return;
          for (const [key, item] of Object.entries(object)) {
            const translatable = ['name', 'description', 'headline', 'text', 'serviceType', 'areaServed'].includes(key) || Array.isArray(object) && ['serviceType', 'knowsAbout'].includes(parentKey);
            if (typeof item === 'string' && translatable && !(['Person', 'Organization', 'WebSite'].includes(object['@type']) && key === 'name')) {
              records.push({ source: item, output: item, apply: text => { object[key] = text; } });
            } else if (item && typeof item === 'object') visit(item, key);
          }
          if (object['@type']) object.inLanguage = current;
        }
        visit(value); schemas.push({ node, row, value });
      } catch { /* Ignore third-party structured data that is not valid JSON. */ }
    });
    return { records, schemas };
  }
  function parts(text) {
    const result = []; let remaining = text.trim();
    while (remaining.length > 4000) {
      let end = remaining.lastIndexOf(' ', 4000); if (end < 1000) end = 4000;
      // Never cut a Unicode surrogate pair in half.
      if (/[\uD800-\uDBFF]/.test(remaining[end - 1])) end--;
      result.push(remaining.slice(0, end)); remaining = remaining.slice(end).trimStart();
    }
    if (remaining) result.push(remaining); return result;
  }
  const hasWords = text => /\p{L}/u.test(text) && !/^(https?:\/\/|[^\s@]+@[^\s@]+\.[^\s@]+$)/i.test(text);
  function watch() {
    observer.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['placeholder', 'title', 'alt', 'aria-label'] });
    observer.observe(document.head, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['content'] });
  }
  function rewriteLinks(code) {
    document.querySelectorAll('a[href]').forEach(link => {
      if (link.closest('[translate="no"],.notranslate,[data-no-translate]') || link.hasAttribute('download')) return;
      const href = link.getAttribute('href'); if (!href || href.startsWith('#')) return;
      try {
        const url = new URL(href, location.href);
        if (url.origin !== location.origin || !url.pathname.startsWith(assetRoot.pathname) || !/(?:\/|\.html)$/.test(url.pathname) || /\/(admin|ad|google[^/]*)\.html$/.test(url.pathname)) return;
        if (code === 'en') url.searchParams.delete('lang'); else url.searchParams.set('lang', code);
        link.href = url.href;
      } catch {}
    });
  }
  function applyLocale(code, updateHistory = true) {
    current = code; document.documentElement.lang = code;
    document.documentElement.dir = rtl.has(code.split('-')[0]) ? 'rtl' : 'ltr';
    trigger.querySelector('.language-code').textContent = code.toUpperCase();
    trigger.setAttribute('aria-label', `Change language: ${nameFor(code)}`);
    rewriteLinks(code);
    if (updateHistory) history.replaceState(null, '', languageUrl(code));
    window.SakinzoSEO?.setLocale(code, nativeMode ? languages.map(item => item.code) : ['en']);
    renderOptions();
    document.dispatchEvent(new CustomEvent('sakinzo:languagechange', { detail: { language: code } }));
  }
  async function translatePage(code, run) {
    const snapshot = collect();
    const cache = dictionary.get(code) || new Map(); dictionary.set(code, cache);
    const needed = [...new Set(snapshot.records.flatMap(row => parts(row.source)).filter(text => hasWords(text) && !cache.has(text)))];
    if (code !== 'en') {
      for (let i = 0; i < needed.length;) {
        const batch = []; let size = 0;
        while (i < needed.length && batch.length < 100 && size + needed[i].length <= 18000) { size += needed[i].length; batch.push(needed[i++]); }
        if (run !== generation) return;
        const data = await getJson(`${apiBase}/i18n/translate`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ target: code, texts: batch }) }, 20000);
        if (!Array.isArray(data.translations) || data.translations.length !== batch.length || data.translations.some(text => typeof text !== 'string' || !text.trim())) throw new Error('The translation service returned an incomplete page. Please try again.');
        batch.forEach((text, index) => cache.set(text, data.translations[index]));
      }
    }
    if (run !== generation) return;
    observer.disconnect();
    try {
      snapshot.records.forEach(row => {
        const text = code === 'en' ? row.source : row.source.replace(/\S[\s\S]*\S|\S/, source => parts(source).map(part => cache.get(part) || part).join(' '));
        if (row.apply) row.apply(text);
        else if (row.attribute) {
          if (row.node.getAttribute(row.attribute) !== row.output) return;
          row.node.setAttribute(row.attribute, text); row.output = text;
        } else {
          if (row.node.nodeValue !== row.output) return;
          row.node.nodeValue = text; row.output = text;
        }
      });
      snapshot.schemas.forEach(({ node, row, value }) => {
        function locale(object) { if (!object || typeof object !== 'object') return; if (object['@type']) object.inLanguage = code; Object.values(object).forEach(locale); }
        locale(value); node.textContent = JSON.stringify(value); row.output = node.textContent;
      });
      applyLocale(code);
      snapshot.schemas.forEach(({ node, row }) => { row.output = node.textContent; });
    } finally { watch(); }
  }
  async function setLanguage(code, persist = true) {
    code = normalize(code);
    if (!languages.some(item => item.code === code)) { message('This language is not supported. Choose a language from the list.', true); return false; }
    const run = ++generation;
    desired = code;
    clearTimeout(timer);
    message(code === 'en' ? '' : `Translating the website into ${nameFor(code)}…`);
    trigger.setAttribute('aria-busy', 'true');
    try {
      await translatePage(code, run);
      if (run !== generation) return false;
      if (persist) savePreference(code);
      message(''); return true;
    } catch (error) {
      if (run !== generation) return false;
      clearTimeout(timer);
      // Restore the complete source page instead of leaving a partially translated page.
      await translatePage('en', run);
      desired = 'en';
      message(error.message || 'Translation is unavailable. Please try again.', true); return false;
    } finally { if (run === generation) trigger.removeAttribute('aria-busy'); }
  }
  async function init() {
    if (!installPicker()) return;
    const fallback = getJson(new URL('languages.json', assetRoot), {}, 5000).catch(() => languages);
    const service = proxy ? Promise.resolve(null) : getJson(`${apiBase}/i18n/languages`, {}, 5000).catch(() => null);
    const [localLanguages, remote] = await Promise.all([fallback, service]);
    nativeMode = Boolean(remote?.configured && Array.isArray(remote.languages) && remote.languages.length);
    const list = nativeMode ? remote.languages : localLanguages;
    languages = [...new Map(list.map(item => [normalize(item.code), { code: normalize(item.code), name: item.name }])).values()].sort((a, b) => a.code === 'en' ? -1 : b.code === 'en' ? 1 : a.name.localeCompare(b.name));
    const query = new URLSearchParams(location.search);
    observer = new MutationObserver(mutations => {
      if (!nativeMode || desired === 'en') return;
      if (mutations.every(mutation => (mutation.target.nodeType === Node.ELEMENT_NODE ? mutation.target : mutation.target.parentElement)?.closest('[translate="no"],.notranslate,[data-no-translate]'))) return;
      clearTimeout(timer); timer = setTimeout(() => setLanguage(desired, false), 150);
    });
    watch();
    if (proxy) {
      current = normalize(query.get('_x_tr_tl') || 'en');
      trigger.querySelector('.language-code').textContent = current.toUpperCase(); renderOptions();
    } else if (nativeMode) {
      const requested = normalize(query.has('lang') ? query.get('lang') : preferred());
      window.SakinzoSEO?.setLocale('en', languages.map(item => item.code));
      if (requested !== 'en') await setLanguage(requested); else renderOptions();
    } else {
      renderOptions();
      const requested = normalize(query.get('lang') || 'en');
      if (requested !== 'en' && languages.some(item => item.code === requested)) {
        if (isPublicUrl(originalUrl())) location.replace(externalUrl(requested));
        else message('Translation needs a public website URL or a configured Cloud Translation API for local previews.', true);
      }
    }
    window.SakinzoI18n = { setLanguage, get language() { return current; }, get nativeMode() { return nativeMode; }, get languages() { return languages.map(({ code, name }) => ({ code, name })); } };
    document.dispatchEvent(new CustomEvent('sakinzo:i18nready'));
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true }); else init();
})();
