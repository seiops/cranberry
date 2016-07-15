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
  }

  ready () {
    app.logger('\<cranberry-featured-content\> ready');
  }

  // Private methods.
  _changeParams () {
    let params = this.get('params');

    if (params.length !== 0 && params.desiredCount) {
      this.$.request.url = this.rest;

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

  _handleResponse (data) {
    let restResponse = JSON.parse(data.detail.Result);

    this.set('items', restResponse);
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
