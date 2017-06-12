class CranberryContentList {
  beforeRegister() {
    this.is = 'cranberry-content-list';
    this.properties = {
      dfpObject: Object,
      galleries: {
        type: Boolean,
        value: false
      },
      hidden: {
        type: Boolean,
        reflectToAttribute: true,
        value: true
      },
      homepage: {
        type: Boolean,
        value: false
      },
      items: {
        type: Object,
        value: []
      },
      tags: String,
      tagsPage: {
        type: Boolean,
        value: false
      }
    };
    this.observers = [
      '_hiddenChanged(hidden)'
    ];
  }

  attached() {
    console.info('\<cranberry-content-list\> attached');

    this._updateGridStyles = this._updateGridStyles || function() {
      this.updateStyles();
    }.bind(this);

    window.addEventListener('resize', this._updateGridStyles);

  }

  detached() {
    window.removeEventListener('resize', this._updateGridStyles);
  }

  _checkInStreamAd(index) {
    if (index === 2 || index === 11) {
      return true;
    } else {
      return;
    }
  }

  _checkAdPos(index, desiredIndex) {
    if (index === desiredIndex) {
      return true;
    } else {
      return;
    }
  }

  _checkNativeAd(index) {
    if (index === 2 || index === 15) {
      return true;
    } else {
      return;
    }
  }

  _checkNativeShareThrough(homepage, index) {
    if (homepage && index === 2) {
      return true;
    } else {
      return false;
    }
  }

  _checkLeaderboardAd(index) {
    if (index === 8 || index === 17) {
      return true;
    } else {
      return;
    }
  }

  _checkToutPlacement(index) {
    if (index === 8) {
      return true;
    } else {
      return;
    }
  }

  _checkJobsWidget(index) {
      if (index === 11) {
          return true;
      } else {
          return;
      }
  }

  _checkTopComments(index) {
    if (index === 3) {
      return true;
    } else {
      return;
    }
  }

  _hasPreview(preview) {
    if (typeof preview !== 'undefined' && preview.length > 0) {
      return true;
    } else {
      return;
    }
  }

  _hiddenChanged(hidden, oldHidden) {
    if (typeof hidden !== 'undefined' && hidden) {
      this._destroyNativo();
    }
  }

  _destroyNativo() {
    let nativoAds = Polymer.dom(this).querySelectorAll('.ntv-ad-div');

    if (nativoAds.length > 0) {
      nativoAds.forEach((value, index) => {
        value.innerHTML = '';
      });
    }
  }

  _computeNativoId(index) {
    let homepage = this.get('homepage');
    let galleries = this.get('galleries');
    let tagsPage = this.get('tagsPage');
    
    let id = 'nativo-';
    if (homepage) {
      id += 'homepage-';
    } else if (galleries) {
      id += 'galleries-';
    } else if (tagsPage) {
      id += 'tags-'
    } else {
      id += 'section-'
    }

    id +=  + (index === 2 ? '1' : '2');

    return id;
  }
}

Polymer(CranberryContentList);
