var execSync = require('child_process').execSync,
    appVersion = null;

try {
  appVersion = execSync('git describe --tags').toString().replace(/(\r\n|\n|\r)/gm, '');
} catch(e) {
  console.log('Warning: Can\'t run "git describe" for determine app version');
}

module.exports = {
  // App name ID is used for iron-localstorage element and Service Worker cache ID
  appNameId: 'cranberry',
  // App theme is directory name in app/themes
  appTheme: 'default-theme',
  // App version from git is used for deploy task and frontend
  appVersion: appVersion,
  // Autoprefixer
  autoprefixer: {
    // https://github.com/postcss/autoprefixer#browsers
    browsers: [
      // Setup for WebComponents Browser Support
      // https://github.com/WebComponents/webcomponentsjs#browser-support
      'Explorer >= 10',
      'ExplorerMobile >= 10',
      'Firefox >= 30',
      'Chrome >= 34',
      'Safari >= 7',
      'Opera >= 23',
      'iOS >= 7',
      'Android >= 4.4',
      'BlackBerry >= 10'
    ]
  },
  // BrowserSync
  browserSync: {
    browser: 'default', // or ["google chrome", "firefox"]
    https: false, // Enable https for localhost development.
    notify: false, // The small pop-over notifications in the browser.
    port: process.env.PORT || 3000, // Environment variable $PORT is for Cloud9 IDE
    ui: {
      port: 3001
    }
  },
  // Deploy task
  deploy: {
    // Choose hosting
    hosting: 'ssh', // or firebase, gcs, ssh
    // Firebase
    // Firebase requires Firebase Command Line Tools to be installed and configured.
    // For info on tool: https://www.firebase.com/docs/hosting/command-line-tool.html
    firebase: {
      env: {
        development: 'dev', // subdomain
        staging:     'sta',
        production:  'pro'
      }
    },
    // Any Linux hosting with SSH
    // Install your SSH public key ~/.ssh/id_rsa.pub onto a remote Linux
    // Example command: ssh-copy-id root@server.example.com
    ssh: {
      env: {
        development: '/path/to/remote-dir-dev', // remote dir must not exist
        staging:     '/path/to/remote-dir-staging',
        production:  '/path/to/remote-dir'
      },
      host: 'server.example.com',
      port: 22,
      user: 'root'
    }
  },
  // Gigya
  gigya: {
    apiKey: '3_6UHHWrJ4LmAOWWdgqP0UWqk-2InoMn5NH8Lo1aOfcmFl6zAS4u_-IxvC3mbGAxch'
  },
  // PageSpeed Insights
  // Please feel free to use the `nokey` option to try out PageSpeed
  // Insights as part of your build process. For more frequent use,
  // we recommend registering for your own API key. For more info:
  // https://developers.google.com/speed/docs/insights/v1/getting_started
  pageSpeed: {
    key: '', // need uncomment in task
    nokey: true,
    site: 'https://github.com/seiops/cranberry',
    strategy: 'mobile' // or desktop
  },
  // Service Worker
  serviceWorker: {
    cacheDisabled: false
  }
};
