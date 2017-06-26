class cranberryHomepage {
  get behaviors () {
    return [CranberryBehaviors.SectionRequestBehavior, CranberryBehaviors.PageviewBehavior, Polymer.NeonAnimationRunnerBehavior];
  }
  beforeRegister() {
    this.is = 'cranberry-homepage';
    this.properties = {
      computedCount: {
        type: Number,
        computed: '_computeCount(page, urlPage)'
      },
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
      },
      urlPage: {
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

  _computeCount(currentPage, urlPage) {
    console.log(`The URLPAGE: ${urlPage} and the currentPage ${currentPage}`);

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

  _routeChanged(route) {
    console.dir(route);
    
    if (typeof route.__queryParams !== 'undefined' && typeof route.__queryParams.page !== 'undefined') {
      console.log(`The route query params ${route.__queryParams.page}`);
      this.set('urlPage', route.__queryParams.page);
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

Polymer(cranberryHomepage);