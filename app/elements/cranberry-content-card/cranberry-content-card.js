class cranberryContentCard {
  beforeRegister() {
    this.is = 'cranberry-content-card';
    this.properties = {
      item: {
        type: Object
      },
      content: {
        type: Boolean,
        value: false
      },
      featured: {
        type: Boolean,
        value: false
      },
      main: {
        type: Boolean,
        value: false
      },
      list: {
        type: Boolean,
        value: false
      },
      slider: {
        type: Boolean,
        value: false
      }
    }
  }

  ready() {

  }

  _isStory(item) {
      if (item === 'Story') {
          return true;
      } else {
          return;
      }
  }

  _isGallery(item) {
      if (item === 'Gallery') {
          return true;
      } else {
          return;
      }
  }

  _hasImage(image) {
      if (typeof image !== 'undefined' && image.length > 0) {
          return true;
      } else {
          return;
      }
  }

  _trimText(text) {
      let trunc = text;

      if (trunc.length > 125) {
          trunc = trunc.substring(0, 125);
          trunc = trunc.replace(/\w+$/, '');
          trunc += '...';
      }

      return trunc;
  }

  _checkMainList() {
    let main = this.get('main');
    let list = this.get('list');

    if (main) {
      return 'main-card';
    }

    if (list) {
      return 'list-card';
    }
  }

  _scrubTag(tag) {
    let temp = tag.replace('_', ' ');

    return temp;
  }
}
Polymer(cranberryContentCard);
