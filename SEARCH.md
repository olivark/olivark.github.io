# Article search

Pagefind indexes published post HTML after Jekyll builds. No account or API key is needed.

Local build: `npm ci` then `npm run build`. Serve `_site` over HTTP to test search; `jekyll serve` alone does not generate the search index. GitHub Actions runs both build steps before publishing.

Post front matter should include `layout: post`, a `topic`, and a short list of consistent `tags`. Current topics: Projects, Swiss Life, Science & Curiosity, Learning. Topic and tag links open filtered results at `/articles/`. Existing categories remain untouched because they affect article URLs.

Only pages with `data-pagefind-body` are indexed. The post template supplies title, date sorting, topic, tag, and year filters. The search page loads ten result excerpts at a time and keeps its state in URL parameters. New articles are indexed automatically on the next build.

For a much larger archive, measure indexing duration, output size, browser search latency, and filter usability before choosing further infrastructure. The current collection is not a 100,000-post performance benchmark.
