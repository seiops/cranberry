class CranberryBrowserDetection {
  beforeRegister() {
    this.is = 'cranberry-browser-detection';
    this.properties = {
      browser: {
        type: Object,
        value: function() {
          return {};
        }
      }
    }
  }

  // Lifecycle callback methods
  ready() {
    console.info('\<cranberry-browser-detection\> ready');
  }

  attached() {
    console.info('\<cranberry-browser-detection\> attached');
  }

  detached() {
    console.info('\<cranberry-browser-detection\> detached');
  }

  // Public Methods


  // Private Methods
}

Polymer(CranberryBrowserDetection);