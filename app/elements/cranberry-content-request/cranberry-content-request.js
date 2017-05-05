class cranberryContentRequest {
  beforeRegister() {
    this.is = 'cranberry-content-request';
    this.properties = {
      overflow: {
        type: Array,
        value: function() {
          return [];
        }
      },
      request: Object,
      requestInFlight: Boolean,
      requestTwoInFlight: Boolean,
      requestThreeInFlight: Boolean,
      requestFourInFlight: Boolean,
      requestersState: {
        type: Object,
        computed: '_computeState(requestInFlight, requestTwoInFlight, requestThreeInFlight, requestFourInFlight)'
      }
    };
    this.observers = [
      '_checkOverflow(requestersState, overflow)'
    ]
    this.listeners = {
      'request-content': '_requestContent',
      'cancel-request-content': '_cancelRequestContent'
    };
  }

  _cancelRequestContent(event) {
    let request = event.detail.request;
    let requester = event.detail.requester;

    console.info('<\cranberry-content-request\> aborting previous request');
    requester.abortRequest(request);
  }

  _checkOverflow(requestersState, overflow) {
    if (typeof overflow !== 'undefined' && overflow.length > 0) {
      let requester = this._findAvailableRequester(requestersState);

      if (typeof requester !== 'undefined' && requester) {
        // pop item off back of array
        let params = overflow.pop();
        // Get the callback ID and remove it from the object
        let callbackId = params.callbackId;
        delete params['callbackId'];

        this._setupRequest(requester, params, callbackId);
      }
    }
  }

  _computeState(r1, r2, r3, r4) {
    // Return the loading status of all requesters in the DOM
    return {
      requester1: r1,
      requester2: r2,
      requester3: r3,
      requester4: r4
    }
  }

  _findAvailableRequester(requestersState) {
    // Find requester that isnt currently loading
    let id = Object.keys(requestersState).find(key => requestersState[key] === false);

    if (typeof id !== 'undefined' && id !== '') {
      switch(id) {
        case 'requester1': 
          this.set('requestInFlight', true);
          break;
        case 'requester2': 
          this.set('requestTwoInFlight', true);
          break;
        case 'requester3': 
          this.set('requestThreeInFlight', true);
          break;
        case 'requester4': 
          this.set('requestFourInFlight', true);
          break;
      }

      // Return the DOM element of the requester
      return Polymer.dom(this.root).querySelector('#' + id);
    } else {
      // All requesters are busy return false
      return false;
    }
  }

  _requestContent(event) {
    this.async(() => {
      if (typeof event.detail !== 'undefined') {
        let requestersState = this.get('requestersState');
        let availableRequester = this._findAvailableRequester(requestersState);
        let params = this._setupParams(event.detail);

        if (availableRequester) {
          // Do something with the requester
          this._setupRequest(availableRequester, params, event.detail.callbackId);
        } else {
          // No available requester add to the overflow stack
          let overflow = this.get('overflow');
          params.callbackId = event.detail.callbackId;
          overflow.push(params);

          this.set('overflow', overflow);
        }
      }
    }, 75);
  }

  _setupParams(details) {
      let requestType = details.request;
      let params = {
        request: requestType
      };

      // Set Item ID for stories and gallery pages
      if (typeof details.desiredItemID !== 'undefined') {
        params.desiredItemID = details.desiredItemID;
      }

      // Set desired menu for navigation menu requests
      if (typeof details.desiredMenu !== 'undefined') {
        params.desiredMenu = details.desiredMenu;
      }

      return params;
  }

  _sendEvent(data) {
    let path = `${data.requestType}-${data.eventType}`;
    switch(data.eventType) {
      case 'content-received':
        let result = data.result;
        this.fire('iron-signal', { name: path, data: { result } });
        break;
      case 'request-info':
        let request = data.request;
        let requester = data.requester;
        this.fire('iron-signal', { name: path, data: { request, requester } });
        break;
      default:
        console.log('This is a default case of ' + data.eventType);
    }
  }

  _handleResponse(response) {
    this.async(() => {
      if (typeof response !== 'undefined' && typeof response.detail !== 'undefined' && typeof response.detail.Result !== 'undefined' && response.detail.Result.length > 0) {
        let result = JSON.parse(response.detail.Result);
        let data = {
          eventType: 'content-received',
          requestType: result.contentType,
          result: result
        };

        this._sendEvent(data);
      }
    });
  }

  _setupRequest(requester, params, callback) {
    this.async(() => {
      if (requester) {
        let specificRequest = (params.request === 'menu' ? params.desiredMenu : params.request);
        requester.set('callbackValue', callback);
        requester.set('params', params);
        requester.generateRequest();
        this._sendEvent({eventType: 'request-info', requestType: specificRequest, requester: requester, request: requester.activeRequests[0]});
      }
    });
  }
}
Polymer(cranberryContentRequest);
