class cranberryStaticSection {
  beforeRegister() {
    this.is = 'cranberry-static-section';
    this.properties = {
      hidden: {
          type: Boolean,
          reflectToAttribute: true,
          value: true,
          observer: '_hiddenChanged'
      },
      staticSection: {
        type: String
      },
      hideWeather: {
        type: Boolean,
        value: true
      },
      hideAdvantage: {
        type: Boolean,
        value: true
      },
      hideGames: {
        type: Boolean,
        value: true
      },
      hideDiscoverNorwalk: {
        type: Boolean,
        value: true
      },
      hideTvListings: {
        type: Boolean,
        value: true
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
    this.observers = ['_setupStaticPage(hidden, staticSection)',
                      '_setupGames(hidden, hideGames)']
  }

  _setupStaticPage(hidden, staticSection) {
    this.debounce('_setupStaticPage', ()  => {
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
      if (typeof hidden !== 'undefined' && !hidden && typeof staticSection !== 'undefined' && staticSection === 'tv-listings') {
        this.set('hideTvListings', false);
        this.set('tags', 'tv-listings');
      }
    });
  }

  _hiddenChanged(hidden, oldHidden) {
    let staticSection = this.get('staticSection');

    this.async(() => {
      if (typeof hidden !== 'undefined' && !hidden && typeof staticSection !== 'undefined') {
        this._sendPageviews(staticSection);
      }
    });
  }

  _sendPageviews(staticSection) {
    this.async(() => {
      // Send pageview event with iron-signals
      this.fire('iron-signal', {name: 'track-page', data: { path: '/' + staticSection } });

      // Send Chartbeat
      this.fire('iron-signal', {name: 'chartbeat-track-page', data: { path: '/' + staticSection } });

      this.fire('iron-signal', {name: 'page-hit'});

      // Fire Mather
      this.fire('iron-signal', {name: 'mather-hit', data: { data: {'sections': staticSection, 'pageType': 'static' } } });
    });
    
  }

  _setupGames(hidden, hideGames) {

  }

  _computeTvListingsUrl(mobile) {
    if (mobile) {
      return 'http://www.tvpassport.com/mobile/?subid=sandusky-001&&defaultLineup=6257D&ht=1200&loc=' + location;
    } else {
      let location = window.location.href;
      return 'http://decoy.tvpassport.com/?subid=sandusky-001&ht=1200&defaultLineup=6257D&loc=' + location;
    }
  }
}
Polymer(cranberryStaticSection);