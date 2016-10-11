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
      hideAdvantage: {
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
        this.set('tags', 'weather, forecast');
      }

      this.set('hideWeather', false);
    }
    if (typeof hidden !== 'undefined' && !hidden && typeof staticSection !== 'undefined' && staticSection === 'advantage-member') {
      this.set('hideAdvantage', false);
    }
  }
}
Polymer(cranberryStaticSection);
