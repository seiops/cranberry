class CranberryCalendar {
  // element registration
  beforeRegister() {
    this.is = 'cranberry-calendar';
    this.properties = {
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
        observer: '_routeChange'
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
  }

  // detect route and visibility
  _routeChange(section) {
    console.info('\<cranberry-calendar\> route change');

    this.async(function() {
        let hidden = this.hidden;

        if (!hidden) {
          let loaded = this.get('loaded');

          if(loaded === false){
            this._injectScript();
          } else {
            // reload calendar-ui method supplied by SpinGo
            angular.bootstrap(document.documentElement, ['sgCalendarUI']);
          }
        }
    });
  }
}
Polymer(CranberryCalendar);
