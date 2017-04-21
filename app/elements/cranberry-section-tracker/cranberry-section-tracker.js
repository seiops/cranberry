class cranberrySectionTracker {
  beforeRegister() {
    this.is = 'cranberry-section-tracker';
    this.properties = {
      dfpObject: {
        type: Object,
        notify: true
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
      rest: String,
      sectionToFetch: {
        type: String,
        observer: '_onRouteChanged'
      },
      request: Object,
      requestInProgress: {
        type: Boolean,
        value: true
      },
      tags: String,
      tagsPage: {
        type: Boolean,
        value: false
      }
    };
    this.observers = [];
    this.listeners = { 'cranberry-section-route-changed': '_sectionRouteChanged' };
  }

  attached() {
    console.info('\<cranberry-section-tracker\> attached');
  }

  _sectionRouteChanged(e) {
    let hidden = this.get('hidden');
    this.async(() => {
      if (!hidden) {
        let section = e.detail.section;

        this._setupSectionRequest(section);
      }
    });
  }

  _setupSectionRequest(section) {
    let request = this.$.request;
    let lastRequest = this.get('request');

    if (typeof lastRequest !== 'undefined' && lastRequest.loading === true) {
      console.info('<\cranberry-section-tracker\> aborting previous request');
      request.abortRequest(lastRequest);
      this._buildRequest(section);
    } else {
      this._buildRequest(section);
    }
  }

  _buildRequest(section) {
    this.async(() => {
      let request = this.$.request;
      let rest = this.get('rest');
      let sectionType = section.sectionType;
      let sectionName = section.sectionName;

      

      let params = {
        request: 'section',
        desiredSection: sectionName,
        tagSection: (sectionType === 'tags' ? 1 : 0)
      };

      request.setAttribute('url', rest);
      request.setAttribute('callback-value', 'callbackSectionTracker' + sectionName.replace(/-/g, ''));
      request.params = params;
      request.generateRequest(); 
    });
  }

  _handleResponse(event) {
    let response = this.get('response');

    console.info('\<cranberry-section-tracker\> response received');
    if (typeof response !== 'undefined' && response.Result !== 'undefined' && response.Result !== '') {
      let result = JSON.parse(response.Result);

      let data = {
        section: (typeof result.sectionId !== 'undefined' && result.sectionId !== '' ? result.sectionId.replace(/_/g, '-') : ''),
        parent: (typeof result.sectionParent !== 'undefined' && result.sectionParent !== '' ? result.sectionParent.replace(/_/g, '-') : ''),
        tagName: (typeof result.tagName !== 'undefined' && result.tagName !== '' ? result.tagName.replace(/_/g, '-') : ''),
        disableFeatured: (typeof result.disableFeatured !== 'undefined' ? result.disableFeatured : false)
      };

      this.set('dfpObject', result.dfp);
      this.set('tags', data.tagName);
      this.fire('iron-signal', { name: 'cranberry-request-content', data: { data } });
    }
  }

  _computeLoading(loading) {
    return loading;
  }

}
Polymer(cranberrySectionTracker);
