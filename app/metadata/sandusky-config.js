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
      latitude: '41.4552814',
      longitude: '-82.7158251'
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
        phone: '419-502-2060'
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
        label: 'Today\'s Ads',
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
      }
    ]
  }
};
