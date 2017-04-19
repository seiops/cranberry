class cranberrySectionRequest {
  beforeRegister() {
    this.is = 'cranberry-section-request';
    this.properties = {
      author: String,
      disableFeatured: {
        type: Boolean,
        value: false,
        notify: true
      },
      contentItems: {
        type: Array,
        notify: true
      },
      count: {
        type: Number,
        value: 0
      },
      featuredItems: {
        type: Array,
        notify: true
      },
      hidden: {
        type: Boolean,
        reflectToAttribute: true,
        value: true
      },
      loading: {
        type: Boolean,
        value: true,
        computed: '_computeLoading(requestInProgress, requestGenerated, response)',
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
      sectionObject: {
        type: Object,
        value: function() {
          return {};
        }
      },
      start: {
        type: Number,
        value: 1,
        observer: '_startChanged'
      },
      tagsPage: {
        type: Boolean,
        value: false
      }
    }
    this.listeners = { 'cranberry-request-content': '_setupRequest' };
  }
  
  _generateRequest(section = this.get('sectionObject.section'), parent = this.get('sectionObject.parent'), tagName = this.get('sectionObject.tagName'), disableFeatured = this.get('sectionObject.disableFeatured'), start = this.get('start'), count = this.get('count')) {
    let currentRequest = this.get('request');
    let requester = this.$.request;

    if (typeof currentRequest !== 'undefined' && currentRequest.loading === true) {
      console.info('<\cranberry-section-request\> aborting previous request');
      requester.abortRequest(currentRequest);
    }

    let sectionToFetch = (typeof parent !== 'undefined' && parent !== '' ? parent : section);
    let tagsPage = (typeof tagName !== 'undefined' && tagName !== '' ? true : false);
    let galleriesPage = (section === 'galleries' ? true : false);
    let homepage = (section === 'homepage' ? true : false);
    start = (typeof start !== 'undefined' ? start : this.get('start'));
    count = (typeof count !== 'undefined' ? count : this.get('count'));

    let jsonp = {
      disableFeatured: (start === 1 ? disableFeatured : true),
      request: 'content-list',
      desiredSection: (!tagsPage ? sectionToFetch : ''),
      auxJailMugs: 0,
      desiredStart: start,
      desiredCount: count,
      desiredContent: (galleriesPage ? 'gallery' : 'story_gallery'),
      desiredTags: (tagsPage ? tagName : '')
    };

    this.set('disableFeatured', jsonp.disableFeatured);

    if (homepage) {
      // Homepage Logic
      if (start === 1) {
        jsonp.auxJailMugs = 1;
      } else {
        jsonp.auxJailMugs = 0;
      }
    }

    requester.setAttribute('callback-value', 'callback');
    requester.params = jsonp;
    requester.generateRequest();
    this.set('requestGenerated', true);
  }

  _setupRequest(e) {
    let hidden = this.get('hidden');
    this.async(() => {
      if (!hidden) {
        this.set('sectionObject', e.detail.data);
        let sectionInformation = e.detail.data;
        var { disableFeatured, parent, section, tagName } = sectionInformation;
        let start = this.get('start');
        let count = this.get('count');

        this.set('section', section);

        this.set('requestGenerated', true);
        this._generateRequest(section, parent, tagName, disableFeatured, start, count);
      }
    });
  }

  _computeLoading(requestLoading, requestGenerated, response) {
    if (!requestLoading && Object.keys(response.Result).length > 0) {
      return false;
    } else {
      return true;
    }
  }
  
  _firePageview() {
    let tagsPage = this.get('tagsPage');
    let section = this.get('section');
    let parentSection = this.get('parentSection');
    let loadSection = this.get('loadSection');
    let matherSections = (typeof parentSection !== 'undefined' && parentSection.toLowerCase() !== '' ? parentSection.toLowerCase() + '/' + section.toLowerCase() : section.toLowerCase() + '/');
    let author = this.get('author');

    this.async(() => {
      if (tagsPage) {
        // Fire Google Analytics Pageview
        this.fire('iron-signal', {name: 'track-page', data: { path: '/tags/' + loadSection, data: { 'dimension7': loadSection } } });
        // Fire Chartbeat pageview
        this.fire('iron-signal', {name: 'chartbeat-track-page', data: { path: '/tags/' + loadSection, data: {'sections': loadSection, 'authors': author } } });
        // Fire Youneeq Page Hit Request
        this.fire('iron-signal', {name: 'page-hit'});
        // Fire Mather
        this.fire('iron-signal', {name: 'mather-hit', data: { data: {'section': loadSection, 'hierarchy': matherSections, 'authors': author, 'pageType': 'tags', timeStamp: new Date() } }});
      } else {
        // Fire Google Analytics Pageview
        this.fire('iron-signal', {name: 'track-page', data: { path: '/section/' + section, data: { 'dimension7': section } } });
        // Fire Chartbeat pageview
        this.fire('iron-signal', {name: 'chartbeat-track-page', data: { path: '/section/' + section, data: {'sections': section, 'authors': author } } });
        // Fire Youneeq Page Hit Request
        this.fire('iron-signal', {name: 'page-hit'});
        // Fire Mather
        this.fire('iron-signal', {name: 'mather-hit', data: { data: {'section': loadSection, 'hierarchy': matherSections, 'authors': author, 'pageType': (section === 'homepage' ? 'home' : 'section'), timeStamp: new Date() } } });
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

    this._firePageview();
    this._fireNativo();
  }

  _startChanged(start, oldStart) {
    this.async(function () {
      if (typeof oldStart !== 'undefined' && typeof start !== 'undefined') {
        console.info('\<cranberry-section-request\> start changed -\> ' + start);
        this._generateRequest();
      }
    });
  }
}
Polymer(cranberrySectionRequest);
