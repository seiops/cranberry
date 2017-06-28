class cranberryHomepage {
  get behaviors () {
    return [CranberryBehaviors.SectionRequestBehavior, CranberryBehaviors.PageviewBehavior, Polymer.NeonAnimationRunnerBehavior];
  }
  beforeRegister() {
    this.is = 'cranberry-homepage';
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
        type: Object,
        computed: '_computeRequestObject(start)'
      },
      route: Object,
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
      '_sendRequest(requestObject)',
      '_routeChanged(route)'
    ];
  }

  ready() {
    console.info('\<cranberry-homepage\> ready');
    this._responseListener = this._responseHandler.bind(this);  
  }

  attached() {
    console.info('\<cranberry-homepage\> attached');
    this.addEventListener('response-received', this._responseListener);
  }
  
  detached() {
    console.info('\<cranberry-homepage\> detached');
    this.removeEventListener('response-received', this._responseListener);

    this._removeInProgressRequest();
  }

  _computeRequestObject(start) {
    if (typeof start !== 'undefined') {
      let params = {
        auxJailMugs: 1,
        disableFeatured: false,
        request: 'content-list',
        sectionType: 'homepage',
        desiredSection: 'homepage',
        desiredCount: 17,
        desiredStart: start
      };

      if (start > 1) {
        params.disableFeatured = true;
        params.auxJailMugs = 0;
        params.desiredCount = 18;
      }

      return params;
    }
  }

  _computeCount(currentPage) {
    if (typeof currentPage !== 'undefined') {
      if (currentPage === 1) {
        return 17;
      } else {
        return 18;
      }
    } else {
      return 18;
    }
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
}

Polymer(cranberryHomepage);