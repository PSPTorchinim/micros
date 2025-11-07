import { test, expect } from '@playwright/test';

test.describe('Theme Toggle E2E', () => {
  test('should toggle between light and dark themes', async ({ page }) => {
    await page.goto('/');
    
    // Check initial theme (should be light or dark based on system preference)
    const initialTheme = await page.evaluate(() => 
      document.documentElement.getAttribute('data-theme')
    );
    expect(initialTheme).toBeTruthy();
    
    // Find and click the theme toggle button
    const themeToggle = page.locator('button[aria-label="Toggle theme"]');
    await expect(themeToggle).toBeVisible();
    
    await themeToggle.click();
    
    // Verify theme changed
    const newTheme = await page.evaluate(() => 
      document.documentElement.getAttribute('data-theme')
    );
    expect(newTheme).not.toBe(initialTheme);
    
    // Toggle back
    await themeToggle.click();
    
    const finalTheme = await page.evaluate(() => 
      document.documentElement.getAttribute('data-theme')
    );
    expect(finalTheme).toBe(initialTheme);
  });

  test('should persist theme preference in localStorage', async ({ page }) => {
    await page.goto('/');
    
    // Toggle theme
    const themeToggle = page.locator('button[aria-label="Toggle theme"]');
    await themeToggle.click();
    
    // Get the current theme
    const currentTheme = await page.evaluate(() => 
      document.documentElement.getAttribute('data-theme')
    );
    
    // Reload the page
    await page.reload();
    
    // Verify theme persisted
    const persistedTheme = await page.evaluate(() => 
      document.documentElement.getAttribute('data-theme')
    );
    expect(persistedTheme).toBe(currentTheme);
  });
});
