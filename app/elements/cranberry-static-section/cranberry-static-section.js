class cranberryStaticSection {
  beforeRegister() {
    this.is = 'cranberry-static-section';
    this.properties = {
      hidden: {
          type: Boolean,
          reflectToAttribute: true,
          value: true
      },
      staticSection: {
        type: String
      },
      hideWeather: {
        type: Boolean,
        value: true,
        observer: '_sendPageviews'
      },
      hideAdvantage: {
        type: Boolean,
        value: true,
        observer: '_sendPageviews'
      },
      hideGames: {
        type: Boolean,
        value: true,
        observer: '_sendPageviews'
      },
      hideDiscoverNorwalk: {
        type: Boolean,
        value: true,
        observer: '_sendPageviews'
      },
      weatherScriptLoaded: {
        type: Boolean,
        value: false
      },
      tags: {
        type: String
      },
      advantageItems: {
        type: Array
      },
      ludiPortal: {
        type: String
      }
    }
    this.observers = ['_setupWeather(hidden, staticSection)',
                      '_setupGames(hidden, hideGames)']
  }

  _setupWeather(hidden, staticSection) {
    if (typeof hidden !== 'undefined' && !hidden && typeof staticSection !== 'undefined' && staticSection === 'weather') {
      let scriptLoaded = this.get('weatherScriptLoaded');

      if (!scriptLoaded) {
        let loader = document.querySelector('cranberry-script-loader');

        loader.loadScript('http://oap.accuweather.com/launch.js');
        this.set('weatherScriptLoaded', true);
        this.set('tags', 'weather, forecast');
      }

      this.set('hideWeather', false);
    }
    if (typeof hidden !== 'undefined' && !hidden && typeof staticSection !== 'undefined' && staticSection === 'advantage-member') {
      this.set('hideAdvantage', false);
      this.set('tags', 'advantage');
    }
    if (typeof hidden !== 'undefined' && !hidden && typeof staticSection !== 'undefined' && staticSection === 'games-page') {
      this.set('hideGames', false);
      this.set('tags', 'games');
    }
    if (typeof hidden !== 'undefined' && !hidden && typeof staticSection !== 'undefined' && staticSection === 'discovernorwalk') {
      this.set('hideDiscoverNorwalk', false);
      this.set('tags', 'discovernorwalk');
    }
  }

  _setupGames(hidden, hideGames) {
    
  }

  _sendPageviews(hidden, oldHidden) {
    this.async(() => {
      if (typeof hidden !== 'undefined' && !hidden) {
        // Send pageview event with iron-signals
        this.fire('iron-signal', {name: 'track-page', data: { path: window.location.href } });

        // Send Chartbeat
        this.fire('iron-signal', {name: 'chartbeat-track-page', data: { path: window.location.href } });
      }
    })
  }
}
Polymer(cranberryStaticSection);