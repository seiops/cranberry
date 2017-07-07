class cranberryCxense {
  beforeRegister() {
    this.is = 'cranberry-cxense';
    this.properties = {
      currentURL: {
        type: String,
        value: ''
      },
      domain: String,
      referrerURL: {
        type: String,
        value: ''
      },
      route: {
        type: Object,
        observer: '_routeChanged'
      },
      siteId: {
        type: String,
        value: ''
      }
    };
  }

  attached() {
    console.info('\<cranberry-cxense\> attached');

    window.addEventListener('send-cxense-pageview', this._setupPageView);
  }

  ready() {
    console.info('\<cranberry-cxense\> ready');

    this._setupPageView = this._setupPageView.bind(this);
  }

  detached() {
    console.info('\<cranberry-cxense\> detached');
    window.removedEventListener('send-cxense-pageview', this._setupPageView);
  }

  _routeChanged(route, oldRoute) {
    let domain = this.get('domain');
    this.set('currentURL', domain + route.path);

    if (typeof oldRoute !== 'undefined') {
      this.set('referrerURL', domain + oldRoute.path);
    } else {
      if (typeof document.referrer !== 'undefined') {
        this.set('referrerURL', document.referrer);
      }
    }
  }

  _setupPageView(e) {
    this.async(() => {
      let siteId = this.get('siteId');
      let eventLocation = e.detail.location;
      let currentURL = this.get('currentURL');
      let locationURL = (eventLocation !== currentURL ? eventLocation : currentURL);
      let referrerURL = this.get('referrerURL');

      if (locationURL === referrerURL) {
        referrerURL = '';
      }

      window.cX = window.cX || {}; cX.callQueue = cX.callQueue || [];
      cX.callQueue.push(['initializePage']);
      cX.callQueue.push(['setSiteId', siteId]);
      cX.callQueue.push(['sendPageViewEvent', { 'location': locationURL, 'referrer': referrerURL }]);

      console.info(`\<cranberry-cxense\> pageview sent ReferrerURL: ${referrerURL}, locationURL: ${locationURL}`);
    });
    
  }


}
Polymer(cranberryCxense);
