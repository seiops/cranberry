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
      error: {
        type: Object,
        observer: '_onError'
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
        if (!this.hidden) {
          console.info('\<cranberry-staff-list\> route changed -\> ' + newValue.path);
          if (typeof newValue !== 'undefined' && newValue.path === '/contact') {
            this._updateParams();
          }
        }
      });
    }
  }

  _updateParams() {
    let items = this.get('items');

    if (items.length === 0) {
      let currentRequest = this.get('request');

      if (typeof currentRequest !== 'undefined' && currentRequest.loading === true) {
          console.info('<\cranberry-staff-list\> aborting previous request');
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
      console.info('<\cranberry-staff-list\> load received');
  }

  _handleResponse() {
      console.info('<\cranberry-staff-list\> response received');
  }

  _parseResponse(response) {
      var result = JSON.parse(response.Result);

      this.set('items', result);
      
      if (result.length === 0) {
        let contactPage = document.querySelector('cranberry-contact-page');

        contactPage.set('noStaff', true);
      }
  }

  _computeStaffImage(imageObject) {
    let baseUrl = this.get('baseUrl');

    if (typeof imageObject.small !== 'undefined') {
      return baseUrl + '/' + imageObject.small;
    } else {
      return 'http://imgsrc.me/200x113/9c9c9c/000000/Image Unavailable?showDimensions=0&font=arial';
    }
  }

  _onError(event) {
    event.preventDefault();
    // Log Error
    console.error('Error occured on <\cranberry-staff-list\> request! This is more than likely because the site doesn\'t have any staff memebers in the congero DB.');
    // Set display boolean on contact page to true to hide area.
    let contactPage = document.querySelector('cranberry-contact-page');
    contactPage.set('noStaff', true);
  }

}
Polymer(cranberryStaffList);
