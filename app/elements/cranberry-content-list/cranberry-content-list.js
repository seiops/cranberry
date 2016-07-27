class CranberryContentList {
  beforeRegister() {
    this.is = 'cranberry-content-list';
    this.properties = {
      count: {
        type: Number
      },
      items: {
        type: Object,
        value: []
      },
      params: {
        type: Object,
        value: [],
        observer: '_changeParams'
      },
      rest: {
        type: String,
        value: 'http://sedev.libercus.net/rest.json'
      },
      sections: {
        type: String,
        observer: '_changeSections'
      },
      start: {
        type: Number
      },
      type: {
        type: String
      }
    };
  }

  // Public methods.
  attached () {
    app.logger('\<cranberry-content-list\> attached');
  }

  ready () {
    app.logger('\<cranberry-content-list\> ready');
  }

  // Private methods
  _changeParams () {
    let params = this.get('params');

    if (params.length !== 0 && params.desiredCount) {

      this.$.request.setAttribute('url', this.get('rest'));

      // Shimmed timestamper.
      if (!Date.now) {
          Date.now = function() { return new Date().getTime(); }
      }

      var timeStamp = Math.floor(Date.now() / 1000);

      this.$.request.setAttribute('callback-value', 'cb' + timeStamp);

      this.$.request.params = params;

      this.$.request.generateRequest();
    }
  }

  _changeSections (section) {
    app.logger ('<\cranberry-content-list\> section changed -\> ' + section);

    this._updateParams();
  }

  _checkInStreamAd (item, index) {
    let modulus = index % 6;

    if (index > 0 && modulus === 0) {
      return true;
    } else {
      return false;
    }
  }

  _checkLeaderboardAd (item, index) {
    let modulus = index % 10;

    if (index > 0 && modulus === 0) {
      return true;
    } else {
      return false;
    }
  }

  _handleResponse (data) {
    app.logger ('<\cranberry-featured-content\> response received');

    let response = data.detail;

    let responseItems = JSON.parse(response.Result);

    this.set('items', responseItems);
  }

  _handleLoad () {}

  _hasImage (image) {
    if(typeof image !== 'undefined' && image.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  _hasPreview (preview) {
    if(typeof preview !== 'undefined' && preview.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  _isStory (item) {
    if(item === 'Story') {
      return true;
    } else {
      return false;
    }
  }

  _trimText (text) {
    let trunc = text;

    if (trunc.length > 125) {
      trunc = trunc.substring(0, 125);
      trunc = trunc.replace(/\w+$/, '');
      trunc += '...';
    }

    return trunc;
  }

  _updateParams () {
    this.$.request.abortRequest();

    this.set('items', []);

    let jsonp = {};

    jsonp.request = 'content-list';
    jsonp.desiredSection = this.get('sections');
    jsonp.desiredContent = this.get('type');
    jsonp.desiredCount = this.get('count');

    this.set('params', jsonp);
  }

}

Polymer(CranberryContentList);
