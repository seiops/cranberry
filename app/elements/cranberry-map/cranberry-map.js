class cranberryMap {
  beforeRegister() {
    this.is = 'cranberry-map';
    this.properties = {
      apiKey: {
        type: String,
        value: function() {
          return getMapAPI();
        }
      }
    }
  }
}
Polymer(cranberryMap);
