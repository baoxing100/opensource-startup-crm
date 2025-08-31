// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests/e2e',
  
  // Maximum time one test can run for
  timeout: 60000,
  
  // Maximum time to wait for an assertion to pass
  expect: {
    timeout: 15000
  },
  
  // Run tests in files in parallel
  fullyParallel: true,
  
  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,
  
  // Retry failed tests on CI
  retries: process.env.CI ? 2 : 0,
  
  // Number of workers
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter to use
  reporter: [
    ['html'],
    ['list']
  ],

  // Setup dev server with more resilient configuration
  webServer: {
    command: 'NODE_OPTIONS="--max-old-space-size=2048" vite dev',
    url: 'http://localhost:5173',
    timeout: 180000,
    reuseExistingServer: !process.env.CI,
    stdout: 'pipe',
    stderr: 'pipe',
    env: {
      NODE_ENV: 'test',
      PLAYWRIGHT_TEST: 'true'
    }
  },
  
  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    }
  ],

  use: {
    // Base URL to use in actions like page.goto('/')
    baseURL: 'http://localhost:5173',
    
    // Maximum time each action like click() can take
    actionTimeout: 10000,
    
    // Take screenshot only on failure
    screenshot: 'only-on-failure',
    
    // Record trace on failure
    trace: 'on-first-retry',
    
    // Record video on failure
    video: 'on-first-retry',
    
    // Enable built-in capture logs
    logger: {
      isEnabled: (name, severity) => true
    }
  }
});
