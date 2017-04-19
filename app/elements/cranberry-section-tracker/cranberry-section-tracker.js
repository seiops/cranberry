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
    let rest = this.get('rest');
    let sectionType = section.sectionType;
    let sectionName = section.sectionName;
    let params = {
      request: 'section',
      desiredSection: section.sectionName,
      tagSection: (section.sectionType === 'tags' ? 1 : 0)
    };

    request.setAttribute('url', rest);
    request.setAttribute('callback-value', 'callbackSectionTracker');
    request.params = params;
    request.generateRequest();
  }

  _handleResponse(response) {
    console.info('\<cranberry-section-tracker\> response received');
    if (typeof response.detail !== 'undefined' && response.detail.Result !== 'undefined' && response.detail.Result !== '') {
      let result = JSON.parse(response.detail.Result);

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
