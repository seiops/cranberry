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
    
    this.async(() => {
      if (page === 'galleries' || tags) {
        this.set('section', '');
        this.set('section', 'news');
        this.set('parentSection', '');
      } else if (page !== '' && page !== 'tags' && page !== 'section' && page !== 'story' && page !== 'photo-gallery' && page !== 'profile' && page !== 'contact'
      && page !== 'archive' && page !== 'forecast' && page !== 'jail-mugs') {
        // REQUEST SECTION INFO
        params.request = 'section';
        params.desiredSection = page;
        
        request.setAttribute('url', this.get('rest'));
        request.setAttribute('callback-value', 'callbackSectionTracker');
        request.params = params;
        request.generateRequest();
      } else if (page === '') {
        this.set('section', 'homepage');
        this.set('parentSection', '');
      }
    });
    
  }

  _handleResponse(response) {
    var result = JSON.parse(response.detail.Result);

    this.set('section', result.sectionId.replace(/_/g, '-'));
    if (typeof result.sectionParent === 'undefined') {
      this.set('parentSection', '');
    } else {
      this.set('parentSection', result.sectionParent);
    }
  }

}
Polymer(cranberrySectionTracker);
