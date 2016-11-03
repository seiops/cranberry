module.exports = {
  // URL Structure
  baseUrl: '/',
  baseDomain: 'http://www.sanduskyregister.com',
  baseEndpointUrl: 'http://srdevcore.libercus.net/rest.json',
  appVersion: '<0.1',
  baseCanonicalUrl: 'https://github.com/seiops/cranberry/',
  calendarDomain: 'sanduskyregister',
  myCaptureUrl: 'http://sandusky.mycapture.com/mycapture/remoteimage.asp',
  // General Namings
  title: 'Sandusky Register',
  urlTitle: 'SanduskyRegister.com',
  epaperLink: 'http://digital.olivesoftware.com/Olive/ODE/SanduskyRegister',
  ludiPortal: 'sanduskyregister',
  promo: {
    image: '../../images/promo/sandusky/promo.png',
    link: 'http://www.sanduskyoffers.com'
  },
  // Gigya
  gigya: {
    // Needs changed from dev key to prod key
    apiKey: '3_e5ABAMtSLw8p7NjX2d9P1niHwPiHeB7H_qp6Y4f8hhD-JHDUmPYR-dKc1bgpkPC7',
    siteName: 'sanduskyregister.com',
    commentsId: 'Default'
  },
  // Google
  google: {
    analytics: 'UA-61183098-4',
    maps: 'AIzaSyASMEaZRw3O-fhuvscitnQ8k2YJ3kJn_ZA'
  },
  dfpAdStructure: {
    adGroupID: 30103046,
    adGrouping: 'Tandem',
    adSubGrouping: 'Sandusky'
  },
  // Social Networks
  socialNaming: {
    twitter: 'sanduskyregister',
    facebook: 'sanduskyregistr',
    facebookId: '259812604228072'
  },
  socialUrls: {
    facebook: 'https://www.facebook.com/sanduskyregister/',
    twitter: 'https://twitter.com/sanduskyregistr',
    instagram: 'https://www.instagram.com/sanduskyregister/',
    linkedin: 'https://www.linkedin.com/company/sandusky-register'
  },
  // Tout
  tout: {
      toutUid: '277e2b'
  },
  // Jobs Network
  jobs: {
      affiliateId: '1606',
      widgetId: '3167'
  },
  // Contact Page Config
  // Entire contact information needs changed
  contactInformation: {
    contactFormRecipient: 'circulation@sanduskyregister.com',
    contactImage: '../../images/contact/sandusky/contact.jpg',
    hours: {
      week: '8:00 a.m. - 5:00 p.m',
      weekend: 'Closed'
    },
    phone: '419-625-5500',
    email: 'circulation@sanduskyregister.com',
    address: {
      unitNumber: '314',
      street: 'West Market Street',
      city: 'Sandusky',
      state: 'OH',
      zip: '44870'
    },
    map: {
      latitude: '41.4552555',
      longitude: '-82.7134733'
    },
    needHelp: [
      {
        logo: 'icons:shopping-basket',
        label: 'Retail Advertising',
        phone: '419-502-2121'
      },
      {
        logo: 'icons:find-in-page',
        label: 'Classifieds',
        phone: '419-502-2120'
      },
      {
        logo: 'icons:card-membership',
        label: 'Member Services',
        phone: '419-625-5500'
      },
      {
        logo: 'icons:lightbulb-outline',
        label: 'News Tip',
        phone: '419-502-2060',
        link: true,
        linkUrl: 'http://srdev.libercus.net/tell-us'
        // Commented out production url. This site is not ready yet.
        // linkUrl: 'http://tellus.sanduskyregister.com'
      },
      {
        logo: 'icons:chrome-reader-mode',
        label: 'Newsroom',
        phone: '419-502-2060'
      },
      {
        logo: 'hardware:laptop',
        label: 'Web Dept.',
        phone: '419-609-5861'
      }
    ],
    footerLinks: [
      {
        label: 'More+',
        link: 'http://more.sanduskyregister.com'
      },
      {
        label: 'Todays Ads',
        link: 'http://local.sanduskyregister.com/ads'
      },
      {
        label: 'Local Guide',
        link: 'http://local.sanduskyregister.com'
      },
      {
        label: 'Job Network',
        link: 'http://sanduskyregister.thejobnetwork.com'
      },
      {
        label: 'Member Rewards',
        link: 'http://sanduskyregister.clickitrewards.com'
      },
      {
        label: 'Archive',
        link: '/archive'
      }
    ]
  },
  archiveCards: [
    {
      label: 'ePaper',
      description: 'The ePaper is designd for digital users who prefer the experience of the printed edition. This archive is updated daily with the most recent edition.',
      dates: '2014-09-01 - Present',
      link: '/ePaper',
      buttonText: 'View ePaper',
      image: '../images/archive/sandusky/ipad_epaper.png'
    },
    {
      label: 'ePaper Archive',
      description: 'Coming Soon - The ePaper Archive is a deeper repository of printed editions, formatted for those users who prefer the print experience on a digital device.',
      dates: '2004-08-11 - 2014-08-31',
      link: 'http://sample.olivesoftware.com/Olive/APA/SanduskyRegisterA/Default.aspx#panel=home',
      buttonText: 'View Archive',
      image: '../images/archive/sandusky/e-paper_archive_image.png'
    },
    {
      label: 'Site Search',
      description: 'Search the Sandusky Register site for the stories, photos, videos and people that you are looking for.',
      dates: '2012-0-01 - Present',
      link: '/search',
      buttonText: 'Search Site',
      image: '../images/archive/sandusky/search_image.png'
    },
    {
      label: 'Text Archive',
      description: 'The Sandusky Register Text Archive is an additional search tool that allows you to do more advanced searching. This archive contains only story text, and no photos or videos.',
      dates: '2001-05-22 - Present',
      link: '/news-archive',
      buttonText: 'View Archive',
      image: '../images/archive/sandusky/text_archive_image.png'
    }
  ],
  advantagePage: {
    images: [
      {
        url: '../images/advantage/sandusky/advantage.jpg'
      },
      {
        url: '../images/advantage/sandusky/advantage-2.jpg'
      },
      {
        url: '../images/advantage/sandusky/advantage-button.jpg'
      }
    ],
    text: '<p>Welcome to the Sandusky Register Advantage, giving you 7-day home delivery, complete e-paper access and reader rewards.</p><p>Advantage Membership provides great value including:</p><ul class="advantage-list"><li>7-day or weekend home delivery of award-winning news, headlines and updates delivered directly to your home</li><li>Unlimited access to our complete e-paper edition online</li><li>Reader rewards web site providing discounts at select area locations (41 coupons that you can take advantage of, saving you hundreds of dollars if used regularly)</li><li>Free online access to The Washington Post Premium edition</li></ul>'
  },
  advantageUrl: 'http://www.sanduskyoffers.com/',
    topMenu: [
    {
      linkText: 'Norwalk Reflector',
      linkUrl: 'www.norwalkreflector.com'
    },
        {
      linkText: 'Today&#8217;s ads',
      linkUrl: 'http://local.sanduskyregister.com/ads'
    },
    {
      linkText: 'Local Guide',
      linkUrl: '	http://local.sanduskyregister.com/'
    },
    {
      linkText: 'Job Network',
      linkUrl: 'http://sanduskyregister.thejobnetwork.com/'
    },
    {
      linkText: 'Member Rewards',
      linkUrl: 'http://sanduskyregister.clickitrewards.com/'
    }
  ],
  sideMenu: [
    {
      linkText: 'Home',
      linkUrl: '/',
      linkIcon: 'home',
      target: ''
    },
    {
      linkText: 'Obituaries',
      linkUrl: '/section/obituary',
      linkIcon: '',
      target: ''
    },
    {
      linkText: 'E-Paper',
      linkUrl: 'http://digital.olivesoftware.com/Olive/ODE/SanduskyRegister',
      linkIcon: '',
      target: '_blank'
    },
    {
      linkText: 'Galleries',
      linkUrl: '/galleries',
      linkIcon: '',
      target: ''
    },
    {
      linkText: 'News',
      linkUrl: '/section/news',
      linkIcon: 'chrome-reader-mode',
      target: ''
    },
    {
      linkText: 'Opinion',
      linkUrl: '/section/opinion',
      linkIcon: 'communication:chat-bubble',
      target: ''
    },
    {
      linkText: 'Announcements',
      linkUrl: '/section/announcements',
      linkIcon: 'star',
      target: ''
    },
    {
      linkText: 'Sports',
      linkUrl: '/section/sports',
      linkIcon: 'maps:directions-run',
      target: ''
    },
    {
      linkText: 'entertainment',
      linkUrl: '/section/entertainment',
      linkIcon: 'image:palette',
      target: ''
    },
    {
      linkText: 'Lifestyle',
      linkUrl: '/section/lifestyle',
      linkIcon: 'maps:local-cafe',
      target: ''
    },
    {
      linkText: 'Classifieds',
      linkUrl: 'http://classifieds.sanduskyregister.com',
      linkIcon: 'icons:view-list',
      target: '_blank'
    },
    {
      linkText: 'Decision 2016',
      linkUrl: '/tags/decision-2016',
      linkIcon: '',
      target: ''
    },
    {
      linkText: 'Weather',
      linkUrl: '/forecast',
      linkIcon: '',
      target: ''
    },
    {
      linkText: 'Fit Challenge',
      linkUrl: '/tags/c25k',
      linkIcon: '',
      target: ''
    },
    {
      linkText: 'Law Enforcement',
      linkUrl: '/section/law-enforcement',
      linkIcon: '',
      target: ''
    },
    {
      linkText: 'Cedar Point',
      linkUrl: '/tags/cedar-point',
      linkIcon: '',
      target: ''
    },
    {
      linkText: 'Calendar',
      linkUrl: '/tags/calendar',
      linkIcon: '',
      target: ''
    },
    {
      linkText: 'Contact Us',
      linkUrl: '/contact',
      linkIcon: '',
      target: ''
    }
  ],
  weather: {
    uid: 'awtd1442845125461',
    locationKey: '1167',
    zipCode: '44870',
    location: 'sandusky-oh'
  }
};
