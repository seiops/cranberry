class cranberryNewsArchive {
  beforeRegister() {
    this.is = 'cranberry-news-archive';
    this.properties = {
      yearArray: Array,
      quickSearch: {
        type: Boolean,
        value: true
      },
      startYear: {
        type: Object,
        observer: 'sectionItemChanged'
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
    let dummyForm = this.$.form;

    form.submit();
    // Polymer.dom(event).localTarget.parentElement.submit();
  }

  sectionItemChanged(newValue) {
    console.dir(newValue);
  }
}
Polymer(cranberryNewsArchive);
