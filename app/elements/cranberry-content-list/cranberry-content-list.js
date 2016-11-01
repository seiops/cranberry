class CranberryContentList {
  beforeRegister() {
    this.is = 'cranberry-content-list';
    this.properties = {
      items: {
        type: Object,
        value: []
      },
      sections: {
        type: String,
        observer: '_changeSections'
      },
      hidePreviousButton: {
        type: Boolean,
        value: true
      },
      tag: {
        type: String
      },
      tags: {
        type: Boolean,
        value: false
      },
      trackedSection: String,
      trackedParentSection: String
    };
  }

  attached() {
    app.logger('\<cranberry-content-list\> attached');

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
}

Polymer(CranberryContentList);
