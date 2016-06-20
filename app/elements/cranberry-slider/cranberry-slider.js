class cranberrySlider {
  beforeRegister() {
    this.is = 'cranberry-slider';
    this.properties = {
      featured: {
        type: Object,
        notify: true,
        observer: 'featuredChanged'
      },
      links: {
        type: Array
      }
    };
  }

  featuredChanged() {
    let myElement = this;
    let awesomeSlider = this.$.slider;

    this.featured.mediaAssets.images.forEach(function(value, index) {
      if (index === 0) {
        myElement.$.slider.removeChild(myElement.$.placehold);
      }
      let item = document.createElement('item');
      item.setAttribute('source', 'http://www.standard.net' + value.url);
      Polymer.dom(awesomeSlider).appendChild(item);
    });

    awesomeSlider.createdCallback();
    awesomeSlider.setAttribute('bullets', 'true');
  }
}
Polymer(cranberrySlider);
