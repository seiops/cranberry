class cranberrySectionRequest {
  beforeRegister() {
    this.is = 'cranberry-section-request';
    this.properties = {
      routeData: String,
      parentSection: {
        type: String,
        notify: true
      },
      section: {
        type: String,
        notify: true
      },
      tempParent: {
        type: String,
        value: 'default'
      },
      tempSection: {
        type: String,
        value: 'default'
      },
      tempHidden: {
        type: Boolean
      },
      tagSection: {
        type: Boolean,
        value: false
      },
      tags: String,
      loadSection: {
        type: String,
        notify: true
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
      requestInProgress: {
        type: Boolean,
        value: false,
        notify: true
      },
      start: {
        type: Number,
        notify: true,
        observer: '_startChanged'
      },
      items: {
        type: Object
      },
      featuredItems: {
        type: Array,
        notify: true
      },
      contentItems: {
        type: Array,
        notify: true
      },
      author: String,
      hidden: Boolean
    }
    this.observers = [
      '_sectionChanged(section, parentSection, hidden)',
      '_updateParams(loadSection)'  
    ]
  }

  debouncedChanged(section, parentSection, hidden) {
    // Debounce function to ensure that all values are properly set.
    this.debounce('debouncedChanged', ()  => {
      let tempSection = this.get('tempSection');
      let tempParent = this.get('tempParent');
      let tempHidden = this.get('tempHidden');

      if (!hidden) {
        // This element is not hidden
        if (tempSection !== section) {
          this.set('tempSection', section);
        }

        if (tempParent !== parentSection) {
          this.set('tempParent', parent);
        }

        if (tempSection !== section && tempParent !== parentSection) {
          // This is a new section!
          this.set('tempHidden', false);

          // Not hidden fetch content
          let tagSection = this.get('tagSection');

          if (!tagSection) {
            if (parentSection === '') {
              this.set('loadSection', section);
            } else {
              if (section !== '') {
                this.set('loadSection', section);
              } else {
                this.set('loadSection', parentSection);
              }  
            }
          } else {
            let tags = this.get('tags');
            
            this.set('loadSection', tags);
          }
            
          this._firePageview();
        } else {
          // This is the same section hidden just changed
          this._firePageview();
        }
      } else {
        // This element is hidden
        this.set('tempHidden', true);
      }
    });
  }

  _sectionChanged(section, parentSection, hidden) {
    this.async(() => {
      this.debouncedChanged(section, parentSection, hidden);
    });
  }

  _firePageview() {
    let tagSection = this.get('tagSection');
    let section = this.get('section');
    let author = this.get('author');

    this.async(() => {
      if (tagSection) {
        this.fire('iron-signal', {name: 'track-page', data: { path: '/tag/' + section, data: { 'dimension7': section } } });
      } else {
        this.fire('iron-signal', {name: 'track-page', data: { path: '/section/' + section, data: { 'dimension7': section } } });
        this.fire('iron-signal', {name: 'chartbeat-track-page', data: { path: '/section/' + section, data: {'sections': section, 'authors': author } } });
      }
    });
  }

  attached() {
    console.info('\<cranberry-section-request\> attached');
  }

  _updateParams(loadSection) {
    this.async(function () {
      let currentRequest = this.get('request');

      if (typeof currentRequest !== 'undefined' && currentRequest.loading === true) {
        console.info('<\cranberry-section-request\> aborting previous request');
        this.$.request.abortRequest(currentRequest);
      }


      this.set('items', []);

      let jsonp = {};
      let sections = (typeof loadSection !== 'undefined') ? loadSection : this.get('loadSection');
      let tagSection = this.get('tagSection');
      let gallerySection = this.get('galleries');
      let homepageFlag;
 
      jsonp.request = 'content-list';

      if (typeof gallerySection !== undefined && gallerySection) {
        jsonp.desiredSection = 'galleries';
      } else if (typeof tagSection !== 'undefined' && tagSection) {
        sections = sections.replace(/-/g, ' ');
        jsonp.desiredTags = sections;
      } else {
        if (sections === 'homepage') {
          sections = 'news,opinion,announcements,sports,entertainment,lifestyle';
          homepageFlag = true;
        }
        jsonp.desiredSection = sections;
      }

      if (typeof homepageFlag !== 'undefined' && homepageFlag) {
        jsonp.featuredHomepage = 1;
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

  _handleLoad() {
    console.info('<\cranberry-section-request\> load received');
  }

  _handleResponse(res) {
    console.info('<\cranberry-section-request\> response received');
  }

  _parseResponse(response) {
    var result = JSON.parse(response.Result);

    this.set('featuredItems', result.featured);
    this.set('contentItems', result.content);

    this.set('items', result);
  }

  _isGalleries(galleries) {
    if (galleries) {
      return 'gallery';
    } else {
      return 'story_gallery'
    }
  }

  _startChanged(start, oldStart) {
      this.async(function () {
        if (typeof oldStart !== 'undefined') {
          console.info('\<cranberry-section-request\> start changed -\> ' + start);
          this._updateParams();
          this._firePageview();
        }
      });
    }
}
Polymer(cranberrySectionRequest);
