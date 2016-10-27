class cranberrySectionTracker {
  beforeRegister() {
    this.is = 'cranberry-section-tracker';
    this.properties = {
        rest: String,
        page: {
            type: String,
            observer: '_onRouteChanged'
        },
        section: {
          type: String,
          notify: true
        },
        parentSection: {
          type: String,
          notify: true
        },
        tags: {
          type: Boolean,
          value: false
        }
    };
  }

  _onRouteChanged(page) {
    let request = this.$.request;
    let params = {};
    let scrubbedPath = '';
    let tags = this.get('tags');

    if (page === 'galleries' || tags) {
      this.set('section', 'news');
    } else if (page !== '' && page !== 'section' && page !== 'story' && page !== 'photo-gallery') {
      // REQUEST SECTION INFO
      params.request = 'section';
      params.desiredSection = page;
      
      request.setAttribute('url', this.get('rest'));
      request.setAttribute('callback-value', 'callbackSectionTracker');
      request.params = params;
      request.generateRequest();
    } else if (page === '') {
      this.set('section', 'homepage');
    }
  }

  _handleResponse(response) {
    var result = JSON.parse(response.detail.Result);

    this.set('section', result.sectionName);
    this.set('parentSection', result.sectionParent);
  }

}
Polymer(cranberrySectionTracker);
