class CranberryContentList {
  beforeRegister() {
    this.is = 'cranberry-content-list';
    this.properties = {
      items: {
        type: Object,
        value: []
      },
      sections: {
        type: String
      },
      previousSection: String,
      hidePreviousButton: {
        type: Boolean,
        value: true
      },
      hidden: {
        type: Boolean,
        reflectToAttribute: true,
        value: true
      },
      displayTout: {
        type: Boolean,
        value: false
      },
      tag: {
        type: String
      },
      tags: {
        type: Boolean,
        value: false
      },
      trackedSection: {
        type: String,
        observer: '_setPrevious'
      },
      trackedParentSection: String
    };
    this.observers = [
      '_displayTout(hidden, trackedSection)',
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

  _checkJobsWidget(index) {
      if (index === 11) {
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

  _displayTout(hidden, section) {
    this.set('displayTout', false);
    this.async(function() {
      if (typeof section !== 'undefined' && section.length > 0) {
        if (hidden) {
          this.set('displayTout', false);
        } else {
          let previous = this.get('previousSection');

          if (section === previous) {
            this.set('displayTout', false);
          } else {
            this.set('displayTout', true);
          }
        }
      }
    });
  }

  _hiddenChanged(hidden, oldHidden) {
    if (typeof hidden !== 'undefined' && hidden) {
      this._destroyNativo();
    }
  }

  _destroyNativo() {
    let nativoAds = this.querySelectorAll('.ntv-ad-div');

    nativoAds.forEach((value, index) => {
      value.innerHTML = '';
    });
  }

  _setPrevious(section, oldSection) {
    if (typeof section !== 'undefined') {
      this.set('previousSection', oldSection);
    }
  }
}

Polymer(CranberryContentList);
