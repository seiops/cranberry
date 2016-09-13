class CranberryContentList {
  beforeRegister() {
    this.is = 'cranberry-content-list';
    this.properties = {
      count: {
        type: Number
      },
      items: {
        type: Object,
        value: []
      },
      params: {
        type: Object,
        value: [],
        observer: '_changeParams'
      },
      request: Object,
      response: {
        type: Object,
        observer: '_parseResponse'
      },
      rest: {
        type: String
      },
      sections: {
        type: String,
        observer: '_changeSections'
      },
      hidePreviousButton: {
        type: Boolean,
        value: true
      },
      start: {
        type: Number,
        observer: '_changeStart'
      },
      type: {
        type: String
      },
      tag: {
        type: String
      },
      tags: {
        type: Boolean,
        value: false
      }
    };
  }

  attached() {
    app.logger('\<cranberry-content-list\> attached');
  }

  _changeParams() {
    let params = this.get('params');

    if (params.length !== 0 && params.desiredCount) {
      this.$.request.setAttribute('url', this.get('rest'));
      this.$.request.params = params;
      this.$.request.generateRequest();
    }
  }

  _changeSections(section) {
    this.async(function() {
      app.logger('\<cranberry-content-list\> section changed -\> ' + section);
      let start = this.get('start');
      if (start > 1) {
        this.set('start', 1);
      } else {
        this._updateParams();
      }
    });
  }

  _changeStart(start) {
    this.async(function () {
      app.logger('\<cranberry-content-list\> start changed -\> ' + start);

      let count = this.get('count');

      if (start > count) {
        this.set('hidePreviousButton', false);
      } else {
        this.set('hidePreviousButton', true);
      }
      this._updateParams();
    });
  }

  _checkInStreamAd(index) {
    if (index === 2 || index === 11) {
      return true;
    } else {
      return;
    }
  }

  _checkAdPos(index, desiredIndex) {
    if (index === desiredIndex) {
      return true;
    } else {
      return;
    }
  }

  _checkNativeAd(index) {
    if (index === 2 || index === 15) {
      return true;
    } else {
      return;
    }
  }

  _checkLeaderboardAd(index) {
    if (index === 9) {
      return true;
    } else {
      return;
    }
  }

  _checkJobsWidget(index) {
      if (index === 11) {
          return true;
      } else {
          return;
      }
  }

  _checkTopComments(index) {
    if (index === 3) {
      return true;
    } else {
      return;
    }
  }

  _checkJobsWidget(index) {
      if (index === 11) {
          return true;
      } else {
          return;
      }
  }

  _handleLoad() {
    app.logger('<\cranberry-content-list\> load received');
  }

  _handleResponse(res) {
    app.logger('<\cranberry-content-list\> response received');
  }

  _hasPreview(preview) {
    if (typeof preview !== 'undefined' && preview.length > 0) {
      return true;
    } else {
      return;
    }
  }

  _parseResponse(response) {
    var result = JSON.parse(response.Result);

    this.set('items', result);
  }

  _showPrevious() {
    let start = this.get('start');
    let count = this.get('count');
    let offset = start - count;

    this.set('start', offset);
  }

  _showNext() {
    let start = this.get('start');
    let count = this.get('count');
    let offset = start + count;

    this.set('start', offset);
  }

  _updateParams() {
    let currentRequest = this.get('request');
    let tags = this.get('tags');

    if (typeof currentRequest !== 'undefined' && currentRequest.loading === true) {
      app.logger('<\cranberry-content-list\> aborting previous request');
      this.$.request.abortRequest(currentRequest);
    }

    this.set('items', []);

    let jsonp = {};

    jsonp.request = 'content-list';
    if (typeof tags !== 'undefined' && tags) {
      let sections = this.get('sections');
      sections = sections.replace('-', ' ');
      jsonp.desiredTags = sections;
    } else {
      jsonp.desiredSection = this.get('sections');
    }
    jsonp.desiredContent = this.get('type');
    jsonp.desiredCount = this.get('count');
    jsonp.desiredStart = this.get('start');

    this.set('params', jsonp);
  }
}
// Public methods.
// ready () {
//   app.logger('\<cranberry-content-list\> ready');
// }
// Private methods
Polymer(CranberryContentList);
