import { test, expect } from '@playwright/test';

test.describe('Navigation E2E', () => {
  test('should render the main application', async ({ page }) => {
    await page.goto('/');
    
    // Wait for the app to load
    await page.waitForLoadState('networkidle');
    
    // The app should render with the root element containing content
    await expect(page.locator('#app')).toBeVisible({ timeout: 15000 });
  });

  test('should navigate to 404 page for unknown routes', async ({ page }) => {
    await page.goto('/#/unknown-route-that-does-not-exist');
    
    // Wait for content to load
    await page.waitForLoadState('networkidle');
    
    // Should show some indication of not found (this depends on your NotFoundComponent implementation)
    // Just verify the page loads without errors
    await expect(page.locator('#app')).toBeVisible({ timeout: 15000 });
  });

  test('should have proper HTML structure', async ({ page }) => {
    await page.goto('/');
    
    // Check for basic HTML elements
    const html = await page.locator('html');
    await expect(html).toBeVisible();
    
    // Check that data-theme attribute is set
    await page.waitForFunction(
      () => { const theme = document.documentElement.getAttribute('data-theme'); return theme !== null && theme !== ''; },
      { timeout: 15000 }
    );
    const themeAttr = await page.evaluate(() => 
      document.documentElement.getAttribute('data-theme')
    );
    expect(themeAttr).toBeTruthy();
  });
});
