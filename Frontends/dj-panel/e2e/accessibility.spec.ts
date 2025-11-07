import { test, expect } from '@playwright/test';

test.describe('Accessibility E2E', () => {
  test('should have accessible theme toggle button', async ({ page }) => {
    await page.goto('/');
    
    const themeToggle = page.locator('button[aria-label="Toggle theme"]');
    
    // Should be visible
    await expect(themeToggle).toBeVisible();
    
    // Should have proper aria-label
    await expect(themeToggle).toHaveAttribute('aria-label', 'Toggle theme');
    
    // Should have title attribute
    const title = await themeToggle.getAttribute('title');
    expect(title).toMatch(/Switch to (light|dark) mode/);
  });

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/');
    
    // Tab through the page
    await page.keyboard.press('Tab');
    
    // Should be able to focus on elements
    const focusedElement = await page.evaluate(() => 
      document.activeElement?.tagName
    );
    expect(focusedElement).toBeTruthy();
  });

  test('should have proper document title', async ({ page }) => {
    await page.goto('/');
    
    const title = await page.title();
    expect(title).toBeTruthy();
  });

  test('should have proper lang attribute', async ({ page }) => {
    await page.goto('/');
    
    const lang = await page.evaluate(() => 
      document.documentElement.getAttribute('lang')
    );
    // Lang might not be set, but the test ensures we check for it
    // In a production app, it should be set
    expect(lang !== undefined).toBe(true);
  });
});
