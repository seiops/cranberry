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
      let request = this.$.request;
      let widgetId = this.get('widgetId');
      let affiliateId = this.get('affiliateId');
      let params = {};
      let header = {};
      let body = {};

      header.TokenId = 0;
      header.AffiliateId = parseInt(affiliateId);
      header.SessionId = null;

      body.affiliateId = header.AffiliateId;
      body.WidgetId = widgetId;
      body.LocationIds = [];
      body.Count = 50;

      params.header = JSON.stringify(header);
      params.body = JSON.stringify(body);
      request.setAttribute('callback-value', 'callbackSectionTracker');

      request.params = params;

      request.generateRequest();
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
