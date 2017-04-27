class cranberryHeaderLinks {
  beforeRegister() {
    this.is = 'cranberry-header-links';
    this.properties = {
      items: {
        type: Object,
        value: []
      }
    };
    this.listeners = { 
      'top-menu-content-received': '_contentReceived',
      'top-menu-request-info': '_requestReceived'
    };
  }

  attached() {
    this.async(() => {
      this.fire('iron-signal', { name: 'request-content', data:{request: 'menu', desiredMenu: 'top-menu', callbackId: 'topNavigation'}});
    });
  }

  _contentReceived(event) {
    if (typeof event.detail.result.items !== 'undefined') {
      this.set('items', event.detail.result.items);
    }
  }

  _requestReceived(event) {
    if (typeof event.detail.request !== 'undefined') {
      this.set('currentRequest', event.detail.request);
    }
  }
}
Polymer(cranberryHeaderLinks);
