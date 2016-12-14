class cranberryJobsWidget {
  beforeRegister() {
    this.is = 'cranberry-jobs-widget';
    this.properties = {
        affiliateId: {
            type: String
        },
        widgetId: {
            type: String
        },
        placement: {
            type: String,
            value: 'content'
        },
        items: {
            type: Array,
            value: []
        },
        index: {
            type: Number,
            value: 4
        }
    }
  }

  attached() {
    let items = this.get('items');

    this.async(() => {
      if (items.length === 0) {
        let request = this.$.request;
        let currentRequest = this.get('request');
        let widgetId = this.get('widgetId');
        let affiliateId = this.get('affiliateId');
        let params = {};
        let header = {};
        let body = {};

        if (typeof currentRequest !== 'undefined' && currentRequest.loading === true) {
          console.info('<\cranberry-jobs-widget\> aborting previous request');
          request.abortRequest(currentRequest);
        }
        
        header.TokenId = 0;
        header.AffiliateId = parseInt(affiliateId);
        header.SessionId = null;

        body.affiliateId = header.AffiliateId;
        body.WidgetId = widgetId;
        body.LocationIds = [];
        body.Count = 50;

        params.header = JSON.stringify(header);
        params.body = JSON.stringify(body);
        // request.setAttribute('callback-value', 'callbackJobsWidget');

        request.params = params;

        request.generateRequest();
        }
    });
  }

  detached() {
    console.log('JOBS WIDGET DETACHED!');
    let request = this.$.request;
    let currentRequest = this.get('request');

    request.abortRequest(currentRequest);
  }

  _handleResponse(response) {
      let jobs = response.detail.body.Jobs;

      if (jobs.length > 0) {
        this.set('index', jobs.length);
        this.set('items', jobs);
      }
  }

  _isLastItem(index) {
      let maxIndex = this.get('index');

      if (index === maxIndex - 1) {
          return true;
      } else {
          return false;
      }
  }
}
Polymer(cranberryJobsWidget);
