import {
  AiFillMail,
  AiFillPhone,
  AiFillFacebook,
  AiFillInstagram,
} from 'react-icons/ai';

export const data = {
  content: [
    {
      type: 'hero',
      data: {
        heading: 'Manage Your DJ Business with Ease',
        content:
          "Streamline your DJ business operations with our all-in-one platform. From managing contracts and invoices to organizing your equipment and song library, we've got you covered.",
        actions: [
          {
            text: 'Features',
            url: '/#features',
          },
          {
            text: 'Power of Our Products',
            url: '/#power-of-our-products',
          },
          {
            text: 'Pricing',
            url: '/#pricing',
          },
          {
            text: 'Contact',
            url: '/#contact',
          },
        ],
      },
    },
    {
      type: 'image-slider',
      data: {
        reversed: false,
        images: [
          {
            src: 'https://images.unsplash.com/photo-1471897488648-5eae4ac6686b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTc0MTcxMTU3NXw&ixlib=rb-4.0.3&q=80&w=1080',
            alt: 'DJ Equipment Setup',
          },
          {
            src: 'https://images.unsplash.com/photo-1481277542470-605612bd2d61?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTc0MTcxMTU3MHw&ixlib=rb-4.0.3&q=80&w=1080',
            alt: 'DJ Contracts',
          },
          {
            src: 'https://images.unsplash.com/photo-1444312645910-ffa973656eba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTc0MTcxMTU2OHw&ixlib=rb-4.0.3&q=80&w=1080',
            alt: 'Invoices',
          },
          {
            src: 'https://images.unsplash.com/photo-1494059980473-813e73ee784b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTc0MTcxMTU3NHw&ixlib=rb-4.0.3&q=80&w=1080',
            alt: 'Song Library',
          },
          {
            src: 'https://images.unsplash.com/photo-1484627147104-f5197bcd6651?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTc0MTcxMTU3NHw&ixlib=rb-4.0.3&q=80&w=1080',
            alt: 'Party Management',
          },
          {
            src: 'https://images.unsplash.com/photo-1498612753354-772a30629934?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTc0MTcxMTU3M3w&ixlib=rb-4.0.3&q=80&w=1080',
            alt: 'Request Management',
          },
        ],
      },
    },
    {
      type: 'image-slider',
      data: {
        reversed: true,
        images: [
          {
            src: 'https://images.unsplash.com/photo-1477414348463-c0eb7f1359b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTc0MTcxMTU3M3w&ixlib=rb-4.0.3&q=80&w=1080',
            alt: 'DJ Turntable Setup',
          },
          {
            src: 'https://images.unsplash.com/photo-1493723843671-1d655e66ac1c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTc0MTcxMTU3NHw&ixlib=rb-4.0.3&q=80&w=1080',
            alt: 'DJ Controller Setup',
          },
          {
            src: 'https://images.unsplash.com/photo-1499728603263-13726abce5fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTc0MTcxMTU3NHw&ixlib=rb-4.0.3&q=80&w=1080',
            alt: 'DJ Mixer Setup',
          },
          {
            src: 'https://images.unsplash.com/uploads/141103282695035fa1380/95cdfeef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTc0MTcxMTU3NXw&ixlib=rb-4.0.3&q=80&w=1080',
            alt: 'DJ Speakers Setup',
          },
          {
            src: 'https://images.unsplash.com/photo-1472162072942-cd5147eb3902?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTc0MTcxMTU3MXw&ixlib=rb-4.0.3&q=80&w=1080',
            alt: 'DJ Laptop Setup',
          },
          {
            src: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTc0MTcxMTU3M3w&ixlib=rb-4.0.3&q=80&w=1080',
            alt: 'DJ Headphones Setup',
          },
        ],
      },
    },
    {
      type: 'feature-section',
      id: 'features',
      data: {
        reversed: false,
        tabs: [
          {
            imgAlt: 'DJ Company Management',
            imgSrc:
              'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTc0MTcxMTU3MXw&ixlib=rb-4.0.3&q=80&w=1080',
            title: 'DJ Company Management',
            description: 'Manage your DJ business with ease',
          },
          {
            imgAlt: 'DJ Documents Management',
            imgSrc:
              'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTc0MTcxMTU3MXw&ixlib=rb-4.0.3&q=80&w=1080',
            title: 'Documents Management',
            description:
              'Effortlessly create, send, and track DJ contracts, invoices, and other documents',
          },
          {
            imgAlt: 'Music Library Management',
            imgSrc:
              'https://images.unsplash.com/photo-1493934558415-9d19f0b2b4d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTc0MTcxMTU3Mnw&ixlib=rb-4.0.3&q=80&w=1080',
            title: 'Music Management',
            description: 'Easily manage and organize your music library',
          },
          {
            imgAlt: 'Party Management',
            imgSrc:
              'https://images.unsplash.com/photo-1493934558415-9d19f0b2b4d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTc0MTcxMTU3Mnw&ixlib=rb-4.0.3&q=80&w=1080',
            title: 'Party Management',
            description: 'Easily manage and organize your parties and events',
          },
          {
            imgAlt: 'DJ Equipment Management',
            imgSrc:
              'https://images.unsplash.com/photo-1526566762798-8fac9c07aa98?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTc0MTcxMTU6M3w&ixlib=rb-4.0.3&q=80&w=1080',
            title: 'Equipment Management',
            description: 'Manage all your DJ equipment in one place',
          },
          {
            imgAlt: 'DJ Pool Integration',
            imgSrc:
              'https://images.unsplash.com/photo-1526566762798-8fac9c07aa98?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTc0MTcxMTU6M3w&ixlib=rb-4.0.3&q=80&w=1080',
            title: 'DJ Pool Integration',
            description:
              'Connect to your DJ Pools and manage your music library',
          },
        ],
      },
    },
    {
      type: 'cta',
      data: {
        heading: 'Ready to take your DJ business to the next level?',
        content:
          'Sign up now and start managing your contracts, invoices, requests, equipment, songs, and parties with ease!',
        action: {
          text: 'Sign up',
          url: '/users/register',
        },
      },
    },
    {
      type: 'steps',
      id: 'power-of-our-products',
      data: {
        heading: 'Discover the Power of Our Products',
        content:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.',
        action: { text: 'Sign up', src: '/users/register' },
        steps: [
          {
            title: 'Create an Account',
            description:
              'Sign up to access all the features of our DJ management platform.',
          },
          {
            title: 'Manage DJ Contracts',
            description:
              'Easily create, send, and track DJ contracts for your events with our intuitive contract management system.',
          },
          {
            title: 'Manage orders',
            description: 'Effortlessly manage your event requests.',
          },
          {
            title: 'Organize Songs and Requests',
            description:
              'Effortlessly manage your music library, accept song requests from clients, and create playlists for your events.',
          },
          {
            title: 'Track Invoices and Payments',
            description:
              'Keep track of invoices, payments, and financial transactions seamlessly to ensure smooth business operations.',
          },
        ],
      },
    },
    // {
    //   type: 'pricing',
    //   id: 'pricing',
    //   data: {
    //     content1: 'Choose the perfect plan for you',
    //     heading1: 'Pricing plan',
    //     content2: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    //     pricingTypes: ['Monthly', 'Every 3 Months', 'Yearly'],
    //     plans: [
    //       {
    //         name: 'Basic plan',
    //         prices: {
    //           Monthly: '$29.99',
    //           'Every 3 Months': '$79.99',
    //           Yearly: '$200',
    //         },
    //         features: [
    //           'Manage DJ contracts',
    //           'Organize song library',
    //           'Track invoices and payments',
    //         ],
    //         actionText: 'Sign up now',
    //         actionType: 'thq-button-filled',
    //       },
    //       {
    //         name: 'Business plan',
    //         prices: {
    //           Monthly: '$49.99',
    //           'Every 3 Months': '$129.99',
    //           Yearly: '$299',
    //         },
    //         features: [
    //           'Manage DJ contracts',
    //           'Organize song library',
    //           'Track invoices and payments',
    //           'Manage DJ equipment inventory',
    //           'Organize parties and events',
    //         ],
    //         actionText: 'Sign up now',
    //         actionType: 'thq-button-filled',
    //       },
    //       {
    //         name: 'Enterprise plan',
    //         prices: {
    //           Monthly: '$79.99',
    //           'Every 3 Months': '$199.99',
    //           Yearly: '$499',
    //         },
    //         features: [
    //           'Manage DJ contracts',
    //           'Organize song library',
    //           'Track invoices and payments',
    //           'Manage DJ equipment inventory',
    //           'Organize parties and events',
    //           'Advanced songs management tools',
    //           'Priority support',
    //         ],
    //         actionText: 'Sign up now',
    //         actionType: 'thq-button-filled',
    //       },
    //     ],
    //   },
    // },
    {
      type: 'contact',
      id: 'contact',
      data: {
        introText: 'We are here to help you with any questions you may have.',
        heading: 'Contact Us',
        description:
          'Feel free to reach out to us for any inquiries or assistance.',
        contactInfo: [
          {
            title: 'Email',
            content: 'Send us an email for any questions or concerns.',
            detail: 'contact@djbeatblaster.com',
            iconPath: AiFillMail,
          },
          {
            title: 'Phone',
            content: 'Call us during working hours for immediate assistance.',
            detail: '+48 726 240 836',
            iconPath: AiFillPhone,
          },
          {
            title: 'Facebook',
            content: 'Stay connected with us on Facebook.',
            detail: 'facebook.com/djbeatblaster2024',
            iconPath: AiFillFacebook,
          },
          {
            title: 'Instagram',
            content: 'Follow us on Instagram for the latest updates.',
            detail: 'instagram.com/dj.beat.blaster',
            iconPath: AiFillInstagram,
          },
        ],
      },
    },
  ],
};
