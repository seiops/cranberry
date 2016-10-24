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
          }
      });
    }
}
// Public methods.
// ready() {
//   app.logger('\<cranberry-section\> ready');
// }
// Private methods
Polymer(CranberrySection);
