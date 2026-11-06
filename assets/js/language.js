(() => {
  'use strict';
  const data = document.getElementById('language-data');
  if (!data) return;
  const messages = JSON.parse(data.textContent);
  const supported = ['ko', 'en'];
  const translate = (key, language) => messages[key]?.[language];
  const pageLanguage = document.documentElement.lang === 'en' ? 'en' : 'ko';
  let language = pageLanguage;
  try {
    const stored = localStorage.getItem('site-language');
    if (supported.includes(stored)) language = stored;
  } catch { /* Language selection also works without storage. */ }
  const requested = new URLSearchParams(location.search).get('lang');
  if (supported.includes(requested)) language = requested;
  if (!supported.includes(requested) && pageLanguage === 'en') language = 'en';

  function alternate(language) {
    return document.querySelector(`link[rel="alternate"][hreflang="${language}"]`)?.href;
  }

  function applyLanguage(next, persist = false) {
    language = next;
    const destination = alternate(language);
    if (destination && language !== pageLanguage) {
      const url = new URL(new URL(destination).pathname, location.origin);
      url.search = location.search;
      url.searchParams.set('lang', language);
      if (persist) {
        try { localStorage.setItem('site-language', language); } catch { /* Optional storage. */ }
        location.assign(url.href);
      } else location.replace(url.href);
      return;
    }
    document.documentElement.lang = language;
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const value = translate(element.dataset.i18n, language);
      // Only this repository's static dictionary contains HTML, never URL or input data.
      if (value !== undefined) element.innerHTML = value;
    });
    ['aria-label', 'placeholder', 'alt'].forEach(attribute => {
      document.querySelectorAll(`[data-i18n-${attribute}]`).forEach(element => {
        const value = translate(element.getAttribute(`data-i18n-${attribute}`), language);
        if (value !== undefined) element.setAttribute(attribute, value);
      });
    });
    document.querySelectorAll('[data-language]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.language === language));
    });
    document.querySelectorAll('.language-switch').forEach(group => { group.hidden = false; });
    document.querySelectorAll('[data-title-ko]').forEach(element => {
      element.textContent = element.getAttribute(`data-title-${language}`);
      element.lang = language;
    });
    document.querySelectorAll('[data-href-ko]').forEach(link => {
      link.href = link.getAttribute(`data-href-${language}`);
    });
    // Preserve an explicit choice through navigation even when storage is unavailable.
    document.querySelectorAll('a[href]').forEach(link => {
      const raw = link.getAttribute('href');
      if (raw.startsWith('#')) return;
      const url = new URL(link.href, location.href);
      if (url.origin !== location.origin || !['http:', 'https:'].includes(url.protocol)) return;
      url.searchParams.set('lang', language);
      link.href = url.href;
    });
    if (persist || supported.includes(requested)) {
      try { localStorage.setItem('site-language', language); } catch { /* Optional storage. */ }
    }
    if (persist) {
      const url = new URL(location.href);
      url.searchParams.set('lang', language);
      history.replaceState(null, '', url);
    }
    const comments = document.querySelector('iframe.giscus-frame');
    comments?.contentWindow?.postMessage({ giscus: { setConfig: { lang: language } } }, 'https://giscus.app');
    document.dispatchEvent(new CustomEvent('languagechange', { detail: { language } }));
  }

  window.siteLanguage = {
    get current() { return language; },
    text(key) { return translate(key, language); }
  };
  document.querySelectorAll('[data-language]').forEach(button => {
    button.addEventListener('click', () => applyLanguage(button.dataset.language, true));
  });
  // Giscus may finish loading after the first language application.
  window.addEventListener('message', event => {
    if (event.origin !== 'https://giscus.app' || !event.data?.giscus) return;
    const frame = document.querySelector('iframe.giscus-frame');
    if (event.source === frame?.contentWindow && event.data.giscus.discussion) {
      frame.contentWindow.postMessage({ giscus: { setConfig: { lang: language } } }, 'https://giscus.app');
    }
  });
  applyLanguage(language);
})();
