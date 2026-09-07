const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ context }) => {
  // Never send test visits to Google, even during production-build tests.
  await context.route(/https:\/\/[^/]*(googletagmanager|google-analytics)\.com\//, (route) =>
    route.fulfill({ contentType: 'application/javascript', body: '' }),
  );
});

async function rejectAnalytics(page) {
  await page.getByRole('button', { name: 'Reject analytics', exact: true }).click();
}

test('search keeps what the reader types while the index starts', async ({ page }) => {
  let release;
  const gate = new Promise((resolve) => {
    release = resolve;
  });
  await page.route('**/pagefind/pagefind.js', async (route) => {
    await gate;
    await route.continue();
  });
  await page.goto('/articles/');
  await rejectAnalytics(page);
  await page.getByLabel('Search articles', { exact: true }).fill('beekeeping');
  release();
  await expect(page.locator('#search-status')).toContainText('1 article ·');
  await expect(page.getByLabel('Search articles', { exact: true })).toHaveValue('beekeeping');
  await expect(page.locator('.search-result h2')).toContainText('BeeHive');
});

test('search combines filters, restores shared URLs, and clears empty results', async ({
  page,
}) => {
  await page.goto('/articles/');
  await rejectAnalytics(page);
  await expect(page.locator('.search-result').first()).toBeVisible();
  const initialSummary = await page.locator('#search-status').innerText();
  const newestTitle = await page.locator('.search-result h2').first().innerText();
  await page.goto('/articles/?topic=Projects&tag=privacy');
  await expect(page.locator('.search-result h2')).toContainText('tinypdf');
  await page.reload();
  await expect(page.getByLabel('Tag', { exact: true })).toHaveValue('privacy');
  await page.getByLabel('Search articles', { exact: true }).fill('zzzznonexistent');
  await expect(page.locator('#search-status')).toContainText('No articles');
  await page.getByRole('button', { name: 'Reset filters' }).click();
  await expect(page.locator('#search-status')).toHaveText(initialSummary);
  await expect(page.getByLabel('Sort', { exact: true })).toHaveValue('newest');
  await page.getByLabel('Sort', { exact: true }).selectOption('oldest');
  await expect(page.locator('.search-result h2').first()).toContainText('RAV');
  await page.goBack();
  await expect(page.locator('.search-result h2').first()).toHaveText(newestTitle);
});

for (const width of [1280, 375]) {
  test(`pagination preserves the document and scroll position at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await rejectAnalytics(page);
    await page.locator('.pagination').scrollIntoViewIfNeeded();
    const originalDocument = await page.evaluateHandle(() => document);
    const scrollY = await page.evaluate(() => window.scrollY);
    await page.getByRole('link', { name: 'Page 2', exact: true }).click();
    await expect(page.locator('[aria-current="page"]')).toHaveText('2');
    expect(await originalDocument.evaluate((doc) => doc === document)).toBe(true);
    expect(Math.abs((await page.evaluate(() => window.scrollY)) - scrollY)).toBeLessThan(3);
    const lastLink = page.locator('.pagination a[aria-label^="Page "]').last();
    const lastPage = (await lastLink.getAttribute('aria-label')).replace('Page ', '');
    await lastLink.click();
    await expect(page.locator('[aria-current="page"]')).toHaveText(lastPage);
    const lastCount = await page.locator('.post-card').count();
    expect(lastCount).toBeGreaterThan(0);
    expect(lastCount).toBeLessThanOrEqual(2);
    await page.goBack();
    await expect(page.locator('[aria-current="page"]')).toHaveText('2');
    expect(Math.abs((await page.evaluate(() => window.scrollY)) - scrollY)).toBeLessThan(3);
  });
}

test('analytics waits for consent and withdrawal removes the running tag across tabs', async ({
  page,
  context,
}) => {
  let requests = 0;
  await context.route('https://www.googletagmanager.com/**', (route) => {
    requests++;
    return route.fulfill({
      contentType: 'application/javascript',
      body: 'document.cookie="_ga=test;path=/";',
    });
  });
  await page.goto('/');
  await rejectAnalytics(page);
  await page.reload();
  await expect(page.getByRole('button', { name: 'Cookie settings' })).toBeVisible();
  expect(requests).toBe(0);
  await page.getByRole('button', { name: 'Cookie settings' }).click();
  await page.getByRole('button', { name: 'Accept analytics', exact: true }).click();
  await expect.poll(() => requests).toBe(1);
  const second = await context.newPage();
  await second.goto('/articles/');
  await expect.poll(() => requests).toBe(2);
  await page.getByRole('button', { name: 'Cookie settings' }).click();
  await page.getByRole('button', { name: 'Reject analytics', exact: true }).click();
  await expect(page.locator('script[src*="googletagmanager"]')).toHaveCount(0);
  await expect(second.locator('script[src*="googletagmanager"]')).toHaveCount(0);
  expect((await context.cookies()).some((cookie) => cookie.name === '_ga')).toBe(false);
});

test('post links, metadata, and small-screen filters retain their behavior', async ({ page }) => {
  await page.goto('/articles/?tag=privacy');
  await rejectAnalytics(page);
  await page.getByRole('link', { name: /tinypdf: scratching/ }).click();
  await expect(page.locator('.post-body a[href="https://tinypdf.ch"]').first()).toHaveAttribute(
    'target',
    '_blank',
  );
  await expect(page.locator('head title')).toHaveCount(1);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    /^https:\/\/kevinolivar\.com\//,
  );
  await page
    .locator('.post-tags a')
    .filter({ hasText: /^privacy$/ })
    .click();
  await expect(page.locator('.search-result')).toHaveCount(1);
  await page.setViewportSize({ width: 375, height: 812 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
