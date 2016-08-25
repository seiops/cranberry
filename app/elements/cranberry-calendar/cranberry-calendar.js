class CranberryCalendar {
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
      }
    };
  }

_visibility() {
  let hidden = this.hidden;
  let route = this.get('route');
  console.dir(route);
  console.log(hidden);
  console.log('visibility');
}

  attached() {
    app.logger('\<cranberry-calendar\> attached');
    this.async(function(){

      this._visibility();
    });
  }

  _injectScript() {
    console.log('injecting script');

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

    let embed = document.createElement('script');
    embed.src = 'http://snet.spingo.com/embed.js';
    embed.async = true;

    let script = document.getElementsByTagName('script')[0];
    let parent = script.parentNode;

    parent.insertBefore(embed, script);

    this.set('loaded', true);
  }

  _routeChange(section) {
    app.logger('\<cranberry-calendar\> route change');

    this.async(function() {
        let hidden = this.hidden;

        if (!hidden) {
          let loaded = this.get('loaded');

          if(loaded === false){
            this._injectScript();
          } else {
            console.log('hide calendar');
          }

        }
    });
  }
}
Polymer(CranberryCalendar);
