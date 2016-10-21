class CranberryCard {
  beforeRegister() {
    this.is = 'cranberry-card';
    this.properties = {
      background: {
        type: String,
        value: ''
      },
      item: {
        type: Object,
        value: {}
      }
    }
  }

  ready() {}

  attached () {}

  _trimText(text) {
    if(typeof text !== 'undefined'){
      let trunc = text;
      if (trunc.length > 125) {
          trunc = trunc.substring(0, 125);
          trunc = trunc.replace(/\w+$/, '');
          trunc += '...';
      }
      return trunc;
    }
  }

  _checkGallery(type) {
    if (typeof type !== 'undefined' && type === 'Gallery') {
      return true;
    } else {
      return false;
    }
  }

  _computeUrl(item) {
    if(typeof item !== 'undefined' && item !== null && typeof item.contentType !== 'undefined'){
      let prefix = '/';

      switch(item.contentType) {
        case 'Story':
        prefix += 'story';
        break;
        case 'Gallery':
        prefix += 'photo-gallery';
        break;
      }

      let url = prefix + '/' + item.itemId;

      return url;
    }
  }

  _computeHeadingClass (image) {
    let cssClass = 'title-text';

    if (image) {
      cssClass += ' over-image';
    }

    return cssClass;
  }

  _scrubTag(tag) {
    if (typeof tag !== 'undefined' && tag !== '') {
      let temp = tag.replace('_', ' ');

      return temp;
    } else {
      return '';
    }
  }
}
Polymer(CranberryCard);
