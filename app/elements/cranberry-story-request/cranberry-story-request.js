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
        value: {}
      },
      currentPageId: {
        type: String,
        value: '',
        notify: true
      },
      error: {
        type: Object,
        value: {},
        notify: true
      },
      hidden: {
        type: Boolean,
        value: true
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
    this.observers = [
      '_setupRequest(pageId, staticPage, hidden)'
    ]
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
    if (typeof json !== 'undefined' && typeof json.detail !== 'undefined' && typeof json.detail.Result !== 'undefined') {
      let beforeParse = json.detail.Result;

      if (typeof beforeParse === 'string' && beforeParse.length > 0) {
        beforeParse = JSON.parse(beforeParse);
      }

      // Handle Empty Return Case
      if (Object.keys(beforeParse).length === 0) {
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

  _refreshStoryAds() {
    this.async(() => {
      let app = Polymer.dom(document).querySelector('cranberry-base');
      let story = Polymer.dom(app.root).querySelector('cranberry-story');

      story.refreshDFP();
    })
  }

  _setupRequest(pageId, staticPage, hidden) {
    this.debounce('_setupRequest', () => {
      if (!hidden) {
        if (typeof pageId !== 'undefined' && typeof staticPage !== 'undefined') {
          this.set('cachedPageId', pageId);
          this.set('currentPageId', pageId);
          if (staticPage) {
            this._setupStaticRequest(pageId);
          } else {
            this._setupStoryRequest(pageId);
          } 
        } else {
          
        }
      }
    });
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
    let currentRequest = this.get('request');

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
