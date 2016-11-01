class cranberrySectionRequest {
  beforeRegister() {
    this.is = 'cranberry-section-request';
    this.properties = {
      routeData: String,
      section: {
        type: String,
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
      hidden: Boolean
    }
    this.observers = ['_sectionChanged(routeData)']
  }

  attached() {
    app.logger('\<cranberry-section-request\> attached');
  }

  _sectionChanged(section) {
    this.async(function() {
      let hidden = this.get('hidden');
      let tags = this.get('tags');

      if (!hidden) {
        if(tags === false){
          let currentSection = this.get('section');

          if (typeof section !== 'undefined' && section !== currentSection && section !== 'section' && section !== 'story') {
            if (section.length > 0) {
              this.set('section', section);
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
        // Reset start to 1
        this.set('start', 1);

        this._updateParams();
      }
    }); 
  }

  _updateParams() {
    this.async(function () {
      let currentRequest = this.get('request');

      if (typeof currentRequest !== 'undefined' && currentRequest.loading === true) {
        app.logger('<\cranberry-section-request\> aborting previous request');
        this.$.request.abortRequest(currentRequest);
      }


      this.set('items', []);

      let jsonp = {};
      let sections = this.get('loadSection');
      let tags = this.get('tags');

      // THIS NEEDS TO CHANGE!!!! THIS NEEDS TO CHANGE!!!! THIS NEEDS TO CHANGE!!!! THIS NEEDS TO CHANGE!!!! THIS NEEDS TO CHANGE!!!! THIS NEEDS TO CHANGE!!!! 
      jsonp.request = 'content-list';

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

  _handleLoad() {
    app.logger('<\cranberry-section-request\> load received');
  }

  _handleResponse(res) {
    app.logger('<\cranberry-section-request\> response received');
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
          app.logger('\<cranberry-section-request\> start changed -\> ' + start);
          this._updateParams();
        }
      });
    }
}
Polymer(cranberrySectionRequest);
