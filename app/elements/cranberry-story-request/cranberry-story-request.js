class cranberryStoryRequest {
  beforeRegister() {
    this.is = 'cranberry-story-request';
    this.properties = {
      error: {
        type: Object,
        value: {},
        notify: true
      },
      pageId: String,
      response: {
        type: Object,
        notify: true
      },
      requestInProgress: {
        type: Boolean,
        value: true,
        notify: true
      },
      staticPage: Boolean
    }
    this.observers = ['_setupRequest(pageId, staticPage)']
  }

  // Private Methods
  _handleResponse(json) {
    console.info('\<cranberry-story-response\> json response received');
    let result = {};
    if (typeof json !== 'undefined' && typeof json.detail !== 'undefined' && json.detail.Result !== 'undefined') {
      // Handle Empty Return Case
      if (Object.keys(json.detail.Result).length === 0) {
        let error = {
          errorMessage: "No content fetched.",
          errorCode: 2
        };
        this.set('error', error);
      } else {
        // Parse Response
        result = JSON.parse(json.detail.Result);
      }
    }
    
    // Test for Endpoint Error
    if (typeof result.errorCode !== 'undefined') {
      // Set Error
      this.set('error', result);
    } else {
      // Set Response
      this.set('response', result);
    }
  }

  _setupRequest(pageId, staticPage) {
    if (typeof pageId !== 'undefined' && typeof staticPage !== 'undefined') {
      if (staticPage) {
        this._setupStaticRequest(pageId);
      } else {
        this._setupStoryRequest(pageId);
      }
    }
  }

  _setupStaticRequest(pageId) {
    let request = this.$.request;
    let params = {
      desiredContent: 'static',
      desiredTitle: pageId,
      preview: 1,
      request: 'congero'
    };

    request.setAttribute('callback-value', 'storyrequeststaticcallback');
    request.params = params;
    request.generateRequest();
  }

  _setupStoryRequest(pageId) {
    let request = this.$.request;
    let params = {
      desiredItemID: pageId,
      preview: 1,
      request: 'story'
    };

    request.setAttribute('callback-value', 'storyrequestcallback');
    request.params = params;
    request.generateRequest();
  }
}
Polymer(cranberryStoryRequest);
