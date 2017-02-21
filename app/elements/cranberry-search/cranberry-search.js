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
      isSearching: {
        type: Boolean,
        value: false
      },
      loadSection: {
        type: String,
        value: 'news'
      },
      hidden: {
        type: Boolean,
        reflectToAttribute: true,
        value: true
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
    this.set('start', 1);
    this.set('displayQuery', 'Search');
    // this.$.searchRe._clear();
  }

  _requestSearch(queryString, move) {

    if (typeof queryString !== 'undefined' && queryString !== '') {
      this.set('noQuery', false);
      this.set('isSearching', true);
      
      // Set the display string for the query to display to the user
      let displayQuery = decodeURI(queryString);
      this.set('displayQuery', displayQuery);

      // Establish the JSONP parameters
      let params = {};

      params.cref = 'www.sanduskyregister.com';
      params.cx = '011196976410573082968:7m7hlyxbyte';
      params.siteSearch = 'www.sanduskyregister.com';
      params.key = 'AIzaSyCMGfdDaSfjqv5zYoS0mTJnOT3e9MURWkU';
      params.num = 10;
      params.q = queryString;

      if (typeof move !== 'undefined') {
        params.start = move;
      } else {
        this.set('start', 1);
        params.start = 1;
      }

      let request = this.$.searchRequest;

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
      console.dir(response);
      if (typeof response !== 'undefined' && typeof response.items !== 'undefined') {
        this.set('items', response.items);

        this.set('totalResults', parseInt(response.searchInformation.totalResults));
        this._sendPageviews();
      }
      this.set('isSearching', false);
  }

  _sendPageviews() {
    let route = this.get('route');
    let author = this.get('author');

    if (typeof route !== 'undefined' && typeof route.path !== 'undefined') {
      this.fire('iron-signal', {name: 'track-page', data: { path: '/search' + route.path, data: { 'dimension7': route.path.replace('/', '') } } });
      this.fire('iron-signal', {name: 'chartbeat-track-page', data: { path: '/search' + route.path, data: {'sections': route.path.replace('/', ''), 'authors': author } } });
      this.fire('iron-signal', {name: 'page-hit'});
    }
  }

  _hasImage(image) {
    if (typeof image !== 'undefined') {
      let staticImage = image.includes('/libercus/default/staticImages/static.jpg');

      if (!staticImage) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
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
    } else {
      return '';
    }
  }
}
Polymer(cranberrySearch);
