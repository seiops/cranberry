class cranberrySliderWrapper {
  beforeRegister() {
    this.is = 'cranberry-slider-wrapper';
    this.properties = {
      featuredTitle: {
        type: String
      },
      links: {
        type: Array
      },
      route: {
        type: Object,
        observer: 'routeChanged'
      },
      isShortcode: {
        type: Boolean
      }
    };
    this.computeShowTitle = function (index) {
      if (index === 0) {
        return true;
      } else {
        return false;
      }
    };
    this.computeIfShortcode = function (isShortcode) {
      if (isShortcode === true) {
        return true;
      }
    };
  }
}
Polymer(cranberrySliderWrapper);
