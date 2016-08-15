class CranberrySection {
    beforeRegister() {
        this.is = 'cranberry-section';
        this.properties = {
            route: Object,
            routeData: Object,
            section: {
                type: String
            },
            loadSection: {
                type: String
            },
            selected: {
                type: Number,
                value: 0
            }
        };

        this.observers = ['_routeChange(routeData.section)'];
    }

    attached() {
        app.logger('\<cranberry-section\> attached');
        this._checkTabs();
    }

    _checkItem(item, index) {
        let modulus = index % 2;

        if (index > 0 && modulus === 0) {
            return true;
        } else {
            return false;
        }
    }

    _checkTabs() {
        let tabs = this.$.tabs;

        tabs.addEventListener('iron-select', function() {
            this.set('selected', tabs.selected);
        });
    }

    _equal(a, b) {
        if (a === b) {
            return true;
        } else {
            return false;
        }
    }

    _isLatest(selected) {
        if (selected === 0) {
            return true;
        } else {
            return false;
        }
    }

    _isLocal(selected) {
        if (selected === 1) {
            return true;
        } else {
            return false;
        }
    }

    _isPopular(selected) {
        if (selected === 2) {
            return true;
        } else {
            return false;
        }
    }

    _isFeatured(selected) {
        if (selected === 2) {
            return true;
        } else {
            return false;
        }
    }

    _routeChange(section) {
      this.async(function() {
          let hidden = this.hidden;

          if (!hidden) {
              if (typeof section !== 'undefined' && section.length > 0 && section !== ('section' || 'story')) {
                  this.set('loadSection', section);
              } else {
                  this.set('loadSection', 'news');
              }
          }
      });
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
}
// Public methods.
// ready() {
//   app.logger('\<cranberry-section\> ready');
// }
// Private methods
Polymer(CranberrySection);
