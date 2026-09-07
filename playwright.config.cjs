const { defineConfig } = require('@playwright/test');
module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  use: {
    baseURL: 'http://127.0.0.1:4175',
    browserName: 'chromium',
    launchOptions: process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {},
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'python3 -m http.server 4175 --bind 127.0.0.1 --directory _site',
    url: 'http://127.0.0.1:4175',
    reuseExistingServer: false,
    stdout: 'ignore',
    stderr: 'ignore',
  },
});
