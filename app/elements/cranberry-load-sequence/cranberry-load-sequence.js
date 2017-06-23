class cranberryLoadSequence {
  beforeRegister() {
    this.is = 'cranberry-load-sequence';
    this.properties = {
      displayText: {
        type: String,
        value: 'Gathering todays news...'
      },
      loading: {
        type: Boolean,
        value: true
      }
    };
  }
}

Polymer(cranberryLoadSequence);
