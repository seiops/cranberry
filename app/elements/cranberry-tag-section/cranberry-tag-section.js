class cranberryTagSection {
  get behaviors () {
    return [CranberryBehaviors.SectionRequestBehavior, CranberryBehaviors.PageviewBehavior, Polymer.NeonAnimationRunnerBehavior];
  }
  beforeRegister() {
    this.is = 'cranberry-tag-section';
    this.properties = {
      loading: {
        type: Boolean,
        value: true,
        observer: '_loadingChanged'
      },
      page: {
        type: Number,
        value: 1
      },
      requestObject: {
        type: Object
      },
      route: Object,
      routeData: Object,
      selected: {
        type: Number,
        value: 0
      },
      start: {
        type: Number,
        value: 1
      }
    };
    this.observers = [
      '_computeRequestObject(start, routeData)',
      '_sendRequest(requestObject)',
      '_routeChanged(route)'
    ];
  }

  ready() {
    console.info('\<cranberry-tag-section\> ready');
    this._responseListener = this._responseHandler.bind(this);  
  }

  attached() {
    console.info('\<cranberry-tag-section\> attached');
    this.addEventListener('response-received', this._responseListener);
  }
  
  detached() {
    console.info('\<cranberry-tag-section\> detached');
    this.removeEventListener('response-received', this._responseListener);

    this._removeInProgressRequest();
  }

  _computeRequestObject(start, routeData) {
    this.debounce('debouncedChanged', ()  => {
      if (typeof routeData !== 'undefined' && typeof routeData.section !== 'undefined') {
        if (typeof start !== 'undefined') {
          let params = {
            disableFeatured: false,
            request: 'content-list',
            sectionType: 'tags',
            desiredSection: routeData.section,
            desiredCount: 18,
            desiredStart: start
          };

          if (start > 1) {
            params.disableFeatured = true;
          }

          this.set('requestObject', params);
        }
      }
    });
  }

  _computeCount(currentPage) {
    return 18;
  }

  _isLatest(selected) {
    if (selected === 0) {
        return true;
    } else {
        return false;
    }
  }

  _sendRequest(requestObject) {
    this.set('loading', true);
    this.dispatchEvent(new CustomEvent('requestSection', {detail: requestObject }));
  }

  _responseHandler(response) {
    let data = response.detail;

    this.set('section', data.section);
    this.set('dfpObject', data.section.dfp);
    this.set('contentItems', data.content);
    this.set('featuredItems', data.featured);

    this.async(() => {
      this._sendPageview(data.section);
      this.set('loading', false);
    });
  }
  
}

Polymer(cranberryTagSection);