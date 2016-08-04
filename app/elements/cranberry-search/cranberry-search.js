class cranberrySearch {
  beforeRegister() {
    this.is = 'cranberry-search';
    this.properties = {
      route: {
        type: Object,
        observer: 'onRouteChanged'
      },
      queryString: {
        type: String
      },
      displayQuery: {
        type: String,
        value: 'Search'
      },
      items: {
        type: Object
      },
      start: {
        type: Number,
        value: 1,
        observer: 'onStartChanged'
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
      hidden: {
        type: Boolean
      }
    };
    this.listeners = {
      'next.tap': 'paginate',
      'prev.tap': 'paginate'
    };
    this.observers = ['requestSearch(queryString)',
                      'clearResults(hidden)']
  }

  clearResults(hidden) {
    console.info('Search is now hidden: ' + hidden);
    if (hidden === true) {
      let results = this.$.searchContent;

      if (Polymer.dom(results).firstChild) {
        this._resetParams();
      }
    }
  }

  _resetParams() {
    // Run through a reset of all params for the search page
    this.set('items', []);
    this.set('isPrev', false);
    this.set('isNext', true);
    this.set('start', 1);
    this.set('displayQuery', 'Search');
  }

  paginate(e) {
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
    this.requestSearch(query, totalMove);

    window.scrollTo(0,0);
  }

  requestSearch(queryString, move) {
    this.set('isSearching', true);
    console.info("BUILD SEARCH!!!!");
    console.info(queryString);
    let params = {};

    params.request = 'search';
    params.desiredCount = 20;
    params.query = queryString;

    if (typeof move !== 'undefined') {
      params.desiredStart = move;
    }

    this.$.request.setAttribute('url', 'http://sestgcore.libercus.net/rest.json');
    this.$.request.params = params;
    this.$.request.generateRequest();
  }

  onRouteChanged(newValue) {
    // Check if route.path is valid
    if (newValue.path !== null && typeof newValue.path !== 'undefined') {
      let queryString = newValue.path.replace('/', '');
      this.set('queryString', queryString);
      this.set('displayQuery', queryString.replace(/\+/g, ' '));
    }
  }

  onStartChanged(newValue) {
    if (newValue > 1) {
      this.set('isPrev', true);
    }
  }

  _handleResponse(response) {
    var result = JSON.parse(response.detail.Result);

    console.info(result);

    if (result.length !== 19) {
      this.set('isNext', false);
    }

    this.set('items', result);
    this.set('isSearching', false);
  }

  search() {
    // Establish the query string
    let searchBar = this.$.search;
    // Replace all spaces with a plus sign
    let query = searchBar.query.replace(/ /g, '+');

    // Change the app location to match search and the query string
    let appLocation = document.querySelector('app-location');
    appLocation.set('path', '/search/' + query);
  }

  _hasImage(image) {
      if (typeof image !== 'undefined' && image.length > 0) {
          return true;
      } else {
          return;
      }
  }
}
Polymer(cranberrySearch);
