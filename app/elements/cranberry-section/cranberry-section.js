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
            params: {
              type: Object,
              value: [],
              observer: '_changeParams'
            },
            response: {
              type: Object,
              observer: '_parseResponse'
            },
            items: {
              type: Object,
              value: []
            },
            start: {
              type: Number,
              value: 1,
              observer: '_changeStart'
            }
        };

        this.observers = ['_routeChange(routeData.section)', '_hiddenChanged(hidden, routeData)', '_itemsChanged(items)'];
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

    _routeChange(section) {
      this.async(function() {
          let hidden = this.hidden;
          let tags = this.get('tags');

          if (!hidden) {
            if(tags === false){
              let currentSection = this.get('section');

              if (typeof section !== 'undefined' && section !== currentSection && section !== 'section' && section !== 'story'){
                  if(section.length > 0) {
                      this.set('loadSection', section);
                  } else {
                      section = 'homepage';
                      this.set('section', section);
                      this.set('loadSection', section);
                  }
                  this.fire('iron-signal', {name: 'track-page', data: { path: '/section/' + section, data: { 'dimension7': section } } });
              }
            } else {
              let tag = this.get('tag');
              if (tag !== section) {
                this.set('loadSection', section);
                this.set('tag', section);
                this.fire('iron-signal', {name: 'track-page', data: { path: '/tag/' + section, data: { 'dimension7': tag } } });
              }
            }
            this._updateParams();
          }
      });
    }

    _setToParent(section, parent) {
      console.log('IN SET TO PARENT!');
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

  _updateParams() {
    this.async(function () {
      let currentRequest = this.get('request');

      if (typeof currentRequest !== 'undefined' && currentRequest.loading === true) {
        app.logger('<\cranberry-content-list\> aborting previous request');
        this.$.request.abortRequest(currentRequest);
      }


      this.set('items', []);

      let jsonp = {};
      let sections = this.get('loadSection');
      let tags = this.get('tags');

      jsonp.request = 'test-content-list';

      if (typeof tags !== 'undefined' && tags) {
        sections = sections.replace('-', ' ');
        jsonp.desiredTags = sections;
      } else {
        if (sections === 'homepage') {
          sections = 'news,opinion,announcements,sports,entertainment,lifestyle';
        }
        jsonp.desiredSection = sections;
      }

      jsonp.desiredContent = this._isGalleries(this.get('galleries'));
      jsonp.desiredStart = this.get('start');

      this.set('params', jsonp);
    });
  }

  _changeParams() {
    let params = this.get('params');

    if (params.length !== 0) {
      this.$.request.setAttribute('callback-value', 'callback');
      this.$.request.params = params;
      this.$.request.generateRequest();
    }
  }

  _parseResponse(response) {
    var result = JSON.parse(response.Result);

    this.set('items', result);
  }

  _itemsChanged(items) {
    console.dir(items);
  }

  _handleLoad() {
    app.logger('<\cranberry-SECTION\> load received');
  }

  _handleResponse(res) {
    app.logger('<\cranberry-SECTION\> response received');
  }
}

Polymer(CranberrySection);
