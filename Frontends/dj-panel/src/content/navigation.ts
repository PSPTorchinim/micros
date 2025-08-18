export const navigation = {
  logoSrc: '../public/images/logo-no-background.png',
  logoAlt: 'DJ Management',
  links: [
    {
      text: 'Home',
      url: '/',
      menu: 'main',
      permissions: [],
    },
    {
      text: 'Identity',
      url: '/users',
      menu: 'main',
      permissions: ['users:read'],
      children: [
        {
          text: 'Users',
          permissions: ['users:read'],
          children: [
            {
              text: 'See all users',
              url: '/users/all',
              permissions: ['users:read'],
            },
            {
              text: 'Add new user',
              url: '/users/add',
              permissions: ['users:create'],
            },
          ]
        },
        {
          text: 'Roles',
          permissions: ['roles:read'],
          children: [
            {
              text: 'See all roles',
              url: '/roles/all',
              permissions: ['roles:read'],
            },
            {
              text: 'Add new role',
              url: '/roles/add',
              permissions: ['roles:create'],
            },
          ]
        },
        {
          text: 'Permissions',
          permissions: ['permissions:read'],
          children: [
            {
              text: 'See all permissions',
              url: '/permissions/all',
              permissions: ['permissions:read'],
            },
            {
              text: 'Add new permission',
              url: '/permissions/add',
              permissions: ['permissions:create'],
            },
          ]
        }
      ],
    },
    {
      text: 'Company',
      url: '/company',
      menu: 'main',
      permissions: ['company:read'],
      children: [
        {
          text: 'See Info',
          url: '/company/about',
          permissions: ['company:read'],
        },
        {
          text: 'Edit Info',
          url: '/company/edit',
          permissions: ['company:update']
        },
        {
          text: 'Add new empoloyee',
          url: '/company/add-employee',
          permissions: ['company:update']
        },
      ],
    },
    {
      text: 'Dashboard',
      url: '/dashboard',
      isAuth: true,
      menu: 'main',
      permissions: ['dashboard:read'],
    },
    {
      text: 'Login',
      url: '/users/login',
      isAuth: false,
      menu: 'login',
    },
    {
      text: 'Profile',
      url: '/users/profile',
      isAuth: true,
      menu: 'login',
    }
  ],
};