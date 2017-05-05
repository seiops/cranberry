class CranberrySection {
  beforeRegister() {
    this.is = 'cranberry-section';
    this.properties = {
      contentLoading: {
        type: Boolean,
        observer: '_loadingChanged'
      },
      contentItems: Array,
      count: {
        type: Number,
        value: 18
      },
      currentPage: {
        type: Number,
        value: 1,
        observer: '_currentPageChanged'
      },
      dfpAdPath: {
        type: String,
        value: ''
      },
      disableFeatured: {
        type: Boolean,
        value: true
      },
      elementAttached: Boolean,
      featuredItems: Array,
      galleries: {
        type: Boolean,
        value: false
      },
      hidden: {
        type: Boolean,
        reflectToAttribute: true,
        value: true
      },
      isHomepage: {
        type: Boolean,
        reflectToAttribute: true,
        value: false
      },
      loading: {
        type: Boolean,
        computed: '_computeLoading(contentLoading, sectionTrackingInProgress)'
      },
      previousLoading: Boolean,
      route: Object,
      routeData: Object,
      sectionTitle: {
        type: String,
        value: ''
      },
      sectionTrackingInProgress: Boolean,
      selected: {
        type: Number,
        value: 0
      },
      start: {
        type: Number,
        value: 1
      },
      tags: String,
      tagsPage: {
        type: Boolean,
        value: false
      },
      willGenerateRequest: {
        type: Boolean,
        value: true
      }
    };
    this.observers = [
      '_hiddenChanged(hidden, routeData.section)',
      '_routeChanged(route, elementAttached, hidden)'
    ];
  }
  
  _routeChanged(route, elementAttached, hidden) {
    this.async(() => {
      this._debounceRouteChanged(route, elementAttached, hidden);
    });
  }

  _debounceRouteChanged(route, elementAttached, hidden) {
    this.debounce('debouncedChanged', ()  => {
      if (!hidden && elementAttached && typeof route !== 'undefined') {
        let path = route.path;
        let prefix = route.prefix;
        let section = {};

        if (path === '/') {
          section.sectionType = 'section';
          section.sectionName = 'homepage';
        } else {
          if (prefix !== '') {
            section.sectionType = prefix.replace('/', '').toLowerCase();
            section.sectionName = path.replace('/', '').toLowerCase();
          } else {
            if (path === '/galleries') {
              section.sectionType = 'galleries';
              section.sectionName = 'galleries';
            }
          }
        }

        if (Object.keys(section).length > 0) {
          this.fire('iron-signal', {name: 'cranberry-section-route-changed', data: { section } });
        }
      }
    });
  }

  _computeLoading(contentLoading, sectionLoading) {
    let willGenerateRequest = this.get('willGenerateRequest');

    if (sectionLoading) {
      this.set('willGenerateRequest', true);
    }

    if (contentLoading) {
      this.set('willGenerateRequest', false);
    }

    if (!contentLoading && !sectionLoading && !willGenerateRequest) {
      return false;
    } else {
      return true;
    }
  }

  attached() {
      console.info('\<cranberry-section\> attached');
      this.set('elementAttached', true);
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

  _computeDisableFeatured(disableFeatured) {
    if (typeof disableFeatured === 'undefined') {
      return true;
    } else {
      return disableFeatured;
    }
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

  _setToParent(section, parent) {
    if (typeof parent !== 'undefined' && parent === '') {
      return section;
    } else {
      return parent;
    }
  }

  _hiddenChanged(hidden, section) {
    if (!hidden) {
      let title = '';
      if(typeof section !== 'undefined' && section !== 'section') {
        if (section === '') {
          title = 'Home';
        } else if(section === 'tags') {
          let route = this.get('route');
          let path = route.path;
          path = path[0].toUpperCase() + path.slice(1)
          title = path;
        } else {
          let route = section;
          route = route[0].toUpperCase() + route.slice(1);
          title = route;
        }
      }
      this.set('sectionTitle', title);
    } else {
      this.set('contentLoading', true);
    }
  }

  _loadingChanged(loading, oldLoading) {
  }

  _currentPageChanged(newValue, oldValue) {
    if (typeof newValue !== 'undefined') {
      if (newValue > 1) {
        this.set('disableFeatured', true);
      } else {
        if (typeof oldValue !== 'undefined') {
          this.set('disableFeatured', false);
        }
      }
    }
  }

  _computeCount(isHomepage, currentPage) {
    if (typeof isHomepage !== 'undefined' && isHomepage && typeof currentPage !== 'undefined') {
      if (currentPage === 1) {
        return 17;
      } else {
        return 18;
      }
    } else {
      return 18;
    }
  }

  _computeMainHidden(loading, hidden) {
    if (hidden || loading) {
      return true;
    } else {
      return false;
    }

  }
}

Polymer(CranberrySection);
