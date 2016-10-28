class cranberryNewsArchive {
  beforeRegister() {
    this.is = 'cranberry-news-archive';
    this.properties = {
      yearArray: Array,
      quickSearch: {
        type: Boolean,
        value: true
      }
    }
  }

  attached() {
    let date = new Date();
    let yearArray = [];

    for (let i = 2001; i <= date.getFullYear(); i++) {
      yearArray.push(i);
    }

    this.set('yearArray', yearArray);
  }

  _handleSubmit(event) {
    Polymer.dom(event).localTarget.parentElement.submit();
  }
}
Polymer(cranberryNewsArchive);
