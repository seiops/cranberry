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
      let ajax = this.$.request;
      let widgetId = this.get('widgetId');
      let affiliateId = this.get('affiliateId');

      this.async(function() {
          let params = {};
          let header = {};
          let body = {};
          header.TokenId = 0;
          header.AffiliateId = affiliateId;
          header.SessionId = null;

          body.affiliateId = header.AffiliateId;
          body.WidgetId = widgetId;
          body.LocationIds = [];
          body.count = 50;

          params.header = JSON.stringify(header);
          params.body = JSON.stringify(body);


          ajax.params = params;

          ajax.generateRequest();
      });
  }

  _handleResponse(response) {
      let jobs = response.detail.body.Jobs;

      if (jobs.length > 0) {
          let placement = this.get('placement');
          let index = this.get('index');
          let array = [];

          if (placement === 'rail') {
              index =  6;
              this.set('index', index);
          }

          for (let i = 0; i < index; i++) {
              console.info(jobs[i]);
              array[i] = jobs[i];
          }

          this.set('items', array);
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
