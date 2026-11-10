(() => {
  'use strict';
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#main-nav');
  function closeMenu(returnFocus = false) {
    nav.classList.remove('is-open');
    menu.setAttribute('aria-expanded', 'false');
    if (returnFocus) menu.focus();
  }
  menu?.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
  });
  nav?.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu?.getAttribute('aria-expanded') === 'true') closeMenu(true);
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.site-header') && nav?.classList.contains('is-open')) closeMenu();
  });

  const motionButton = document.querySelector('.motion-toggle');
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let storedMotion;
  try { storedMotion = localStorage.getItem('lily-motion'); } catch { /* Storage is optional. */ }
  let paused = storedMotion === 'off' || motionQuery.matches;
  function applyMotion() {
    const isPaused = paused || motionQuery.matches;
    document.documentElement.classList.toggle('motion-off', isPaused);
    document.dispatchEvent(new Event('site-motion-change'));
    if (motionButton) {
      motionButton.querySelector('.motion-state').textContent = isPaused ? 'OFF' : 'ON';
      motionButton.setAttribute('aria-pressed', String(isPaused));
      motionButton.setAttribute('aria-label', window.siteLanguage.text(isPaused ? 'motionOn' : 'motionOff'));
      motionButton.disabled = motionQuery.matches;
      if (motionQuery.matches) motionButton.setAttribute('aria-label', window.siteLanguage.text('motionSystem'));
    }
  }
  applyMotion();
  document.addEventListener('languagechange', applyMotion);
  motionQuery.addEventListener('change', applyMotion);
  motionButton?.addEventListener('click', () => {
    paused = !paused;
    try { localStorage.setItem('lily-motion', paused ? 'off' : 'on'); } catch { /* Storage is optional. */ }
    applyMotion();
  });

  const main = document.querySelector('#main');
  let refreshJournal, restoreJournalQuery;
  function mountJournal() {
    refreshJournal = null;
    restoreJournalQuery = null;
    const filters = [...main.querySelectorAll('[data-filter]')];
    const search = main.querySelector('#journal-search');
    if (!search) return;
    const entries = [...main.querySelectorAll('.journal-entry')];
    const status = main.querySelector('.filter-status');
    const empty = main.querySelector('.empty-state');
    let active;
    function filterEntries(updateUrl = true) {
      const term = search.value.trim().toLocaleLowerCase();
      let count = 0;
      for (const entry of entries) {
        const matchesTopic = active === 'all' || entry.dataset.topics.split('|').includes(active);
        const matchesSearch = `${entry.dataset.search} ${entry.dataset.topics}`.toLocaleLowerCase().includes(term);
        entry.hidden = !(matchesTopic && matchesSearch);
        if (!entry.hidden) count++;
      }
      filters.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === active)));
      status.textContent = window.siteLanguage.text(count === 1 ? 'entry' : 'entries').replace('{count}', count);
      empty.hidden = count !== 0;
      if (updateUrl) {
        const url = new URL(location.href);
        active === 'all' ? url.searchParams.delete('topic') : url.searchParams.set('topic', active);
        term ? url.searchParams.set('q', search.value.trim()) : url.searchParams.delete('q');
        history.replaceState(null, '', url);
      }
    }
    filters.forEach(button => button.addEventListener('click', () => { active = button.dataset.filter; filterEntries(); }));
    search.addEventListener('input', () => filterEntries());
    refreshJournal = () => filterEntries(false);
    restoreJournalQuery = () => {
      const query = new URLSearchParams(location.search);
      active = query.get('topic') || 'all';
      if (!filters.some(button => button.dataset.filter === active)) active = 'all';
      search.value = query.get('q') || '';
      refreshJournal();
    };
    restoreJournalQuery();
  }

  mountJournal();
  document.addEventListener('languagechange', () => refreshJournal?.());
  document.addEventListener('site-page-change', mountJournal);

  if (!main.hasAttribute('data-tab-view')) return;

  const header = document.querySelector('.site-header');
  const tabLinks = Array.from(header.querySelectorAll('[data-tab-link]'));
  const tabPaths = new Set(tabLinks.map(link => new URL(link.href).pathname));
  const positions = new Map();
  let visiblePath = location.pathname;
  let pending;

  async function showTab(url, push) {
    pending?.abort();
    const request = new AbortController();
    pending = request;
    positions.set(visiblePath, window.scrollY);

    try {
      const response = await fetch(url, { signal: request.signal });
      if (!response.ok || new URL(response.url).origin !== location.origin) throw new Error('Tab request failed');
      const nextPage = new DOMParser().parseFromString(await response.text(), 'text/html');
      const nextMain = nextPage.querySelector('#main[data-tab-view]');
      if (!nextMain) throw new Error('Tab content is missing');
      if (request.signal.aborted) return;

      if (push) {
        url.searchParams.set('lang', window.siteLanguage.current);
        history.pushState(null, '', url);
      }
      visiblePath = url.pathname;
      document.dispatchEvent(new Event('site-page-leave'));
      window.siteLanguage.translatePage(nextMain);
      main.replaceChildren(...nextMain.childNodes);
      document.title = nextPage.title;
      for (const selector of ['link[rel="canonical"]', 'meta[name="description"]', 'meta[property^="og:"]', 'meta[name^="twitter:"]']) {
        document.head.querySelectorAll(selector).forEach(element => element.remove());
        document.head.append(...nextPage.head.querySelectorAll(selector));
      }
      for (const link of nav.querySelectorAll('[data-tab-link]')) {
        if (new URL(link.href).pathname === visiblePath) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
      }

      document.dispatchEvent(new Event('site-page-change'));
      main.focus({ preventScroll: true });
      const anchor = url.hash && document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (anchor) anchor.scrollIntoView({ behavior: 'instant' });
      else window.scrollTo({ top: push ? 0 : positions.get(visiblePath) || 0, behavior: 'instant' });
    } catch {
      if (!request.signal.aborted) {
        if (push && url.href !== location.href) location.assign(url);
        else location.reload();
      }
    } finally {
      if (pending === request) pending = null;
    }
  }

  header.addEventListener('click', event => {
    const link = event.target.closest('[data-tab-link]');
    if (!link || event.defaultPrevented || event.button !== 0 ||
        event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const url = new URL(link.href);
    if (url.origin !== location.origin) return;
    event.preventDefault();
    if (url.href !== location.href || url.pathname !== visiblePath) showTab(url, true);
    else {
      pending?.abort();
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  });

  window.addEventListener('popstate', () => {
    pending?.abort();
    const url = new URL(location.href);
    if (!tabPaths.has(url.pathname) && url.pathname !== visiblePath) {
      location.reload();
      return;
    }
    if (url.searchParams.has('lang') && url.searchParams.get('lang') !== window.siteLanguage.current) {
      url.searchParams.set('lang', window.siteLanguage.current);
      history.replaceState(null, '', url);
    }
    if (url.pathname === visiblePath) restoreJournalQuery?.();
    else showTab(url, false);
  });
})();
