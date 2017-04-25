class cranberryContentRequest {
  beforeRegister() {
    this.is = 'cranberry-content-request';
    this.properties = {
    };
    this.listeners = {
      'request-content': '_requestContent'
    };
  }

  attached() {
    console.log('EVENT LISTENER ATTACHED');
  }

  _requestContent(event) {
    console.log('EVENT RECEIVED');
    if (typeof event.detail !== 'undefined') {
      console.log('This is your event detail');
      console.dir(event.detail);

      let requester = Polymer.dom(this.root).querySelector('#request');
      let requestDetails = event.detail;
      let params = {
        request: requestDetails.request,
        desiredItemID: requestDetails.desiredItemID
      };

      requester.setAttribute('callback-value', requestDetails.callbackId);
      requester.params = params;
      requester.generateRequest();

      this.set('requestType', requestDetails.request);
    }
  }

  _handleResponse(response) {
    if (typeof response !== 'undefined' && typeof response.detail !== 'undefined' && typeof response.detail.Result !== 'undefined' && response.detail.Result.length > 0) {
      let result = JSON.parse(response.detail.Result);
      let requestType = this.get('requestType');

      switch(requestType) {
        case 'gallery':
          console.log('Gallery response event fired');
          this.fire('iron-signal', { name: 'gallery-content-received', data: { result } });
          break;   
      }
    }
  }
}
Polymer(cranberryContentRequest);
