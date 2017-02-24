class cranberryStoryRequest {
  beforeRegister() {
    this.is = 'cranberry-story-request';
    this.properties = {
      cachedPageId: {
        type: String,
        value: '',
        notify: true
      },
      cachedResponse: {
        type: Object,
        value: {},
        notify: true
      },
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
        reflectToAttribute: true,
        notify: true
      },
      staticPage: Boolean
    }
    this.observers = ['_setupRequest(pageId, staticPage)']
  }

  // Lifycyle Methods
  attached() {
    console.info('\<cranberry-story-request\> attached');
  }

  detached() {
    console.info('\<cranberry-story-request\> detached');
  }

  // Private Methods
  _handleResponse(json) {
    console.info('\<cranberry-story-response\> json response received');
    let result = {};
    if (typeof json !== 'undefined' && typeof json.detail !== 'undefined' && json.detail.Result !== 'undefined') {
      console.dir(result);
      console.log(Object.keys(json.detail.Result).length);
      
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
        this.set('cachedResponse', result);
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
    console.log('SETTING UP REQUEST!');
    if (typeof pageId !== 'undefined' && typeof staticPage !== 'undefined') {
      this.set('cachedPageId', pageId);
      // this.set('cachedPageId', pageId);
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
