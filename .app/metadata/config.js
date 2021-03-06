var  = require('./google.js');

module.exports = {
  // THIS IS FROM THE RIGHT CONFIG FILE!
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
  epaperLink: 'http://digital.olivesoftware.com/Olive/ODN/SanduskyRegister/default.aspx',
  ludiPortal: 'sanduskyregister',
  // Mather
  mather: {
    id: 76022441,
    name: 'Sandusky Register'
  },
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
  googleConfig,
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
  // Distro
  distro: {
    distroId: '22325'
  },
  // Jobs Network
  jobs: {
      affiliateId: '1606',
      widgetId: '2372'
  },
  // Contact Page Config
  // Entire contact information needs changed
  contactInformation: {
    contactFormRecipient: 'circulation@sanduskyregister.com',
    contactImage: '../../images/contact/sandusky/contact.jpg',
    recaptchaKey: '6LeQsAwUAAAAAFCmnU2qjqb6S1TMXsFscXLqTMyG',
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
        logo: 'cranberry-icons:shopping-basket',
        label: 'Retail Advertising',
        phone: '419-502-2121'
      },
      {
        logo: 'cranberry-icons:find-in-page',
        label: 'Classifieds',
        phone: '419-502-2171'
      },
      {
        logo: 'cranberry-icons:card-membership',
        label: 'Member Services',
        phone: '419-625-5500'
      },
      {
        logo: 'cranberry-icons:lightbulb-outline',
        label: 'News Tip',
        phone: '419-502-2160',
        link: true,
        linkUrl: 'http://tellus.sanduskyregister.com/'
      },
      {
        logo: 'cranberry-icons:chrome-reader-mode',
        label: 'Newsroom',
        phone: '419-502-2160'
      },
      {
        logo: 'cranberry-icons:laptop',
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
    ],
    formDepartments: [
      {
        name: 'Newsroom',
        email: 'news@sanduskyregister.com'
      },
      {
        name: 'Circulation',
        email: 'circulation@sanduskyregister.com'
      },
      {
        name: 'Advertising',
        email: 'advertising@sanduskyregister.com'
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
      link: 'http://digital.olivesoftware.com/Olive/ODN/SanduskyRegister/default.aspx',
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
      linkUrl: 'http://www.norwalkreflector.com'
    },
    {
      linkText: 'Contests',
      linkUrl: 'http://www.sanduskyregister.com/page/contests'
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
  weather: {
    uid: 'awtd1442845125461',
    locationKey: '1167',
    zipCode: '44870',
    location: 'sandusky-oh'
  }
};
