// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },
  
  // Global setup will run, but we'll handle login tests differently
  globalSetup: require.resolve('./global-setup.js'),

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'authenticated-tests',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1536, height: 695 },
        screenshot: 'on',
        video: 'on',
        trace: 'on',
        channel: 'chrome',
        headless: true,
        storageState: 'authState.json', // load saved login
      },
      testIgnore: ['**/login.spec.js',], // Exclude login-related tests
    },
    {
      name: 'login-tests',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1536, height: 695 },
        screenshot: 'on',
        video: 'on',
        trace: 'on',
        channel: 'chrome',
        headless: true,
        // No storageState - starts fresh without authentication
      },
      testMatch: ['**/login.spec.js'], // Only run login/auth tests
    },

    // You can uncomment and duplicate the pattern for other browsers if needed
    // {
    //   name: 'firefox-authenticated',
    //   use: { 
    //     ...devices['Desktop Firefox'],
    //     storageState: 'authState.json',
    //   },
    //   globalSetup: require.resolve('./global-setup.js'),
    //   testIgnore: ['**/login.test.js', '**/auth.test.js'],
    // },
    // {
    //   name: 'firefox-login',
    //   use: { ...devices['Desktop Firefox'] },
    //   testMatch: ['**/login.test.js', '**/auth.test.js'],
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});