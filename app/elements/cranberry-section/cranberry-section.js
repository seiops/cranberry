class cranberrySection {
  get behaviors () {
    return [CranberryBehaviors.SectionRequestBehavior, CranberryBehaviors.PageviewBehavior, Polymer.NeonAnimationRunnerBehavior];
  }
  beforeRegister() {
    this.is = 'cranberry-section';
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
    console.info('\<cranberry-section\> ready');
    this._responseListener = this._responseHandler.bind(this);  
  }

  attached() {
    console.info('\<cranberry-section\> attached');
    this.addEventListener('response-received', this._responseListener);
  }
  
  detached() {
    console.info('\<cranberry-section\> detached');
    this.removeEventListener('response-received', this._responseListener);

    this._removeInProgressRequest();
  }

  _computeRequestObject(start, routeData) {
    this.debounce('debouncedChanged', ()  => {
      if (typeof routeData !== 'undefined' && typeof routeData.section !== 'undefined' && routeData.type === 'section') {
        if (typeof start !== 'undefined') {
          let params = {
            request: 'content-list',
            sectionType: 'section',
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
    }, 50);
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
    this._removeInProgressRequest();
    this.async(() => {
      this.dispatchEvent(new CustomEvent('requestSection', {detail: requestObject }));
    });
  }
}

Polymer(cranberrySection);