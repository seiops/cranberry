class CranberrySection {
    beforeRegister() {
        this.is = 'cranberry-section';
        this.properties = {
            route: Object,
            routeData: Object,
            selected: {
                type: Number,
                value: 0
            },
            galleries: {
              type: Boolean,
              value: false
            },
            tags: {
              type: Boolean,
              value: false
            },
            tag: {
              type: String
            },
            hidden: {
              type: Boolean,
              reflectToAttribute: true,
              value: true
            },
            sectionTitle: {
              type: String,
              value: ''
            },
            featuredItems: Array,
            contentItems: Array,
            count: {
              type: Number,
              value: 18
            }
        };

        this.observers = ['_hiddenChanged(hidden, routeData)'];
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

    _isGalleries(galleries) {
      if (galleries) {
        return 'gallery';
      } else {
        return 'story_gallery'
      }

    }

    _setToParent(section, parent) {
      if (typeof parent !== 'undefined' && parent === '') {
        return section;
      } else {
        return parent;
      }
    }

    _hiddenChanged(hidden, routeData) {
      if (!hidden) {
        let title = '';
        if(typeof routeData.section !== 'undefined' && routeData.section !== 'section') {
          if (routeData.section === '') {
            title = 'Home';
          } else if(routeData.section === 'tags') {
            let route = this.get('route');
            let path = route.path;
            path = path[0].toUpperCase() + path.slice(1)
            title = path;
          } else {
            let route = routeData.section;
            route = route[0].toUpperCase() + route.slice(1);
            title = route;
          }
        }
        this.set('sectionTitle', title);
      }
    }
}

Polymer(CranberrySection);
