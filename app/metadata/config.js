module.exports = {
  // URL Structure
  baseUrl: '/',
  baseDomain: 'http://www.standard.net',
  baseEndpointUrl: 'http://sedevcore.libercus.net/rest.json',
  appVersion: '<0.1',
  baseCanonicalUrl: 'https://github.com/seiops/cranberry/',
  myCaptureUrl: 'http://standard.mycapture.com/mycapture/remoteimage.asp',
  // General Namings
  title: 'Standard-Examiner',
  urlTitle: 'Standard.net',
  // Gigya
  gigya: {
    apiKey: '3_-_C60jYrQF4iB2Td_pfAznNCYppxxQt8-hXq-ZB4KUgp_X32Dme6ewgK9LjQqSgG'
  },
  // Google
  google: {
    analytics: 'UA-746696-1',
    maps: 'AIzaSyCzTR5CRaS7xrcH_jLFnh8OC5kfhyakXDY'
  },
  dfpAdStructure: {
    adGroupID: 30103046,
    adGrouping: 'Ogden_Publisher',
    adSubGrouping: 'Standard_Examiner'
  },
  // Social Networks
  socialNaming: {
    twitter: 'StandardEx',
    facebook: 'standardexaminer',
    facebookId: '1389242281298280'
  },
  // Contact Page Config
  contactInformation: {
    contactFormRecipient: 'memberservices@standard.net',
    hours: {
      week: '6:30 a.m. - 5:00 p.m',
      weekend: '6:30 a.m. - 10:00 a.m'
    },
    phone: '801.625.4200 | 800.651.2105',
    email: 'memberservices@standard.net',
    address: {
      unitNumber: '332',
      street: 'Standard Way',
      city: 'Ogden',
      state: 'UT',
      zip: '84404'
    },
    map: {
      latitude: '41.2584591',
      longitude: '-111.9936357'
    },
    needHelp: [
      {
        logo: 'icons:shopping-basket',
        label: 'Retail Advertising',
        phone: '801.625.4333'
      },
      {
        logo: 'icons:find-in-page',
        label: 'Classifieds',
        phone: '801.625.4488'
      },
      {
        logo: 'icons:card-membership',
        label: 'Member Services',
        phone: '801.625.4400'
      },
      {
        logo: 'icons:lightbulb-outline',
        label: 'News Tip',
        phone: '801.625.4225'
      }
    ],
    footerLinks: [
      {
        label: 'More+',
        link: 'more.standard.net'
      },
      {
        label: 'Careers',
        link: 'careers.standard.net	'
      },
      {
        label: 'SE Cares',
        link: 'cares.standard.net'
      },
      {
        label: 'RSS Feeds',
        link: '/rss'
      },
      {
        label: 'SE Events',
        link: 'events.standard.net'
      }
    ]
  },
  archiveCards: [
    {
      label: 'ePaper',
      description: 'The ePaper is designd for digital users who prefer the experience of the printed edition. This archive is updated daily with the most recent edition.',
      dates: '2014-09-01 - Present',
      link: '/digital',
      image: '../../images/archive/standard/sea_ipad_epaper.png'
    },
    {
      label: 'ePaper Archive',
      description: 'Coming Soon - The ePaper Archive is a deeper repository of printed editions, formatted for those users who prefer the print experience on a digital device.',
      dates: '2004-08-11 - 2014-08-31',
      link: '#',
      image: '../../images/archive/standard/e-paper_archive_image.png'
    },
    {
      label: 'Site Search',
      description: 'Search the Standard-Examiner site for the stories, photos, videos and people that you are looking for.',
      dates: '2012-0-01 - Present',
      link: '/search',
      image: '../../images/archive/standard/search_image.png'
    },
    {
      label: 'Text Archive',
      description: 'The Standard-Examiner Text Archive is an additional search tool that allows you to do more advanced searching. This archive contains only story text, and no photos or videos.',
      dates: '2001-05-22 - Present',
      link: '/news-archive',
      image: '../../images/archive/standard/text_archive_image.png'
    },
  ]
};
