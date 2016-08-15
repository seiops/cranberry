class cranberrySearchBar {
  get behaviors() {
      return [Polymer.NeonAnimationRunnerBehavior];
  }
  beforeRegister() {
    this.is = 'cranberry-search-bar';
    this.properties = {
      query: {
        type: String,
        value: '',
        observer: '_onQueryChanged'
      },
      showClear: {
        type: Boolean,
        value: false
      },
      noLabel: {
        type: Boolean
      },
      placeHolder: {
        type: String,
        value: ''
      },
      animationConfig: {
        type: Object,
        value: function() {
          return {
            'myAwesomeThing': {
              name: 'scale-up-animation',
              node: this,
              timing: {delay: 100, duration: 100}
            }
          }
        }
      }

    };
    this.observers = ['_setPlaceholder(noLabel)'];
    this.listeners = {'neon-animation-finish': '_onNeonAnimationFinish'};
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

  _setPlaceholder(noLabel) {
      if (noLabel) {
        this.set('placeHolder', 'Search');
      }
  }

  _search() {
    this._checkQueryStatus();
    // Get the query string
    let query = this.get('query');

    // Change the app location to match search and the query string
    let appLocation = document.querySelector('app-location');
    appLocation.set('path', '/search/' + query.replace(/ /g, '+'));

    this._clearInput();
  }

  _clearInput() {
    this.set('query', '');
    this.$.input.value = '';
  }

  _onQueryChanged(newValue) {
    if (newValue !== '' && typeof newValue !== 'undefined') {
      this.set('showClear', true);
    } else {
      this.set('showClear', false);
    }
  }

  scaleElement() {
    this.playAnimation('myAwesomeThing');
  }
}
Polymer(cranberrySearchBar);
