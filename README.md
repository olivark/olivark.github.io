# Kevin Olivar's website

Jekyll on GitHub Pages, with Pagefind search and small browser scripts for pagination and optional analytics. Published Markdown lives in `_posts/`.

## Local work

Use the Ruby version in `.ruby-version` and Node 22 (matching CI).

```sh
bundle install
npm ci
npm run build
python3 -m http.server 4173 --directory _site
```

Open http://localhost:4173. `npm run build:production` includes the production analytics ID; ordinary local builds do not. Both commands generate the Pagefind index. `SITE_BASEURL` optionally sets Jekyll's deployment subpath.

## Checks

```sh
npx playwright install chromium
npm run check
```

`npm run check` checks formatting, builds production output, and runs browser tests. Tests intercept Google Analytics requests so no test visits are collected. On a machine with Chrome already installed, set `CHROME_PATH` to its executable instead of downloading Chromium. The tests start a temporary local server on port 4175.

Run `npm run format` after editing JS, CSS, tooling, or YAML. Formatting deliberately excludes article prose and Liquid templates. CI uses the same build and test commands, then deploys the tested artifact.

## Where changes belong

- `_config.yml`: canonical domain, pagination, analytics ID and consent lifetime.
- `_layouts/`: page structure and post indexing metadata.
- `_includes/`: shared navigation, footer, consent markup, script loading, and pagination links.
- `assets/search.js`: search initialization, URL state, requests, and result rendering.
- `assets/pagination.js`: progressive enhancement of static pagination; ordinary links remain the fallback.
- `assets/consent.js`: consent persistence, optional analytics loading, and withdrawal.
- `assets/post.js`: external article links and back-to-top behavior.
- `assets/site.css`: styles grouped by feature, using shared CSS variables.
- `tests/`: reader-facing browser regression checks.

See [SEARCH.md](SEARCH.md) for publishing metadata and [the consolidation review](docs/codebase-review.md) for architecture decisions and limits.
