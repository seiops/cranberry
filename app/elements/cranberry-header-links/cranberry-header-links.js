class cranberryHeaderLinks {
  beforeRegister() {
    this.is = 'cranberry-header-links';
    this.properties = {
      items: {
        type: Object,
        value: []
      },
      params: {
        type: Object,
        value: function() {
          return {
            request: 'menu',
            desiredMenu: 'topMenu'
          }
        }
      },
      rest: String,
    }
  }

  attached() {
    this.async(() => {
      let request = this.$.request;
      let restUrl = this.get('rest');
      let params = this.get('params');

      request.setAttribute('url', restUrl);
      request.setAttribute('callback-value', 'topNavigation');
      request.params = params;

      request.generateRequest();

      let menu = this.$.menu;
    });
  }

  _handleResponse(response) {
    if (typeof response.detail.Result !== 'undefined') {
      let result = JSON.parse(response.detail.Result);
      
      this.set('items', result.items);
    }
  }
}
Polymer(cranberryHeaderLinks);
