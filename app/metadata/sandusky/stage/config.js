var baseConfig = require('./sandusky/globalConfigs/base.js');
var googleConfig = require('./sandusky/globalConfigs/google.js');
var matherConfig = require('./sandusky/globalConfigs/mather.js');
var gigyaConfig = require('./sandusky/globalConfigs/gigya.js');
var dfpConfig = require('./sandusky/globalConfigs/dfp.js');
var socialConfig = require('./sandusky/globalConfigs/social.js');
var contactConfig = require('./sandusky/globalConfigs/contact.js');
var archiveConfig = require('./sandusky/globalConfigs/archive.js');
var weatherConfig = require('./sandusky/globalConfigs/weather.js');
var jobsConfig = require('./sandusky/globalConfigs/jobs.js');
var distroConfig = require('./sandusky/globalConfigs/distro.js');
var toutConfig = require('./sandusky/globalConfigs/tout.js');
var promoConfig = require('./sandusky/globalConfigs/promo.js');
var advantageConfig = require('./sandusky/globalConfigs/advantage.js');
var icons = require('./sandusky/globalConfigs/icons.js');

module.exports = {
  appVersion: baseConfig.appVersion,
  baseUrl: baseConfig.baseUrl,
  baseDomain: baseConfig.baseDomain,
  baseEndpointUrl: baseConfig.stageEndpointUrl,
  baseCanonicalUrl: baseConfig.baseCanonicalUrl,
  calendarDomain: baseConfig.calendarDomain,
  epaperLink: baseConfig.epaperLink,
  ludiPortal: baseConfig.ludiPortal,
  myCaptureUrl: baseConfig.myCaptureUrl,
  title: baseConfig.title,
  urlTitle: baseConfig.urlTitle,
  mather: matherConfig,
  promo: promoConfig,
  gigya: gigyaConfig,
  google: googleConfig,
  dfpAdStructure: dfpConfig,
  dfpAdPlacement: 'development',
  socialNaming: socialConfig.socialNaming,
  socialUrls: socialConfig.socialUrls,
  tout: toutConfig,
  jobs: jobsConfig,
  contactInformation: contactConfig,
  archiveCards: archiveConfig.archiveCards,
  advantagePage: advantageConfig,
  advantageUrl: advantageConfig.advantageUrl,
  weather: weatherConfig,
  favicon: icons.favIcon,
  icon152: icons.icon152,
  icon120: icons.icon120,
  icon76: icons.icon76,
  icon60: icons.icon60,
  icon32: icons.icon32
};
