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
      },
      featured: Boolean,
      index: Number
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
      let temp = tag.replace(/_/g, ' ');;

      return temp;
    } else {
      return '';
    }
  }

  _computeImageSize(image) {
    let featured = this.get('featured');

    if (typeof image !== 'undefined') {
      if (typeof featured !== 'undefined' && featured) {
        return image.exlarge;
      } else {
        return image.medium;
      }
    }
  }

  _setupTracking(item) {
    let index = this.get('index');
    let featured = this.get('featured');

    if (featured) {
      console.log('uti_ftrd_' + index + ((item.contentType === 'Story') ? '_stdc' : '_stgc'));
      return 'uti_ftrd_' + index + ((item.contentType === 'Story') ? '_stdc' : '_stgc');
    } else {
      if (typeof item !== 'undefined') {
        return 'uti_strm_' + index + ((item.contentType === 'Story') ? '_stdc' : '_stgc');
      }
    }
  }
}
Polymer(CranberryCard);
