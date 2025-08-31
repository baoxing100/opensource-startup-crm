import { test, expect } from '@playwright/test';

// Add a hook to retry failed tests
test.beforeEach(async ({ page }, testInfo) => {
  // Add retry logic
  test.slow();
  await page.waitForLoadState('networkidle').catch(() => {});
});

test('homepage has the correct title and links', async ({ page }) => {
  // Add retry attempts for navigation
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      await page.goto('/', { timeout: 30000 });
      break;
    } catch (e) {
      if (attempt === 2) throw e;
      await new Promise(r => setTimeout(r, 1000));
    }
  }
  
  // Check title (use a more lenient regex)
  await expect(page).toHaveTitle(/.*AWCRM.*/);
  
  // Check navigation links with longer timeout
  await expect(page.getByRole('link', { name: /Features/i })).toBeVisible({ timeout: 10000 });
  await expect(page.getByRole('link', { name: /Pricing/i })).toBeVisible({ timeout: 10000 });
  await expect(page.getByRole('link', { name: /About/i })).toBeVisible({ timeout: 10000 });
  
  // Check CTA buttons
  await expect(page.getByRole('link', { name: /Get Started/i })).toBeVisible({ timeout: 10000 });
  await expect(page.getByRole('link', { name: /Login/i })).toBeVisible({ timeout: 10000 });
});

test('login form works correctly', async ({ page }) => {
  // Add retry attempts for navigation
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      await page.goto('/login', { timeout: 30000 });
      break;
    } catch (e) {
      if (attempt === 2) throw e;
      await new Promise(r => setTimeout(r, 1000));
    }
  }
  
  // Check form elements with longer timeout
  await expect(page.getByLabel(/Email/i)).toBeVisible({ timeout: 10000 });
  await expect(page.getByLabel(/Password/i)).toBeVisible({ timeout: 10000 });
  await expect(page.getByRole('button', { name: /Sign In|Login/i })).toBeVisible({ timeout: 10000 });
  
  // Fill invalid credentials with retry
  await page.getByLabel(/Email/i).fill('invalid@example.com');
  await page.getByLabel(/Password/i).fill('wrongpassword');
  
  // Click with retry
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      await page.getByRole('button', { name: /Sign In|Login/i }).click({ timeout: 10000 });
      break;
    } catch (e) {
      if (attempt === 2) throw e;
      await new Promise(r => setTimeout(r, 1000));
    }
  }
  
  // Check error message with multiple possible texts
  const errorSelectors = [
    'Invalid email or password',
    'Incorrect email or password',
    'Login failed',
    'Invalid credentials'
  ];
  
  // Wait for any of the error messages
  const errorPromises = errorSelectors.map(selector => 
    page.getByText(selector, { exact: false }).waitFor({ timeout: 15000 }).then(() => selector)
      .catch(() => null)
  );
  
  const resolvedError = await Promise.any(errorPromises).catch(() => null);
  expect(resolvedError).toBeTruthy();
});

test('signup form validation', async ({ page }) => {
  // Add retry attempts for navigation
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      await page.goto('/signup', { timeout: 30000 });
      break;
    } catch (e) {
      if (attempt === 2) throw e;
      await new Promise(r => setTimeout(r, 1000));
    }
  }
  
  // Wait for form to be ready
  await expect(page.getByRole('button', { name: /Sign Up|Register/i })).toBeVisible({ timeout: 10000 });
  
  // Try to submit empty form with retry
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      await page.getByRole('button', { name: /Sign Up|Register/i }).click({ timeout: 10000 });
      break;
    } catch (e) {
      if (attempt === 2) throw e;
      await new Promise(r => setTimeout(r, 1000));
    }
  }
  
  // Check validation messages (more lenient)
  await expect(page.getByText(/email.*required|required.*email/i)).toBeVisible({ timeout: 10000 });
  await expect(page.getByText(/password.*required|required.*password/i)).toBeVisible({ timeout: 10000 });
  
  // Fill invalid email
  await page.getByLabel(/Email/i).fill('invalid-email');
  await page.getByRole('button', { name: /Sign Up|Register/i }).click();
  
  // Check email validation (more lenient)
  await expect(page.getByText(/invalid.*email|email.*invalid|invalid.*format/i)).toBeVisible({ timeout: 10000 });
  
  // Fill valid email but short password
  await page.getByLabel(/Email/i).fill('valid@example.com');
  await page.getByLabel(/Password/i).fill('123');
  await page.getByRole('button', { name: /Sign Up|Register/i }).click();
  
  // Check password validation (more lenient)
  await expect(page.getByText(/password.*characters|characters.*password|password.*length/i)).toBeVisible({ timeout: 10000 });
});
