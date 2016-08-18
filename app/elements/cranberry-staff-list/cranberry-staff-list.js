class cranberryStaffList {
  beforeRegister() {
    this.is = 'cranberry-staff-list';
    this.properties = {
      items: {
        type: Object,
        value: []
      },
      rest: {
        type: String
      },
      params: {
          type: Object,
          value: [],
          observer: '_changeParams'
      },
      response: {
          type: Object,
          observer: '_parseResponse'
      },
      route: {
        type: Object,
        observer: '_onRouteChanged'
      },
      baseUrl: {
        type: String
      }
    };
  }

  _onRouteChanged(newValue) {
    if (typeof newValue !== 'undefined') {
      this.async(function() {
          app.logger('\<cranberry-staff-list\> route changed -\> ' + newValue.path);
          if (typeof newValue !== 'undefined' && newValue.path === '/contact') {
            this._updateParams();
          }
      });
    }
  }

  _updateParams() {
    let items = this.get('items');

    if (items.length === 0) {
      let currentRequest = this.get('request');

      if (typeof currentRequest !== 'undefined' && currentRequest.loading === true) {
          app.logger('<\cranberry-staff-list\> aborting previous request');
          this.$.request.abortRequest(currentRequest);
      }

      let jsonp = {};

      jsonp.request = 'congero';
      jsonp.desiredContent = 'staff';
      jsonp.desiredStaff = 1;
      this.set('params', jsonp);
    }
  }

  _changeParams() {
    let params = this.get('params');

    if (params.length !== 0) {
        this.$.request.setAttribute('url', this.get('rest'));
        this.$.request.params = params;
        this.$.request.generateRequest();
    }
  }

  _handleLoad() {
      app.logger('<\cranberry-staff-list\> load received');
  }

  _handleResponse() {
      app.logger('<\cranberry-staff-list\> response received');
  }

  _parseResponse(response) {
      var result = JSON.parse(response.Result);

      this.set('items', result);
  }

  _computeStaffImage(imageObject) {
    let baseUrl = this.get('baseUrl');

    if (typeof imageObject.small !== 'undefined') {
      return baseUrl + '/' + imageObject.small;
    } else {
      return 'http://imgsrc.me/200x113/9c9c9c/000000/Image Unavailable?showDimensions=0&font=arial';
    }
  }

}
Polymer(cranberryStaffList);
