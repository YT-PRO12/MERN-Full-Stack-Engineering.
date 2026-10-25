import { test, expect } from '@playwright/test';
test('capture the real seeded marketplace at desktop and mobile sizes', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  await expect(page.getByText('6 listings found')).toBeVisible();
  if (process.env.CAPTURE_SCREENSHOTS === '1') {
    await page.screenshot({ path: 'docs/screenshots/campushub-desktop.png', fullPage: true });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({ path: 'docs/screenshots/campushub-mobile.png', fullPage: true });
  }
});
test('register, create, edit, reserve, sell, and sign out', async ({ page }) => {
  await page.goto('/register');
  await page.getByLabel('Your name').fill('Browser Student');
  await page.getByLabel('Email address').fill(`browser-${Date.now()}@example.test`);
  await page.getByLabel('Password', { exact: true }).fill('BrowserTestPassword123!');
  await page.getByRole('button', { name: 'Create account' }).click();
  await expect(page.getByRole('heading', { name: 'Hello, Browser Student.' })).toBeVisible();
  await page.getByRole('link', { name: 'Create a listing ↗' }).click();
  await page.getByLabel('Title', { exact: true }).fill('Browser workflow textbook');
  await page
    .getByLabel('Description')
    .fill('Synthetic textbook created by the browser regression test.');
  await page.getByLabel('Price in rupees').fill('250');
  await page.getByLabel('Pickup area').fill('Library entrance');
  await page.getByRole('button', { name: 'Publish listing' }).click();
  await expect(page.getByRole('heading', { name: 'Browser workflow textbook' })).toBeVisible();
  await page.getByRole('link', { name: 'Manage listing', exact: true }).click();
  await page.getByRole('combobox', { name: 'Status', exact: true }).selectOption('reserved');
  await page.getByRole('button', { name: 'Save changes' }).click();
  await expect(page.getByText('reserved', { exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'Manage listing', exact: true }).click();
  await page.getByRole('combobox', { name: 'Status', exact: true }).selectOption('sold');
  await page.getByRole('button', { name: 'Save changes' }).click();
  await expect(page.getByText('sold', { exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Manage listing', exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'Sign out' }).click();
  await page.goto('/dashboard');
  await expect(page.getByRole('heading', { name: 'Welcome back.' })).toBeVisible();
});
test('marketplace filters, empty results, and mobile layout', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Books', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Books', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await page.getByLabel('Search listings').fill('no-such-demo-product');
  await page.getByRole('button', { name: 'Search', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'No finds just yet.' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
});
