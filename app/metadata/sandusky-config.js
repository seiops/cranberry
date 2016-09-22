module.exports = {
  // URL Structure
  baseUrl: '/',
  baseDomain: 'http://www.sanduskyregister.com',
  baseEndpointUrl: 'http://srdevcore.libercus.net/rest.json',
  appVersion: '<0.1',
  baseCanonicalUrl: 'https://github.com/seiops/cranberry/',
  // Needs Changed
  myCaptureUrl: 'http://standard.mycapture.com/mycapture/remoteimage.asp',
  // General Namings
  title: 'Sandusky Register',
  urlTitle: 'SanduskyRegister.com',
  // Gigya
  gigya: {
    // Needs changed from dev key to prod key
    apiKey: '3_e5ABAMtSLw8p7NjX2d9P1niHwPiHeB7H_qp6Y4f8hhD-JHDUmPYR-dKc1bgpkPC7',
    siteName: 'sanduskyregister.com'
  },
  // Google
  google: {
    analytics: 'UA-4700830-1',
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
        // linkUrl: 'tellus.sanduskyregister.com'
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
        link: 'more.sanduskyregister.com'
      },
      {
        label: 'Todays Ads',
        link: 'local.sanduskyregister.com/ads'
      },
      {
        label: 'Local Guide',
        link: 'local.sanduskyregister.com'
      },
      {
        label: 'Job Network',
        link: 'sanduskyregister.thejobnetwork.com'
      },
      {
        label: 'Member Rewards',
        link: 'sanduskyregister.clickitrewards.com'
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
      image: '../images/archive/sandusky/ipad_epaper.png'
    },
    {
      label: 'ePaper Archive',
      description: 'Coming Soon - The ePaper Archive is a deeper repository of printed editions, formatted for those users who prefer the print experience on a digital device.',
      dates: '2004-08-11 - 2014-08-31',
      link: '#',
      image: '../images/archive/sandusky/e-paper_archive_image.png'
    },
    {
      label: 'Site Search',
      description: 'Search the Standard-Examiner site for the stories, photos, videos and people that you are looking for.',
      dates: '2012-0-01 - Present',
      link: '/search',
      image: '../images/archive/sandusky/search_image.png'
    },
    {
      label: 'Text Archive',
      description: 'The Standard-Examiner Text Archive is an additional search tool that allows you to do more advanced searching. This archive contains only story text, and no photos or videos.',
      dates: '2001-05-22 - Present',
      link: '/news-archive',
      image: '../images/archive/sandusky/text_archive_image.png'
    }
  ]
};
