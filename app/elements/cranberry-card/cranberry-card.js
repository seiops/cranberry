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
        case 'Jail-Mug':
        prefix += 'jail-mugs';
        break;
      }
      let url = prefix;

      if (typeof item.itemId !== 'undefined') {
        url = prefix + '/' + item.itemId;
      }

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

  _scrubTag(sectionInformation) {
    let temp = '';

    if (typeof sectionInformation !== 'undefined' && typeof sectionInformation.sectionName !== 'undefined') {
      temp += sectionInformation.sectionName.replace(/_/g, ' ').toLowerCase();
    } else {
      if (typeof sectionInformation !== 'undefined' && typeof sectionInformation.sectionParent !== 'undefined') {
        temp += sectionInformation.sectionParent.replace(/_/g, ' ').toLowerCase();
      }
    }

    return temp;
  }

  _scrubTagUrl(sectionInformation) {
    if (typeof sectionInformation !== 'undefined' && sectionInformation.sectionLabel !== 'undefined' && sectionInformation.sectionLabel !== 'jail-mugs') {
      let temp = '/section/' + sectionInformation.sectionLabel.replace(/_/g, '-').replace('-and', '').toLowerCase();

      return temp;
    } else if (typeof sectionInformation !== 'undefined' && sectionInformation.sectionLabel !== 'undefined' && sectionInformation.sectionLabel === 'jail-mugs') {
      let temp = sectionInformation.sectionLabel.toLowerCase();

      return temp;
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
      return 'uti_ftrd_' + index + ((item.contentType === 'Story') ? '_stdc' : '_stgc');
    } else {
      if (typeof item !== 'undefined') {
        if (typeof item.mediaAssets.images !== 'undefined' && typeof item.mediaAssets.images[0] !== 'undefined') {
          return 'uti_strm_' + index + ((item.contentType === 'Story') ? '_stdc' : '_stgc');
        } else {
          return 'uti_strm_' + index + '_txtc';
        }
        
      }
    }
  }
}
Polymer(CranberryCard);
