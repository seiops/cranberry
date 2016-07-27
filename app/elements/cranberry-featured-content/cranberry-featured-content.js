class CranberryFeaturedContent {
  beforeRegister() {
    this.is = 'cranberry-featured-content';
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
    app.logger ('<\cranberry-featured-content\> attached');
    this.updateStyles();
  }

  ready () {
    app.logger('\<cranberry-featured-content\> ready');
  }

  // Private methods.
  _changeParams () {
    let params = this.get('params');

    if (params.length !== 0 && params.desiredCount) {

      this.$.request.setAttribute('url', this.get('rest'));

      let derp = this.$.request.getAttribute('url');

      console.log('derp: ', derp);

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
    app.logger ('<\cranberry-featured-content\> section changed -\> ' + section);

    this._updateParams();
  }

  _changeType () {
    app.logger ('<\cranberry-featured-content\> type changed');
  }

  _firstItem (item, index) {
    if (index === 0) {
      return true;
    } else {
      return false;
    }
  }

  _handleResponse () {
    app.logger ('<\cranberry-featured-content\> response received');
  }

  _handleLoad (data) {
    let response = this.get('response');

    let responseItems = JSON.parse(response.Result);

    this.set('items', responseItems);
  }

  _updateParams () {
    this.$.request.abortRequest();

    this.set('items',[]);

    let jsonp = {};

    jsonp.request = 'content-list';
    jsonp.desiredSection = this.get('sections');
    jsonp.desiredContent = this.get('type');
    jsonp.desiredCount = this.get('count');

    this.set('params', jsonp);
  }
}

Polymer(CranberryFeaturedContent);
