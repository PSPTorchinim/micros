import { test, expect } from '@playwright/test';

test.describe('Theme Toggle E2E', () => {
  test('should toggle between light and dark themes', async ({ page }) => {
    // Wait for page to fully load
    await page.goto('/', { waitUntil: 'networkidle' });
    
    // Wait for the theme to be initialized
    await page.waitForFunction(() => 
      document.documentElement.getAttribute('data-theme') !== null,
      { timeout: 10000 }
    );
    
    // Check initial theme (should be light or dark based on system preference)
    const initialTheme = await page.evaluate(() => 
      document.documentElement.getAttribute('data-theme')
    );
    expect(initialTheme).toBeTruthy();
    
    // Find and click the theme toggle button
    const themeToggle = page.locator('button[aria-label="Toggle theme"]');
    await expect(themeToggle).toBeVisible({ timeout: 10000 });
    await themeToggle.waitFor({ state: 'visible', timeout: 10000 });
    
    await themeToggle.click();
    
    // Wait for theme change to apply
    await page.waitForFunction((oldTheme) => 
      document.documentElement.getAttribute('data-theme') !== oldTheme,
      initialTheme,
      { timeout: 5000 }
    );
    
    // Verify theme changed
    const newTheme = await page.evaluate(() => 
      document.documentElement.getAttribute('data-theme')
    );
    expect(newTheme).not.toBe(initialTheme);
    
    // Toggle back
    await themeToggle.click();
    
    // Wait for theme to change back
    await page.waitForFunction((expectedTheme) => 
      document.documentElement.getAttribute('data-theme') === expectedTheme,
      initialTheme,
      { timeout: 5000 }
    );
    
    const finalTheme = await page.evaluate(() => 
      document.documentElement.getAttribute('data-theme')
    );
    expect(finalTheme).toBe(initialTheme);
  });

  test('should persist theme preference in localStorage', async ({ page }) => {
    // Wait for page to fully load
    await page.goto('/', { waitUntil: 'networkidle' });
    
    // Wait for the theme to be initialized
    await page.waitForFunction(() => 
      document.documentElement.getAttribute('data-theme') !== null,
      { timeout: 10000 }
    );
    
    // Toggle theme
    const themeToggle = page.locator('button[aria-label="Toggle theme"]');
    await expect(themeToggle).toBeVisible({ timeout: 10000 });
    await themeToggle.click();
    
    // Wait for theme change to apply
    await page.waitForTimeout(500);
    
    // Get the current theme
    const currentTheme = await page.evaluate(() => 
      document.documentElement.getAttribute('data-theme')
    );
    
    // Reload the page
    await page.reload({ waitUntil: 'networkidle' });
    
    // Wait for theme to be restored from localStorage
    await page.waitForFunction(() => 
      document.documentElement.getAttribute('data-theme') !== null,
      { timeout: 10000 }
    );
    
    // Verify theme persisted
    const persistedTheme = await page.evaluate(() => 
      document.documentElement.getAttribute('data-theme')
    );
    expect(persistedTheme).toBe(currentTheme);
  });
});
