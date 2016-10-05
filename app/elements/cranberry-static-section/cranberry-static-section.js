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
        value: true
      },
      weatherScriptLoaded: {
        type: Boolean,
        value: false
      }
    }
    this.observers = ['_setupWeather(hidden, staticSection)']
  }

  _setupWeather(hidden, staticSection) {
    if (typeof hidden !== 'undefined' && !hidden && typeof staticSection !== 'undefined' && staticSection === 'weather') {
      let scriptLoaded = this.get('weatherScriptLoaded');

      if (!scriptLoaded) {
        let loader = document.querySelector('cranberry-script-loader');

        loader.loadScript('http://oap.accuweather.com/launch.js');
        this.set('weatherScriptLoaded', true);
      }

      this.set('hideWeather', false);
    }
  }
}
Polymer(cranberryStaticSection);
