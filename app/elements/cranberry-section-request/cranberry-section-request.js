class cranberrySectionRequest {
  beforeRegister() {
    this.is = 'cranberry-section-request';
    this.properties = {
      author: String,
      contentItems: {
        type: Array,
        notify: true
      },
      count: {
        type: Number,
        value: 0
      },
      disableFeatured: Boolean,
      featuredItems: {
        type: Array,
        notify: true
      },
      hidden: Boolean,
      items: {
        type: Object
      },
      loading: {
        type: Boolean,
        computed: '_computeLoading(requestInProgress, requestGenerated)',
        notify: true
      },
      loadSection: {
        type: String,
        notify: true
      },
      params: {
        type: Object,
        value: [],
        observer: '_changeParams'
      },
      parentSection: {
        type: String,
        notify: true
      },
      response: {
        type: Object,
        observer: '_parseResponse'
      },
      requestGenerated: {
        type: Boolean,
        value: false
      },
      requestInProgress: {
        type: Boolean,
        value: true
      },
      routeData: String,
      section: {
        type: String,
        notify: true
      },
      start: {
        type: Number,
        value: 1,
        observer: '_startChanged'
      },
      tags: String,
      tagSection: {
        type: Boolean,
        value: false
      },
      tempHidden: Boolean,
      tempParent: {
        type: String,
        value: 'default'
      },
      tempSection: {
        type: String,
        value: 'default'
      }
    }
    this.observers = [
      '_sectionChanged(section, parentSection, hidden)',
      '_updateParams(loadSection)'  
    ]
  }

  debouncedChanged(section, parentSection, hidden) {
    // Debounce function to ensure that all values are properly set.
    this.debounce('debouncedChanged', ()  => {
      let tagSection = this.get('tagSection');
      let tags = this.get('tags');
      if (!hidden) {
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
          this.set('loadSection', tags);
        }

        this._firePageview();
        this._fireNativo();
      }
    }, 50);
  }

  _computeLoading(requestLoading, requestGenerated) {
    if (requestGenerated && !requestLoading) {
      return false;
    } else {
      return true;
    }
  }
  
  _sectionChanged(section, parentSection, hidden) {
    this.async(() => {
      this.debouncedChanged(section, parentSection, hidden);
    });
  }

  _firePageview() {
    let tagSection = this.get('tagSection');
    let section = this.get('section');
    let loadSection = this.get('loadSection');
    let author = this.get('author');

    this.async(() => {
      if (tagSection) {
        // Fire Google Analytics Pageview
        this.fire('iron-signal', {name: 'track-page', data: { path: '/tags/' + loadSection, data: { 'dimension7': loadSection } } });
        // Fire Chartbeat pageview
        this.fire('iron-signal', {name: 'chartbeat-track-page', data: { path: '/tags/' + loadSection, data: {'sections': loadSection, 'authors': author } } });
        // Fire Youneeq Page Hit Request
        this.fire('iron-signal', {name: 'page-hit'});
        // Fire Mather
        this.fire('iron-signal', {name: 'mather-hit', data: { data: {'sections': loadSection, 'authors': author, 'pageType': 'tags', timeStamp: new Date() } }});
      } else {
        // Fire Google Analytics Pageview
        this.fire('iron-signal', {name: 'track-page', data: { path: '/section/' + section, data: { 'dimension7': section } } });
        // Fire Chartbeat pageview
        this.fire('iron-signal', {name: 'chartbeat-track-page', data: { path: '/section/' + section, data: {'sections': section, 'authors': author } } });
        // Fire Youneeq Page Hit Request
        this.fire('iron-signal', {name: 'page-hit'});
        // Fire Mather
        this.fire('iron-signal', {name: 'mather-hit', data: { data: {'sections': section, 'authors': author, 'pageType': (section === 'homepage' ? 'home' : 'section'), timeStamp: new Date() } } });
      }
    });
  }

  _fireNativo() {
    // Fire nativo
    if (typeof window.PostRelease !== 'undefined' && typeof window.PostRelease.Start === 'function') {
      PostRelease.Start();
    }
  }

  attached() {
    console.info('\<cranberry-section-request\> attached');
  }

  _updateParams(loadSection) {
    this.async(() => {
      let currentRequest = this.get('request');

      if (typeof currentRequest !== 'undefined' && currentRequest.loading === true) {
        console.info('<\cranberry-section-request\> aborting previous request');
        this.$.request.abortRequest(currentRequest);
      }

      this.set('items', []);

      let jsonp = {};
      let sections = (typeof loadSection !== 'undefined') ? loadSection : this.get('loadSection');
      let disableFeatured = this.get('disableFeatured');
      let tagSection = this.get('tagSection');
      let gallerySection = this.get('galleries');
      let homepageFlag;
      let start = this.get('start');
      let count = this.get('count');

      jsonp.request = 'content-list';

      if (typeof gallerySection !== undefined && gallerySection) {
        jsonp.desiredSection = 'galleries';
      } else if (typeof tagSection !== 'undefined' && tagSection) {
        sections = sections.replace(/-/g, ' ');
        jsonp.desiredTags = sections;
      } else {
        if (sections === 'homepage') {
          sections = 'useHomepageVariable';
          homepageFlag = true;
          
        }
        jsonp.desiredSection = sections;
      }
      
      jsonp.disableFeatured = disableFeatured;
      jsonp.desiredContent = this._isGalleries(this.get('galleries'));
      jsonp.desiredStart = start;

      if (typeof homepageFlag !== 'undefined' && homepageFlag) {
        jsonp.featuredHomepage = 1;
        if (typeof start === 'undefined' || start === 1) {
          jsonp.auxJailMugs = 1;
        } else {
          jsonp.auxJailMugs = 0;
        }
      }

      jsonp.desiredCount = count;

      this.set('params', jsonp);
    });
  }

  _changeParams() {
    let params = this.get('params');
    
    if (params.length !== 0) {
      this.$.request.setAttribute('callback-value', 'callback');
      this.$.request.params = params;
      this.$.request.generateRequest();
      this.set('requestGenerated', true);
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
    this._fireNativo();
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
        if (typeof oldStart !== 'undefined' && typeof start !== 'undefined') {
          console.info('\<cranberry-section-request\> start changed -\> ' + start);
          this._updateParams();
          this._firePageview();
        }
      });
    }
}
Polymer(cranberrySectionRequest);
