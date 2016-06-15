class cranberrySlider {
  beforeRegister() {
    this.is = 'cranberry-slider';
    this.properties = {
      featured: {
        type: Object
      },
      links: {
        type: Array
      }
    };
  }

}
Polymer(cranberrySlider);
