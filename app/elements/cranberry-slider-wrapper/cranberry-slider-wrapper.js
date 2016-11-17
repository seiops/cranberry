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

  _computeUrl(item) {
    if (item.contentType === 'story') {
      return '/story/' + item.itemId;
    } else {
      return '/photo-gallery/' + item.itemId;
    }
  }
}
Polymer(cranberrySliderWrapper);
