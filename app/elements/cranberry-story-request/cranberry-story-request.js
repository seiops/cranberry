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
      '_setupRequest(pageId, staticPage)',
      '_hiddenChanged(hidden)'
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

  _hiddenChanged(hidden) {
    this.async(() => {
      if (typeof hidden !== 'undefined' && !hidden) {
        let cachedPageId = this.get('cachedPageId');
        let pageId = this.get('pageId');

        if (typeof cachedPageId !== 'undefined' && cachedPageId !== '' && typeof pageId !== 'undefined') {
          if (cachedPageId === pageId) {
            let cachedResponse = this.get('cachedResponse');
            this._sendCachedPageview(cachedResponse);
            this._refreshStoryAds();
          }
          
        } 
      }
    });
  }

  _refreshStoryAds() {
    this.async(() => {
      let app = Polymer.dom(document).querySelector('cranberry-base');
      let story = Polymer.dom(app.root).querySelector('cranberry-story');

      story.refreshDFP();
    })
  }

  _sendCachedPageview(story) {
      console.info('\<cranberry-story-request\> sending cached pageview');
      var { byline: { inputByline: byline }, sectionInformation: { section }, published: published, tags: tags, itemId: storyId } = story;

      if (typeof story.byline !== 'undefined') {
        if (typeof story.byline.title !== 'undefined') {
          byline = story.byline.title;
        }
      }

      if (section === '') {
        section = story.sectionInformation.sectionParentName;
      }

      let data = {
        dimension1: (typeof byline !== 'undefined') ? byline : '',
        dimension3: (typeof published !== 'undefined') ? published : '',
        dimension6: 'Story',
        dimension8: (typeof tags !== 'undefined') ? tags : ''
      };
    
      // Send pageview event with iron-signals
      this.fire('iron-signal', {name: 'track-page', data: { path: '/story/' + storyId, data } });

      // Send Chartbeat
      this.fire('iron-signal', {name: 'chartbeat-track-page', data: { path: '/story/' + storyId, data: {'sections': section, 'authors': byline } } });

      // Fire Youneeq Page Hit Request
      this.fire('iron-signal', {name: 'page-hit'});
      this.fire('iron-signal', {name: 'observe', data: {content: story}});
  }

  _setupRequest(pageId, staticPage) {
    this.async(() => {
      let cachedPageId = this.get('cachedPageId');

      if (typeof pageId !== 'undefined' && typeof staticPage !== 'undefined') {
        if (cachedPageId !== pageId) {
          this.set('cachedPageId', pageId);
          this.set('currentPageId', pageId);
          if (staticPage) {
            this._setupStaticRequest(pageId);
          } else {
            this._setupStoryRequest(pageId);
          } 
        } else {
          let cachedResponse = this.get('cachedResponse');
          this.set('currentPageId', pageId);
          this.set('response', cachedResponse);
          this._sendCachedPageview(cachedResponse);
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
