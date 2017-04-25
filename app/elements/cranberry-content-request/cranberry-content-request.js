class cranberryContentRequest {
  beforeRegister() {
    this.is = 'cranberry-content-request';
    this.properties = {
      request: Object,
      requestInFlight: Boolean
    };
    this.listeners = {
      'request-content': '_requestContent',
      'cancel-request-content': '_cancelRequestContent'
    };
  }

  attached() {
  }

  _cancelRequestContent() {
    let requestInFlight = this.get('requestInFlight');

    if (requestInFlight) {
      let currentRequest = this.get('request');

      if (typeof currentRequest !== 'undefined' && currentRequest.loading) {
        let requester = Polymer.dom(this.root).querySelector('#request');

        console.info('<\cranberry-content-request\> aborting previous request');
        requester.abortRequest(currentRequest);
      }
    }
  }

  _requestContent(event) {
    if (typeof event.detail !== 'undefined') {
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
          this.fire('iron-signal', { name: 'gallery-content-received', data: { result } });
          break;   
      }
    }
  }
}
Polymer(cranberryContentRequest);
