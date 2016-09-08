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
      let input = Polymer.dom(this.root).querySelector('#input');
      let value = this.get('query');

      form.addEventListener('iron-form-submit', function() {
        app.logger('\<cranberry-search-bar\> search submit event');

        el._search();
      });

      // Custom validation function on focus lost
      // This will ensure that errors will not show if the input doesnt have a value in it.
      input.addEventListener('blur', function() {
        // Test against value as input.value could be a null Object at this point.
        if (value !== '') {
          if (!input.validate()) {
            input.set('invalid', true);
          } else {
            input.set('invalid', false);
          }
        }
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
