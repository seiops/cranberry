class cranberrySearch {
  beforeRegister() {
    this.is = 'cranberry-search';
    this.properties = {
      dfpAdSection: String,
      dfpObject: {
        type: Object,
        computed: '_computeDfpObject(dfpAdSection)'
      },
      displayQuery: {
        type: String,
        value: 'Search'
      },
      hidden: {
        type: Boolean,
        reflectToAttribute: true,
        value: false,
        observer: '_clearResults'
      },
      firstSearch: {
        type: Boolean,
        value: true
      },
      isSearching: {
        type: Boolean,
        value: false
      },
      items: Object,
      noQuery: {
        type: Boolean,
        value: true
      },
      queryString: String,
      response: {
        type: Object,
        observer: '_parseResponse'
      },
      request: Object,
      rest: String,
      route: Object,
      sortOrder: {
        type: String,
        value: 'relevance',
        observer: '_sortOrderChanged'
      },
      start: {
        type: Number,
        value: 1,
        observer: '_onStartChanged'
      },
      totalResults: Number
    };
    this.observers = ['_requestSearch(queryString)',
                      '_onRouteChanged(route)']
  }

  _computeDfpObject(dfpAdSection) {
    return {
            adSection: this.dfpAdSection,
            content: 'search',
            placement: (window.location.host === 'www.sanduskyregister.com' ? 'production' : 'development')
          };
  }

  _clearResults(hidden, oldHidden) {
    if (typeof hidden !== 'undefined' && typeof oldHidden !== 'undefined') {
      if (hidden) {
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
  }

  _resetParams() {
    // Run through a reset of all params for the search page
    this.set('route', {});
    this.set('items', []);
    this.set('start', 1);
    this.set('displayQuery', 'Search');
  }

  _requestSearch(queryString, move) {
    let sortOrder = this.get('sortOrder').toLowerCase();

    if (typeof queryString !== 'undefined' && queryString !== '') {

      let firstSearch = this.get('firstSearch');

      if (!firstSearch) {
        this._refreshAds();
      } else {
        this.set('firstSearch', false);
      }

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
      
      if (sortOrder === 'date') {
        params.sort = sortOrder;
      }
      
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
    }
  }

  _refreshAds() {
    this.async(() => {
      console.info('<\cranberry-search\> refreshing ads');
      let ads = Polymer.dom(this.root).querySelectorAll('google-dfp');

      if (ads.length > 0) {
        ads.forEach((value, index) => {
          value.refresh();
        });
      }
    });
  }

  _onStartChanged(newValue, oldValue) {
    if (typeof oldValue !== 'undefined') {
      let hidden = this.get('hidden');
      // Get the current query string
      let query = this.get('queryString');

      // Genereate new card request based on new start value
      this._requestSearch(query, newValue);

      window.scrollTo(0,0);
    }
  }

  _handleLoad() {
      console.info('<\cranberry-search\> load received');
  }

  _handleResponse() {
      console.info('<\cranberry-search\> response received');
  }

  _parseResponse(response) {
      if (typeof response !== 'undefined' && typeof response.items !== 'undefined') {
        console.dir(response.items);
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
      this.fire('iron-signal', {name: 'track-page', data: { path: '/search' + route.path, data: { 'dimension6': 'Search' } } });
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

  _sortOrderChanged(sortOrder, oldSortOrder) {
    if (typeof sortOrder !== 'undefined' && typeof oldSortOrder !== 'undefined' && sortOrder !== '') {
      console.info('<\cranberry-search\> sort order changed: ', sortOrder);
      let queryString = this.get('queryString');
      this._resetParams();
      this._requestSearch(queryString, undefined);
    }
  }

  _parseItemLink(link) {
    let parser = document.createElement('a');
    parser.href = link;
    return parser.pathname;
  }
}
Polymer(cranberrySearch);
