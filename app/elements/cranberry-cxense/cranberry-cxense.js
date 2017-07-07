class cranberryCxense {
  beforeRegister() {
    this.is = 'cranberry-cxense';
    this.properties = {
      referrerURL: {
        type: String,
        value: ''
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

  _setupPageView(e) {
    let siteId = this.get('siteId');
    let locationURL = e.detail.location;
    let referrerURL = this.get('referrerURL');

    if (typeof referrerURL === 'undefined' || referrerURL === '') {
      this.set('referrerURL', locationURL);
    }

    window.cX = window.cX || {}; cX.callQueue = cX.callQueue || [];
    cX.callQueue.push(['initializePage']);
    cX.callQueue.push(['setSiteId', siteId]);
    cX.callQueue.push(['sendPageViewEvent', { 'location': locationURL, 'referrer':referrerURL}]);

    console.info('\<cranberry-cxense\> pageview sent');
  }


}
Polymer(cranberryCxense);
