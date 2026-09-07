(() => {
  const list = document.querySelector('#article-list');
  const status = document.querySelector('#pagination-status');
  if (!list || !window.fetch || !window.history.pushState) return;
  let request;
  const state = () => ({ ...history.state, articlePagination: true, scrollX: window.scrollX, scrollY: window.scrollY });
  history.replaceState(state(), '');
  history.scrollRestoration = 'manual';
  // Save position on the active history entry, including scrolling after navigation.
  let frame;
  window.addEventListener('scroll', () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => history.replaceState(state(), ''));
  }, { passive: true });
  async function navigate(url, { pop = false, position, keyboard = false } = {}) {
    request?.abort();
    const controller = new AbortController();
    request = controller;
    const saved = position || { scrollX: window.scrollX, scrollY: window.scrollY };
    list.setAttribute('aria-busy', 'true');
    status.textContent = 'Loading articles…';
    try {
      const response = await fetch(url, { signal: controller.signal });
      if (!response.ok) throw new Error('Page unavailable');
      const html = new DOMParser().parseFromString(await response.text(), 'text/html');
      const replacement = html.querySelector('#article-list');
      if (!replacement || !replacement.querySelector('.post-grid')) throw new Error('Invalid article page');
      if (controller.signal.aborted) return;
      // Keep the space occupied by the previous page, including the shorter last page.
      list.style.minHeight = `${Math.max(list.getBoundingClientRect().height, replacement.getBoundingClientRect().height)}px`;
      list.replaceChildren(...replacement.childNodes);
      list.dataset.page = replacement.dataset.page;
      document.title = html.title;
      for (const selector of ['link[rel="canonical"]', 'meta[property="og:url"]']) {
        const old = document.querySelector(selector), fresh = html.querySelector(selector);
        if (old && fresh) old.replaceWith(fresh);
      }
      if (!pop) {
        history.replaceState(state(), '');
        history.pushState({ articlePagination: true, ...saved }, '', url);
      }
      if (keyboard) {
        const active = list.querySelector('[aria-current="page"]');
        active?.setAttribute('tabindex', '-1');
        active?.focus({ preventScroll: true });
      }
      window.scrollTo({ left: saved.scrollX, top: saved.scrollY, behavior: 'instant' });
      status.textContent = `Article page ${list.dataset.page} loaded.`;
    } catch (error) {
      if (error.name !== 'AbortError') window.location.assign(url);
    } finally {
      if (request === controller) list.removeAttribute('aria-busy');
    }
  }
  list.addEventListener('click', event => {
    const link = event.target.closest('.pagination a');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target || link.hasAttribute('download')) return;
    const url = new URL(link.href);
    if (url.origin !== location.origin) return;
    event.preventDefault();
    navigate(url.href, { keyboard: event.detail === 0 });
  });
  window.addEventListener('popstate', event => {
    if (event.state?.articlePagination) navigate(location.href, { pop: true, position: event.state });
    else location.reload();
  });
})();
