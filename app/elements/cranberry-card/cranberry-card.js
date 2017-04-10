class CranberryCard {
  beforeRegister() {
    this.is = 'cranberry-card';
    this.properties = {
      background: {
        type: String,
        value: ''
      },
      cardStyle: {
        type: String,
        computed: '_computeCardStyle(item, featured, homepage)'
      },
      featured: {
        type: Boolean,
        value: false
      },
      homepage: {
        type: Boolean,
        value: false
      },
      index: Number,
      item: {
        type: Object,
        value: function() {
          return {};
        }
      }
    };
  }

  ready() {}

  attached () {}

  _checkShowMainImage(style) {
    if (style === 'standard' || style === 'gallery' || style === 'featured' || style === 'featured_gallery') {
      return true;
    } else {
      return false
    }
  }

  _checkShowThumbImage(style) {
    if (style === 'square_image') {
      return true;
    } else {
      return false;
    }
  }

  _checkStyle(sectionStyle, homeStyle, homepage, featured, numberOfImages) {
    if (numberOfImages === 0) {
      return 'text_only';
    }

    if (featured) {
      return 'featured';
    }

    let style = (homepage ? homeStyle : sectionStyle);

    switch (style) {
      case '1': 
        return 'standard';
        break;
      case '2':
        this.set('featured', true);
        return 'featured'
        break;
      case '3':
        return 'text_only';
        break;
      case '4':
        return 'square_image';
        break;
    }
  }

  _computeCardStyle(item, featured, homepage) {
    if (typeof item !== 'undefined' && Object.keys(item).length > 0) {
      if (item.contentType === 'Story') {
        let numberOfImages = (typeof item.mediaAssets.images !== 'undefined' ? item.mediaAssets.images.length : 0);
        let cardStyle = this._checkStyle(item.sectionStyle, item.homeStyle, homepage, featured, numberOfImages);

        return cardStyle;
      } else {
        return (item.contentType === 'Gallery' && featured ? 'featured_gallery' : 'gallery');
      }
    }
  }
  
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

  _computeHeadingClass (style) {
    let cssClass = 'title-text';

    if (style === 'featured' || style === 'standard' || style === 'gallery' || style === 'featured_gallery') {
      cssClass += ' over-image';
    }

    if (style === 'square_image') {
      cssClass += ' square-image-title';
    }

    return cssClass;
  }

  _computeImageClass(style) {
    let cssClass = 'main-image';

    if (style === 'square_image') {
      cssClass = 'square-image';
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
    if (typeof image !== 'undefined') {
      let cardStyle = this.get('cardStyle');

      if (cardStyle === 'square_image') {
        return image.thumbnail;
      } else if (cardStyle === 'featured' || cardStyle === 'featured_gallery') {
        return image.exlarge;
      } else {
        return image.medium;
      }
    }
  }

  _setupTracking(item) {
    if (typeof item !== 'undefined') {
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
}
Polymer(CranberryCard);
