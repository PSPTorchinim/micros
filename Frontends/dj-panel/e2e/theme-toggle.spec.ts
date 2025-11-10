import { test, expect } from '@playwright/test';

test.describe('Theme Toggle E2E', () => {
  test('should toggle between light and dark themes', async ({ page }) => {
    // Wait for page to fully load
    await page.goto('/', { waitUntil: 'networkidle' });
    
    // Wait for React app to be ready by checking if root element has content
    await page.waitForSelector('#root > *', { timeout: 30000 });
    
    // Wait for the theme to be initialized with increased timeout for slow browsers
    await page.waitForFunction(() => {
      const theme = document.documentElement.getAttribute('data-theme');
      return theme !== null && theme !== '';
    }, { timeout: 30000 });
    
    // Check initial theme (should be light or dark based on system preference)
    const initialTheme = await page.evaluate(() => 
      document.documentElement.getAttribute('data-theme')
    );
    expect(initialTheme).toBeTruthy();
    
    // Find and click the theme toggle button
    const themeToggle = page.locator('button[aria-label="Toggle theme"]');
    await expect(themeToggle).toBeVisible({ timeout: 15000 });
    await themeToggle.waitFor({ state: 'visible', timeout: 15000 });
    
    await themeToggle.click();
    
    // Wait for theme change to apply
    await page.waitForFunction((oldTheme) => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      return currentTheme !== null && currentTheme !== oldTheme;
    }, initialTheme, { timeout: 10000 });
    
    // Verify theme changed
    const newTheme = await page.evaluate(() => 
      document.documentElement.getAttribute('data-theme')
    );
    expect(newTheme).not.toBe(initialTheme);
    
    // Toggle back
    await themeToggle.click();
    
    // Wait for theme to change back
    await page.waitForFunction((expectedTheme) => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      return currentTheme === expectedTheme;
    }, initialTheme, { timeout: 10000 });
    
    const finalTheme = await page.evaluate(() => 
      document.documentElement.getAttribute('data-theme')
    );
    expect(finalTheme).toBe(initialTheme);
  });

  test('should persist theme preference in localStorage', async ({ page }) => {
    // Wait for page to fully load
    await page.goto('/', { waitUntil: 'networkidle' });
    
    // Wait for React app to be ready
    await page.waitForSelector('#root > *', { timeout: 30000 });
    
    // Wait for the theme to be initialized with increased timeout
    await page.waitForFunction(() => {
      const theme = document.documentElement.getAttribute('data-theme');
      return theme !== null && theme !== '';
    }, { timeout: 30000 });
    
    // Toggle theme
    const themeToggle = page.locator('button[aria-label="Toggle theme"]');
    await expect(themeToggle).toBeVisible({ timeout: 15000 });
    await themeToggle.click();
    
    // Wait for theme change to apply
    await page.waitForTimeout(1000);
    
    // Get the current theme
    const currentTheme = await page.evaluate(() => 
      document.documentElement.getAttribute('data-theme')
    );
    
    // Reload the page
    await page.reload({ waitUntil: 'networkidle' });
    
    // Wait for React app to be ready after reload
    await page.waitForSelector('#root > *', { timeout: 30000 });
    
    // Wait for theme to be restored from localStorage
    await page.waitForFunction(() => {
      const theme = document.documentElement.getAttribute('data-theme');
      return theme !== null && theme !== '';
    }, { timeout: 30000 });
    
    // Verify theme persisted
    const persistedTheme = await page.evaluate(() => 
      document.documentElement.getAttribute('data-theme')
    );
    expect(persistedTheme).toBe(currentTheme);
  });
});
