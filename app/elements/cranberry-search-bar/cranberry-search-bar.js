class cranberrySearchBar {
  beforeRegister() {
    this.is = 'cranberry-search-bar';
    this.properties = {
      query: {
        type: String,
        value: ''
      },
      showClear: {
        type: Boolean,
        value: false
      }
    };
    // this.observers = ['_setPlaceholder(noLabel)'];
  }
  attached() {
    this.async(function() {
      let el = this;
      let form = Polymer.dom(this.root).querySelector('#searchForm');

      form.addEventListener('iron-form-submit', function() {
        app.logger('\<cranberry-search-bar\> search submit event');

        el._search();
      });
    });
  }

  _onNeonAnimationFinish() {
    //Abstract add here if needed
  }

  _checkQueryStatus() {
    // Get the search request BYUTV element
    let request = document.querySelector('#searchRequest');

    if (request.loading === true) {
      request.abortRequest();
    }
  }

  _search() {
    this._checkQueryStatus();
    // Get the query string
    let query = this.get('query');
    this.async(function() {
      // Change the app location to match search and the query string
      let appLocation = document.querySelector('app-location');
      appLocation.set('path', '/search/' + query.replace(/ /g, '+'));

      this._clearInput();
    });

  }

  _clearInput() {
    let form = this.querySelector('form');
    form.reset();
  }
}
Polymer(cranberrySearchBar);
