const root = document.querySelector('.article-browser');
const form = document.querySelector('#article-search');
const results = document.querySelector('#search-results');
const status = document.querySelector('#search-status');
const prev = document.querySelector('#results-prev');
const next = document.querySelector('#results-next');
const pageLabel = document.querySelector('#results-page');
const fields = ['q', 'topic', 'tag', 'year', 'sort'];
let engine, facets, page = 1, generation = 0, timer;
const size = 10;
function restore() {
  const params = new URLSearchParams(location.search);
  fields.forEach(key => { form.elements[key].value = params.get(key) || (key === 'sort' ? 'auto' : ''); });
  page = Math.max(1, Number.parseInt(params.get('page'), 10) || 1);
}
function save(push) {
  const url = new URL(location.href);
  url.search = '';
  fields.forEach(key => { const value = form.elements[key].value.trim(); if (value && value !== 'auto') url.searchParams.set(key, value); });
  if (page > 1) url.searchParams.set('page', page);
  if (url.href !== location.href) history[push ? 'pushState' : 'replaceState']({}, '', url);
}
function element(tag, text, className) {
  const node = document.createElement(tag); node.textContent = text;
  if (className) node.className = className;
  return node;
}
async function search(push = false) {
  const current = ++generation;
  results.setAttribute('aria-busy', 'true');
  status.textContent = 'Searching…';
  prev.hidden = next.hidden = pageLabel.hidden = true;
  save(push);
  try {
    const q = form.elements.q.value.trim();
    const filters = {};
    ['topic', 'tag', 'year'].forEach(key => { if (form.elements[key].value) filters[key] = form.elements[key].value; });
    const options = { filters };
    const sort = form.elements.sort.value;
    if (sort !== 'auto' || !q) options.sort = { date: sort === 'oldest' ? 'asc' : 'desc' };
    const response = await engine.search(q || null, options);
    if (current !== generation) return;
    const pages = Math.max(1, Math.ceil(response.results.length / size));
    page = Math.min(page, pages); save(false);
    const data = await Promise.all(response.results.slice((page - 1) * size, page * size).map(r => r.data()));
    if (current !== generation) return;
    results.replaceChildren();
    data.forEach(item => {
      const article = element('article', '', 'search-result');
      article.append(element('p', item.meta.date || '', 'post-meta'));
      const heading = element('h2', ''); const link = element('a', item.meta.title);
      link.href = item.url; heading.append(link); article.append(heading);
      const excerpt = element('p', '');
      // Pagefind's excerpt is HTML-escaped, with search matches wrapped in <mark>.
      if (!q && item.meta.description) excerpt.textContent = item.meta.description;
      else excerpt.innerHTML = item.excerpt;
      article.append(excerpt);
      results.append(article);
    });
    const total = response.results.length;
    status.textContent = total ? `${total} article${total === 1 ? '' : 's'} · Page ${page} of ${pages}` : 'No articles found. Try another search or reset the filters.';
    ['topic', 'tag', 'year'].forEach(key => {
      for (const option of form.elements[key].options) {
        if (option.value) option.textContent = `${option.value} (${response.filters?.[key]?.[option.value] || 0})`;
      }
    });
    prev.hidden = page <= 1; next.hidden = page >= pages; pageLabel.hidden = pages <= 1;
    pageLabel.textContent = `${page} / ${pages}`;
  } catch (error) {
    if (current !== generation) return;
    results.replaceChildren(); status.textContent = 'Search is unavailable right now. Please try again or browse articles from Home.';
    console.error('Article search failed', error);
  } finally { if (current === generation) results.setAttribute('aria-busy', 'false'); }
}
form.addEventListener('submit', event => { event.preventDefault(); clearTimeout(timer); page = 1; if (engine) search(true); });
form.addEventListener('input', event => {
  if (event.target.name !== 'q') return;
  clearTimeout(timer); ++generation;
  timer = setTimeout(() => { page = 1; if (engine) search(false); }, 250);
});
form.addEventListener('change', event => { if (event.target.tagName === 'SELECT') { clearTimeout(timer); page = 1; if (engine) search(true); } });
form.addEventListener('reset', () => { clearTimeout(timer); setTimeout(() => { page = 1; if (engine) search(true); }, 0); });
prev.addEventListener('click', () => { page--; search(true); });
next.addEventListener('click', () => { page++; search(true); });
window.addEventListener('popstate', () => { clearTimeout(timer); restore(); if (engine) search(); });
try {
  engine = await import(root.dataset.searchBundle);
  facets = await engine.filters();
  for (const key of ['topic', 'tag', 'year']) {
    for (const value of Object.keys(facets[key] || {}).sort()) {
      const option = element('option', `${value} (${facets[key][value]})`); option.value = value; form.elements[key].append(option);
    }
  }
  restore(); await search();
} catch (error) {
  status.textContent = 'Search is unavailable right now. You can browse articles from Home.';
  results.setAttribute('aria-busy', 'false'); console.error('Search initialization failed', error);
}
