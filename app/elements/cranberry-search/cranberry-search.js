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
        value: true
      },
      loadSection: {
        type: String,
        value: 'news'
      },
      hidden: {
        type: Boolean
      }
    };
    this.listeners = {
      'next.tap': '_paginate',
      'prev.tap': '_paginate'
    };
    this.observers = ['_requestSearch(queryString)',
                      '_clearResults(hidden)',
                      '_onRouteChanged(route)']
  }

  _clearResults(hidden) {
    console.info('Search is now hidden: ' + hidden);
    if (hidden === true) {

      this._checkCurrentRequest();

      let results = this.$.searchContent;

      if (Polymer.dom(results).firstChild) {
        this._resetParams();
      }
    } else {
      this.async(function() {
        let queryString = this.get('queryString');
        console.info(queryString);
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
    this.$.search._clear();
  }

  _paginate(e) {
    let hidden = this.get('hidden');
    // Reload the ads
    if (!hidden || typeof hidden === 'undefined') {
      // Set location to undefined to trigger the same value being placed in as a new value ** Ad refresh**
      this.set('loadSection', undefined);
      this.set('loadSection', 'news');
    }
    // Pagination function
    // Establish direction
    let direction = e.target.id;
    let move = 0;
    // Set move based on direction
    if (direction === "next") {
      move = 20;
    } else {
      move = -20;
    }

    // Get the current start value
    let start = this.get('start');
    // Asign new start value
    let totalMove = start + move;

    // Set current start value to new start value
    this.set('start', totalMove);

    // Get the current query string
    let query = this.get('queryString');

    // Genereate new card request based on new start value
    this._requestSearch(query, totalMove);

    window.scrollTo(0,0);
  }

  _requestSearch(queryString, move) {
    if (queryString !== '' && typeof queryString !== 'undefined') {
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
      }

      let request = this.$.request;

      request.setAttribute('url', 'http://sestgcore.libercus.net/rest.json');
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

  _onStartChanged(newValue) {
    if (newValue > 1) {
      this.set('isPrev', true);
    }
  }

  _handleLoad() {
      app.logger('<\cranberry-search\> load received');
  }

  _handleResponse() {
      app.logger('<\cranberry-search\> response received');
  }

  _parseResponse(response) {
      console.info('Parsing response!');
      var result = JSON.parse(response.Result);

      if (result.length !== 20) {
        this.set('isNext', false);
      }

      this.set('items', result);
      this.set('isSearching', false);
  }

  _search() {
    this._checkCurrentRequest();
    this.async(function() {
      // Establish the query string
      let searchBar = this.$.search;
      // Replace all spaces with a plus sign
      let query = searchBar.query.replace(/ /g, '+');

      // Change the app location to match search and the query string
      let appLocation = document.querySelector('app-location');
      appLocation.set('path', '/search/' + query);
    });
  }

  _hasImage(image) {
      if (typeof image !== 'undefined' && image.length > 0) {
          return true;
      } else {
          return;
      }
  }

  _checkCurrentRequest() {
    let request = this.$.request;

    if (request.loading === true) {
      request.abortRequest();
    }
  }
}
Polymer(cranberrySearch);
