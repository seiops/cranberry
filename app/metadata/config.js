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
    // Needs Changed
    apiKey: '3_6UHHWrJ4LmAOWWdgqP0UWqk-2InoMn5NH8Lo1aOfcmFl6zAS4u_-IxvC3mbGAxch'
  },
  // Google
  google: {
    //Need Changed
    analytics: 'UA-746696-1',
    //Need Changed
    maps: 'AIzaSyCzTR5CRaS7xrcH_jLFnh8OC5kfhyakXDY'
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
    // Needs Changed
    facebookId: '1389242281298280'
  },
  // Contact Page Config
  // Entire contact information needs changed
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
  }
};
