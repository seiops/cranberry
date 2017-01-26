class cranberrySearch {
  beforeRegister() {
    this.is = 'cranberry-search';
    this.properties = {
      route: {
        type: Object
      },
      queryString: {
        type: String
      },
      displayQuery: {
        type: String,
        value: 'Search'
      },
      response: {
        type: Object,
        observer: '_parseResponse'
      },
      request: Object,
      items: {
        type: Object
      },
      start: {
        type: Number,
        value: 1,
        observer: '_onStartChanged'
      },
      totalResults: {
        type: Number
      },
      isNext: {
        Boolean,
        value: true
      },
      isPrev: {
        type: Boolean,
        value: false
      },
      isSearching: {
        type: Boolean,
        value: false
      },
      loadSection: {
        type: String,
        value: 'news'
      },
      hidden: {
        type: Boolean
      },
      rest: {
        type: String
      },
      noQuery: {
        type: Boolean,
        value: true
      }
    };
    // this.listeners = {
    //   'next.tap': '_paginate',
    //   'prev.tap': '_paginate'
    // };
    this.observers = ['_requestSearch(queryString)',
                      '_clearResults(hidden)',
                      '_onRouteChanged(route)']
  }

  _clearResults(hidden) {
    if (hidden === true) {

      this._checkCurrentRequest();

      let results = this.$.searchContent;

      if (Polymer.dom(results).firstChild) {
        this._resetParams();
      }
    } else {
      this.async(function() {
        let queryString = this.get('queryString');
        this._requestSearch(queryString);
      });
    }
  }

  _resetParams() {
    // Run through a reset of all params for the search page
    this.set('route', {});
    this.set('items', []);
    this.set('isPrev', false);
    this.set('isNext', true);
    this.set('start', 1);
    this.set('displayQuery', 'Search');
    // this.$.searchRe._clear();
  }

  _requestSearch(queryString, move) {
    if (typeof queryString !== 'undefined' && queryString !== '') {
      this.set('noQuery', false);
      this.set('isSearching', true);
      // Set the display string for the query to display to the user
      this.set('displayQuery', queryString.replace(/\+/g, ' '));
      // Establish the JSONP parameters
      let params = {};

      params.request = 'search';
      params.desiredCount = 20;
      params.query = queryString;

      if (typeof move !== 'undefined') {
        params.desiredStart = move;
      } else {
        this.set('start', 1);
        params.desiredStart = 1;
      }

      let request = this.$.searchRequest;

      request.setAttribute('url', this.get('rest'));
      request.params = params;
      request.generateRequest();
    }
  }

  _onRouteChanged(newValue) {
    let hidden = this.get('hidden');
    // Check if route.path is valid
    if (newValue.path !== null && typeof newValue.path !== 'undefined') {
      let queryString = newValue.path.replace('/', '');
      this.set('queryString', queryString);

      if (!hidden || typeof hidden === 'undefined') {
        // Set location to undefined to trigger the same value being placed in as a new value ** Ad refresh**
        this.set('loadSection', undefined);
        this.set('loadSection', 'news');
      }
    }
  }

  _onStartChanged(newValue, oldValue) {
    let hidden = this.get('hidden');
    // Reload the ads
    if (!hidden || typeof hidden === 'undefined') {
      // Set location to undefined to trigger the same value being placed in as a new value ** Ad refresh**
      this.set('loadSection', undefined);
      this.set('loadSection', 'news');
    }
    // Get the current query string
    let query = this.get('queryString');

    // Genereate new card request based on new start value
    this._requestSearch(query, newValue);

    window.scrollTo(0,0);
  }

  _handleLoad() {
      console.info('<\cranberry-search\> load received');
  }

  _handleResponse() {
      console.info('<\cranberry-search\> response received');
  }

  _parseResponse(response) {
      var result = JSON.parse(response.Result);

      if (result.length !== 20) {
        this.set('isNext', false);
      }

      this.set('items', result);
      this.set('totalResults', parseInt(result[0].totalResults));

      this._sendPageviews();

      this.set('isSearching', false);
  }

  _sendPageviews() {
    let route = this.get('route');
    let author = this.get('author');

    if (typeof route !== 'undefined') {
      this.fire('iron-signal', {name: 'track-page', data: { path: '/search' + route.path, data: { 'dimension7': route.path.replace('/', '') } } });
      this.fire('iron-signal', {name: 'chartbeat-track-page', data: { path: '/search' + route.path, data: {'sections': route.path.replace('/', ''), 'authors': author } } });
      this.fire('iron-signal', {name: 'page-hit'});
    }
  }

  _hasImage(image) {
      if (typeof image !== 'undefined' && image.length > 0) {
          return true;
      } else {
          return;
      }
  }

  _checkCurrentRequest() {
    let request = this.$.searchRequest;

    if (request.loading === true) {
      request.abortRequest();
    }
  }

  _hideResultsArea(searching, noQuery) {
    if (searching || noQuery) {
      return true;
    } else {
      return false;
    }
  }

  _trimText(text, desktop, tablet, mobile) {
    let truncLength = 125;

    if (mobile) {
      truncLength = 60;
    } else if (tablet) {
      truncLength = 80;
    }

    if(typeof text !== 'undefined') {
      let trunc = text;
      if (trunc.length > truncLength) {
          trunc = trunc.substring(0, truncLength);
          trunc = trunc.replace(/\w+$/, '');
          trunc += '...';
      }
      return trunc;
    }
  }
}
Polymer(cranberrySearch);
