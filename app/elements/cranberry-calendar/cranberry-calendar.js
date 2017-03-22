class CranberryCalendar {
  // element registration
  beforeRegister() {
    this.is = 'cranberry-calendar';
    this.properties = {
      hidden: {
        type: Boolean,
        value: true,
        reflectToAttribute: true
      },
      loaded: {
        type: Boolean,
        value: false
      },
      radius: {
        type: Number,
        value: 25
      },
      route: {
        type: Object,
        observer: '_routeChanged'
      },
      calendarDomain: {
        type: String
      }
    };
  }

  // public methods

  // attached to document
  attached() {
    console.info('\<cranberry-calendar\> attached');
    this._firePageviews();
  }

  // private methods

  // inject script asynchronously
  _injectScript() {
    console.info('\<cranberry-calendar\> generating config and loading script');

    let SpinGo = (window.SpinGo = window.SpinGo || {});
    let radiusConfig = this.get('radius');

    SpinGo.config = {
      radius: radiusConfig,
      pushState: true,
      onNavigation: function(data) {
        // user has entered a new route
        data.leaving.then(function() {
          // user has left the route
        });
      }
    };

    let calendarDomain = this.get('calendarDomain');

    let loader = document.querySelector('cranberry-script-loader');

    loader.loadScript('http://' + calendarDomain + '.spingo.com/embed.js');
    this.set('loaded', true);
  }

  // detect route and visibility
  _routeChanged(section, oldSection) {
    this.async(() => {
      let hidden = this.get('hidden');
      let loaded = this.get('loaded');
      
      if (!hidden) {
        console.info('\<cranberry-calendar\> route changed');
        console.dir(section);
        if (section.path === '/calendar') {
          console.info('\<cranberry-calendar\> section path matches root');
          if(loaded === false) {
            this._injectScript();
          } else {
            console.info('\<cranberry-calendar\> reloading calendar');
            // reload calendar-ui method supplied by SpinGo
            angular.bootstrap(document.documentElement, ['sgCalendarUI']);
          }
        } else if (section.path.includes('/calendar/')){
          console.info('\<cranberry-calendar\> section path matches a sub');
          if (typeof oldSection !== 'undefined' && section.path !== oldSection.path) {
            this._firePageviews();
          }

          if (!loaded) {
            this._injectScript();
          }
        }
      }
    });
  }

  _firePageviews() {
    console.info('\<cranberry-calendar\> sending pageviews');
    // Fire Google Analytics Pageview
    this.fire('iron-signal', {name: 'track-page', data: { path: '/calendar', data: { 'dimension7': 'calendar' } } });
    // Fire Chartbeat pageview
    this.fire('iron-signal', {name: 'chartbeat-track-page', data: { path: '/calendar', data: {'sections': 'calendar' } } });
    // Fire Youneeq Page Hit Request
    this.fire('iron-signal', {name: 'page-hit'});
  }
}
Polymer(CranberryCalendar);
