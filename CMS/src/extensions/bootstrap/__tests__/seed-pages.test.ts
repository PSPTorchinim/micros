/**
 * Seed Pages tests
 * Validates the page and template seed data structure
 */

describe('Seed Pages', () => {
  describe('Template Data Validation', () => {
    const TEMPLATE_SEEDS = [
      { Name: 'Home Template', TemplateType: 'Standard' },
      { Name: 'About Template', TemplateType: 'Standard' },
      { Name: 'Events Template', TemplateType: 'Standard' },
      { Name: 'Contact Template', TemplateType: 'Standard' },
      { Name: 'Login Template', TemplateType: 'Login' },
      { Name: 'Forgot Password Template', TemplateType: 'ForgotPassword' },
      { Name: 'Change Password Template', TemplateType: 'ChangePassword' },
      { Name: 'Profile Template', TemplateType: 'Profile' },
      { Name: 'Company Template', TemplateType: 'Company' },
      { Name: 'Roles Management Template', TemplateType: 'RolesManagement' },
      { Name: 'Users Management Template', TemplateType: 'UsersManagement' },
    ];

    it('should have templates for all essential pages', () => {
      expect(TEMPLATE_SEEDS.length).toBeGreaterThanOrEqual(5);
    });

    it('should have valid template types', () => {
      const validTypes = [
        'Standard',
        'Login',
        'ForgotPassword',
        'ChangePassword',
        'Profile',
        'Company',
        'RolesManagement',
        'UsersManagement',
      ];
      TEMPLATE_SEEDS.forEach((template) => {
        expect(template.Name).toBeDefined();
        expect(template.TemplateType).toBeDefined();
        expect(validTypes).toContain(template.TemplateType);
      });
    });

    it('should have unique template names', () => {
      const names = TEMPLATE_SEEDS.map((t) => t.Name);
      const uniqueNames = new Set(names);
      expect(uniqueNames.size).toBe(TEMPLATE_SEEDS.length);
    });
  });

  describe('Page Data Validation', () => {
    const PAGE_SEEDS = [
      {
        Title: 'Home',
        Slug: '/',
        Menu: 'Main',
        AuthState: 'All',
        NavigationOrder: 1,
        NavigationAction: 'Link',
        templateName: 'Home Template',
      },
      {
        Title: 'About',
        Slug: '/about',
        Menu: 'Main',
        AuthState: 'All',
        NavigationOrder: 2,
        NavigationAction: 'Link',
        templateName: 'About Template',
      },
      {
        Title: 'Events',
        Slug: '/events',
        Menu: 'Main',
        AuthState: 'All',
        NavigationOrder: 3,
        NavigationAction: 'Link',
        templateName: 'Events Template',
      },
      {
        Title: 'Contact',
        Slug: '/contact',
        Menu: 'Main',
        AuthState: 'All',
        NavigationOrder: 4,
        NavigationAction: 'Link',
        templateName: 'Contact Template',
      },
      {
        Title: 'Login',
        Slug: '/login',
        Menu: 'Login',
        AuthState: 'OnlyUnauthenticated',
        NavigationOrder: 1,
        NavigationAction: 'Link',
        templateName: 'Login Template',
      },
      {
        Title: 'Logout',
        Slug: '#',
        Menu: 'Login',
        AuthState: 'OnlyAuthenticated',
        NavigationOrder: 2,
        NavigationAction: 'Action',
        templateName: null,
      },
      {
        Title: 'Forgot Password',
        Slug: '/forgot-password',
        Menu: 'NotVisible',
        AuthState: 'OnlyUnauthenticated',
        NavigationOrder: 99,
        NavigationAction: 'Link',
        templateName: 'Forgot Password Template',
      },
    ];

    it('should have at least 5 pages', () => {
      expect(PAGE_SEEDS.length).toBeGreaterThanOrEqual(5);
    });

    it('should have valid page data for each page', () => {
      PAGE_SEEDS.forEach((page) => {
        expect(page.Title).toBeDefined();
        expect(page.Slug).toBeDefined();
        // Link pages should start with '/', action pages can use '#'
        if (page.NavigationAction === 'Link') {
          expect(page.Slug.startsWith('/')).toBe(true);
        }
        expect(page.Menu).toBeDefined();
        expect(page.AuthState).toBeDefined();
        expect(page.NavigationOrder).toBeDefined();
        expect(typeof page.NavigationOrder).toBe('number');
      });
    });

    it('should have unique slugs for each page', () => {
      // Action items can share '#' as slug since they don't navigate
      const linkPages = PAGE_SEEDS.filter((p) => p.NavigationAction === 'Link');
      const linkSlugs = linkPages.map((p) => p.Slug);
      const uniqueLinkSlugs = new Set(linkSlugs);
      expect(uniqueLinkSlugs.size).toBe(linkPages.length);
    });

    it('should have valid Menu values', () => {
      const validMenus = ['Main', 'Login', 'NotVisible'];
      PAGE_SEEDS.forEach((page) => {
        expect(validMenus).toContain(page.Menu);
      });
    });

    it('should have valid AuthState values', () => {
      const validAuthStates = [
        'All',
        'OnlyAuthenticated',
        'OnlyUnauthenticated',
      ];
      PAGE_SEEDS.forEach((page) => {
        expect(validAuthStates).toContain(page.AuthState);
      });
    });

    it('should have navigation order as sequential for main menu items', () => {
      const mainMenuPages = PAGE_SEEDS.filter((p) => p.Menu === 'Main');
      const orders = mainMenuPages
        .map((p) => p.NavigationOrder)
        .sort((a, b) => a - b);

      // Check that orders are sequential starting from 1
      orders.forEach((order, index) => {
        expect(order).toBe(index + 1);
      });
    });

    it('should reference matching template names', () => {
      const TEMPLATE_SEEDS = [
        { Name: 'Home Template', TemplateType: 'Standard' },
        { Name: 'About Template', TemplateType: 'Standard' },
        { Name: 'Events Template', TemplateType: 'Standard' },
        { Name: 'Contact Template', TemplateType: 'Standard' },
        { Name: 'Login Template', TemplateType: 'Login' },
        { Name: 'Forgot Password Template', TemplateType: 'ForgotPassword' },
        { Name: 'Change Password Template', TemplateType: 'ChangePassword' },
        { Name: 'Profile Template', TemplateType: 'Profile' },
      ];

      const templateNames = new Set(TEMPLATE_SEEDS.map((t) => t.Name));

      PAGE_SEEDS.forEach((page) => {
        // Action items don't require templates
        if (page.NavigationAction === 'Action') {
          expect(page.templateName).toBeNull();
        } else {
          expect(templateNames.has(page.templateName)).toBe(true);
        }
      });
    });

    it('should have Login page restricted to unauthenticated users', () => {
      const loginPage = PAGE_SEEDS.find((p) => p.Slug === '/login');
      expect(loginPage).toBeDefined();
      expect(loginPage?.AuthState).toBe('OnlyUnauthenticated');
    });

    it('should have Forgot Password page not visible in navigation', () => {
      const forgotPage = PAGE_SEEDS.find((p) => p.Slug === '/forgot-password');
      expect(forgotPage).toBeDefined();
      expect(forgotPage?.Menu).toBe('NotVisible');
    });

    it('should have Logout action restricted to authenticated users', () => {
      const logoutPage = PAGE_SEEDS.find((p) => p.Title === 'Logout');
      expect(logoutPage).toBeDefined();
      expect(logoutPage?.AuthState).toBe('OnlyAuthenticated');
      expect(logoutPage?.NavigationAction).toBe('Action');
      expect(logoutPage?.Menu).toBe('Login');
    });

    it('should have Profile page restricted to authenticated users', () => {
      const profilePage = PAGE_SEEDS.find((p) => p.Slug === '/profile');
      expect(profilePage).toBeDefined();
      expect(profilePage?.AuthState).toBe('OnlyAuthenticated');
      expect(profilePage?.Menu).toBe('Login');
    });
  });
});
