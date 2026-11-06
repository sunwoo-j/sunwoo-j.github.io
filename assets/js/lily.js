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

  const filters = [...document.querySelectorAll('[data-filter]')];
  const search = document.querySelector('#journal-search');
  if (!search) return;
  const entries = [...document.querySelectorAll('.journal-entry')];
  const status = document.querySelector('.filter-status');
  const empty = document.querySelector('.empty-state');
  const query = new URLSearchParams(location.search);
  let active = query.get('topic') || 'all';
  if (!filters.some(button => button.dataset.filter === active)) active = 'all';
  search.value = query.get('q') || '';
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
  document.addEventListener('languagechange', () => filterEntries(false));
  filterEntries(false);
})();
