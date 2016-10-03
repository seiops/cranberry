class cranberryCard {
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

  ready() {

  }

  attached () {
    // this.async(function () {
    //   let item = this.get('item');
    //   console.dir(item);
    // })
  }

  _checkImage (src) {
    if (src.length > 0) {
      return src
    }
  }

  // _isStory(item) {
  //     if (item === 'Story') {
  //         return true;
  //     } else {
  //         return;
  //     }
  // }
  //
  // _isGallery(item) {
  //     if (item === 'Gallery') {
  //         return true;
  //     } else {
  //         return;
  //     }
  // }
  //
  // _hasImage(image) {
  //     if (typeof image !== 'undefined' && image.length > 0) {
  //         return true;
  //     } else {
  //         return;
  //     }
  // }
  //
  _trimText(text) {
      let trunc = text;

      if (trunc.length > 125) {
          trunc = trunc.substring(0, 125);
          trunc = trunc.replace(/\w+$/, '');
          trunc += '...';
      }

      return trunc;
  }

  _computeUrl(item) {
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

    console.dir(url);

    return url;
  }

  _computeHeadingClass (image) {
    let cssClass = 'title-text';

    if (image) {
      cssClass += ' over-image';
    }
    
    return cssClass;
  }

  //
  // _checkMainList() {
  //   let main = this.get('main');
  //   let list = this.get('list');
  //
  //   if (main) {
  //     return 'main-card';
  //   }
  //
  //   if (list) {
  //     return 'list-card';
  //   }
  // }
  //
  _scrubTag(tag) {
    if (typeof tag !== 'undefined' && tag !== '') {
      let temp = tag.replace('_', ' ');

      return temp;
    } else {
      return '';
    }

  }
}
Polymer(cranberryCard);
