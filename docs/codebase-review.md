# Codebase consolidation — 2026-09-07

## Scope and skill

Reviewed the current Jekyll configuration, layouts, homepage and article browser, JavaScript, CSS, publishing workflow, Ruby compatibility shim, and dependency setup. Article prose and existing post URLs are outside this cleanup.

Applied Matt Pocock's **codebase-design** skill, including its deepening reference, from https://github.com/mattpocock/skills at commit `3cca18b368ae95cdbdebbff572ccafa662551015`. Installed as `matt-pocock-codebase-design` for future sessions. The official code-review workflow is intended for comparing a supplied baseline and spec; this task is a current-codebase consolidation, not that separate workflow.

The useful principle here is locality: changes to one feature should mostly stay inside that module. Search, pagination, and consent already have distinct responsibilities, so they remain independent modules instead of gaining a generic frontend framework or a shared application state layer. Browser events are their public interfaces; tests exercise the rendered website and mock only the external Google script.

## Findings and changes

1. **Search startup lost user input.** URL restoration happened after the asynchronous index load. A delayed-index browser test reproduced the failure. Restore URL state before loading and preserve reader changes during initialization. Keep readiness explicit so partial initialization cannot launch requests. Separate result rendering from asynchronous request handling.
2. **Duplicate title elements and old canonical host.** The shared layout and SEO plugin both emitted titles. Let the SEO plugin own metadata; align the canonical host with `CNAME`. Set the site timezone explicitly to keep date rendering consistent locally and in CI.
3. **Scattered shared markup and configuration.** Extract header, footer, consent banner, pagination, and script loading into focused includes. Move post JavaScript out of Liquid markup. Keep analytics ID and consent lifetime in site configuration and render the same values in the banner and privacy notice.
4. **CSS accumulated compressed rules and follow-up overrides.** Format CSS and JS consistently; gather search styles together and merge duplicate select rules. Preserve the current visual design, custom dropdown arrows, focus states, and mobile breakpoints.
5. **Cache policy varied between assets.** All application scripts now use one versioned include, matching the existing stylesheet versioning.
6. **Checks lived outside the repository.** Add pinned Prettier and Playwright dependencies, reader-facing regression checks, one build orchestrator, and CI execution before artifact upload. Exclude tooling, docs, and test output from the published site.
7. **Pagination loop scaled with the whole archive.** Render only the nearby page-number window plus first and last, instead of iterating over all pages for every generated listing.

## Verification

The baseline reproduced lost search input and duplicate title elements. The final checks cover delayed initialization, filtering, sorting, URL restoration, desktop/mobile pagination and browser history, analytics gating and withdrawal across tabs, external article links, canonical metadata, and narrow-screen layout. Google script responses are intercepted: these checks validate the site's integration, not delivery into a Google Analytics account.

## Deliberate limits

- Keep Jekyll, Liquid, and vanilla JavaScript; a TypeScript/framework migration would add setup without solving a demonstrated problem here.
- Keep the Ruby compatibility shim until the locked Liquid dependency no longer needs it.
- No claim of 100,000-post scalability: static page generation, index size, and large tag lists still require benchmarking.
- Browser checks use Chromium; a Safari/Firefox matrix can be added if real cross-browser problems justify it.
- The checks reference existing sample articles. If those articles are removed or substantially renamed, update the examples.
- The consent mechanism is not a legal certification; the analytics account's retention and data-sharing settings remain outside this repository.
