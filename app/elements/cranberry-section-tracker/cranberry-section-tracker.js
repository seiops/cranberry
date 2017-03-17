class cranberrySectionTracker {
  beforeRegister() {
    this.is = 'cranberry-section-tracker';
    this.properties = {
      appSection: {
        type: String,
        computed: '_computeAppSection(page, isGalleries, hidden)'
      },
      disableFeatured: {
        type: Boolean,
        value: true,
        notify: true
      },
      isGalleries: {
        type: Boolean,
        value: false
      },
      hidden: {
        type: Boolean,
        reflectToAttribute: true,
        value: true
      },
      loading: {
        type: Boolean,
        computed: '_computeLoading(requestInProgress)',
        notify: true
      },
      page: {
        type: String,
        value: 'undefined'
      },
      parentSection: {
        type: String,
        notify: true
      },
      rest: String,
      section: {
        type: String,
        notify: true
      },
      sectionToFetch: {
        type: String,
        observer: '_onRouteChanged'
      },
      requestInProgress: {
        type: Boolean,
        value: true
      },
      tags: {
        type: Boolean,
        value: false
      }
    };
  }

  attached() {
    console.info('\<cranberry-section-tracker\> attached');
  }

  _computeAppSection(page, isGalleries, hidden) {
    console.log(`page: ${page} hidden: ${hidden} isGalleries: ${isGalleries}`);
    if (!hidden && page !== 'section') {
      if (page === 'galleries' && isGalleries) {
        this.set('sectionToFetch', page);
      }

      if (!isGalleries && page !== 'galleries') {
        this.set('sectionToFetch', page);
      }
      
      return page;
    }
  }

  _onRouteChanged(page, oldPage) {
    let request = this.$.request;
    let params = {};
    let scrubbedPath = '';
    let tags = this.get('tags');
    
    if (page !== 'tags' && page !== 'section' && page !== 'story' && page !== 'photo-gallery' && page !== 'profile' && page !== 'contact'
    && page !== 'archive' && page !== 'forecast' && page !== 'jail-mugs') {
      // REQUEST SECTION INFO
      params.request = 'section';
      params.desiredSection = (page === '' ? 'homepage' : page);
      
      request.setAttribute('url', this.get('rest'));
      request.setAttribute('callback-value', 'callbackSectionTracker');
      request.params = params;

      console.info('\<cranberry-section-tracker\> generating section tracking request');
      request.generateRequest();
    }
  }

  _handleResponse(response) {
    console.info('\<cranberry-section-tracker\> response received');
    if (typeof response.detail !== 'undefined' && response.detail.Result !== 'undefined' && response.detail.Result !== '') {
      let result = JSON.parse(response.detail.Result);
      let section = result.sectionId.replace(/_/g, '-');
      let parent = result.sectionParent;

      this.set('section', section);

      if (typeof parent === 'undefined') {
        this.set('parentSection', '');
      } else {
        this.set('parentSection', parent);
      }

      if (typeof result.disableFeatured !== 'undefined' && result.disableFeatured) {
        this.set('disableFeatured', true);
      } else {
        this.set('disableFeatured', false);
      }

    } else {
      this.set('section', 'news');
      this.set('parentSection', '');
      this.set('disableFeatured', false);
    }
  }

  _computeLoading(loading) {
    return loading;
  }

}
Polymer(cranberrySectionTracker);
