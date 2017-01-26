class youneeqContent {
  beforeRegister() {
    this.is = 'youneeq-content';
    this.properties = {
      content: {
        type: Object
      },
      items: {
        type: Object
      },
      hasItems: {
        type: Boolean,
        value: false
      },
      domain: {
        type: String
      }
    };
    this.listeners = {
      'youneeq-suggestions': 'suggestionsRecieved'
    };
  }

  suggestionsRecieved(event) {
    let suggestions = event.detail.content;

    this.set('hasItems', true);
    this.set('items', suggestions);
  }

  _checkImage(image) {
    if (image !== '' && image.charAt(0) === '/') {
      let domain = this.get('domain');
      return domain + image;
    } else {
      return image;
    }
  }

  _index(index) {
    if (index === 3) {
      return true;
    }
  }

  _computeSectionName(sectionName) {
    if (typeof sectionName === 'undefined' || sectionName === '') {
      return 'news';
    } else {
      return sectionName;
    }
  }
}
Polymer(youneeqContent);
