class cranberrySearch {
  beforeRegister() {
    this.is = 'cranberry-search';
    this.properties = {
      dfpObject: {
        type: Object,
        computed: '_computeDfpObject(dfpAdSection)'
      },
      firstSearch: {
        type: Boolean,
        value: true
      },
      googleQueryParams: {
        type: Object,
        observer: '_googleQueryParamsChanged'
      },
      hidden: {
        type: Boolean,
        reflectToAttribute: true,
        value: false,
        observer: '_hiddenChanged'
      },
      inputQuery: {
        type: String,
        computed: '_computeInputQuery(route)'
      },
      isSearching: {
        type: Boolean,
        value: false
      },
      items: Object,
      noResults: {
        type: Boolean,
        value: false
      },
      noQuery: {
        type: Boolean,
        value: true
      },
      response: {
        type: Object,
        observer: '_parseResponse'
      },
      request: Object,
      rest: String,
      route: Object,
      sortOrder: {
        type: String,
        value: 'Relevance',
        observer: '_sortOrderChanged'
      },
      start: {
        type: Number,
        value: 1
      },
      totalResults: Number
    };
    this.observers = ['_computeGoogleQueryParams(inputQuery, start, sortOrder)'];
  }

  _computeInputQuery(route) {
    if (route.path !== null && typeof route.path !== 'undefined' && route.path !== '') {
      let queryString = route.path.replace('/', '');
      this.set('noQuery', false);
      this.set('noResults', false);
      this.set('start', 1);
      return queryString;
    }
  }

  _computeGoogleQueryParams(inputQuery, start, sortOrder) {
    this.debounce('_computeGoogleQueryParams', () => {
      if (typeof sortOrder !== 'undefined' && sortOrder !== '') {
        this.fire('iron-signal', { name: 'app-scroll', data: { scrollPosition: 0, scrollSpeed: 1500, scrollAnimation: 'easeInOutQuint', afterScroll: false } });
        let params = {
          cref: 'www.sanduskyregister.com',
          cx: '011196976410573082968:7m7hlyxbyte',
          siteSearch: 'www.sanduskyregister.com',
          key: 'AIzaSyCMGfdDaSfjqv5zYoS0mTJnOT3e9MURWkU',
          num: 10,
          start: start
        }

        if (typeof inputQuery !== 'undefined' && inputQuery !== '') {
          params.q = inputQuery;
          // params.exactTerms = inputQuery;
        }

        if (sortOrder.toLowerCase() === 'date') {
          params.sort = 'date';
        }
        
        this.set('googleQueryParams', params);
      }
    });
  }

  _googleQueryParamsChanged(newParams, oldParams) {
    if (typeof newParams !== 'undefined' && Object.keys(newParams).length > 0) {
      this._checkCurrentRequest();
      let request = this.$.searchRequest;
      this.set('isSearching', true);
      request.params = newParams;
      request.generateRequest();
    }
  }

  _computeDfpObject(dfpAdSection) {
    return {
      adSection: this.dfpAdSection,
      content: 'search',
      placement: (window.location.host === 'www.sanduskyregister.com' ? 'production' : 'development')
    };
  }

  _hiddenChanged(hidden, oldHidden) {
    if (oldHidden && !hidden) {
      console.log('Hidden changed send stuff!!!');
      this._refreshAds();
      this._sendPageviews();
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

  _sortOrderChanged(newValue, oldValue) {
    if (typeof oldValue !== 'undefined' && oldValue !== '' && newValue !== oldValue) {
      this.set('start', 1);
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
      this.set('noResults', false);
      this.set('items', response.items);

      this.set('totalResults', parseInt(response.searchInformation.totalResults));
      let firstSearch = this.get('firstSearch');
      
      if (firstSearch) {
        this.set('firstSearch', false);
      } else {
        this._refreshAds();
      }
      
      this._sendPageviews();
    } else {
      this.set('noResults', true);
    }
    this.set('isSearching', false);
  }

  _sendPageviews() {
    let route = this.get('route');
    let author = this.get('author');

    if (typeof route !== 'undefined' && typeof route.path !== 'undefined') {
      this.fire('iron-signal', {name: 'track-page', data: { path: '/search?query=' + route.path.replace('/', ''), data: { 'dimension6': 'Search' } } });
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

  _hideResultsArea(searching, noQuery, noResults) {
    if (searching || noQuery || noResults) {
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

  _parseItemLink(link) {
    let parser = document.createElement('a');
    parser.href = link;
    return parser.pathname;
  }

  _parseSection(section) {
    if (typeof section !== 'undefined' && section !== '') {
      return section.replace(/-/g, ' ').toUpperCase() + ' -- ';
    }
  }
}
Polymer(cranberrySearch);
