class cranberryInfoSection {
  beforeRegister() {
    this.is = 'cranberry-info-section';
    this.properties = {
      route: {
        type: Object
      },
      hideInfo: {
        type: Boolean,
        value: true
      }
    }
    this.observers = ['_setupWeather(route)']
  }

  _setupWeather(route) {
    if (route.path === '/forecast') {
      this.set('hideInfo', false);

      let loader = document.querySelector('cranberry-script-loader');

      loader.loadScript('http://oap.accuweather.com/launch.js');
    }
  }
}
Polymer(cranberryInfoSection);
