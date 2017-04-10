class youneeqTracker {
  beforeRegister() {
    this.is = 'youneeq-tracker';
    this.properties = {
      content: {
        type: Object,
        value: function() {
          return {};
        }
      },
      domain: {
        type: String
      },
      pageHit: {
        type: Object
      },
      previousURL: {
        type: String,
        value: function() {
          return document.referrer;
        }
      },
      youneeqId: {
        type: String,
        value: ''
      },
      response: {
        type: Object,
        observer: '_parseResponse'
      },
      pageHitResponse: {
        type: Object,
        observer: '_parsePageHitResponse'
      },
      yqCallbackId: {
        type: Object,
        value: {
          sessionId: this._generateId(),
          pageId: '',
          requestCount: '',
        }
      }
    };
    this.listeners = {
      'page-hit': 'sendPageHit',
      'observe': 'sendObserve'
    };
    this.observers = [
      '_pageHitChanged(content)',
      '_contentChanged(content)'
    ];
  }

  callbackIdRecieved(event) {
    let callbackId = event.detail.content;

    this.set('yqCallbackId', callbackId);
  }
  attached() {

  }

  _generateId() {
		return Math.floor(10000000 + Math.random() * 89999999).toString();
	}

  ready() {
    this._setYouneeqId();
  }

  _setYouneeqId() {
    let el = this;
    fetch('http://api.youneeq.ca/app/sessionid')
      .then(function(response) {
        return response.text();
      }).then(function(text) {
        let bof_session = '';
        let hasStorage = (function() {
          try {
              localStorage.setItem('yqt', 't');
              localStorage.removeItem('yqt');
              return true;
          } catch (exception) {
              return false;
          }
        }());

        if (hasStorage) {
            if (localStorage.getItem('yq_session') === null || localStorage.getItem('yq_session').length < 8) {
                localStorage.setItem('yq_session', text);
            }
            bof_session = localStorage.getItem('yq_session');
        }
        else {
            bof_session = text;
        }

        el.set('youneeqId', bof_session);
      });
  }

  sendPageHit(event) {
    this._handleEvent(event, 'page-hit');
  }

  sendObserve(event) {
    this._handleEvent(event, 'observe');
  }

  _handleEvent(event, eventName) {
    if(typeof event.detail !== 'undefined' && event.detail && typeof event.detail.content !== 'undefined') {
      console.info('<\youneeq-tracker\> ' + eventName + ' received');
      let content = event.detail.content;

      if (eventName === 'page-hit') {
        this._pageHitChanged(content);
      } else if (eventName === 'observe') {
        this._contentChanged(content);
      }
    } else {
      // Set content to the dummy object with timestamp to ensure no stale content
      this.set('content', {noContent: true, timestamp: event.timestamp});
    }
  }

  _handleLoad() {
    // console.info('<\youneeq-tracker\> load received');
  }

  _handleResponse(response) {
    console.info('<\youneeq-tracker\> observe response received');
  }

  _handlePageHitResponse(response) {
    console.info('<\youneeq-tracker\> page hit response received');
  }

  _parseResponse(response) {
    if (typeof response.suggest !== 'undefined' && typeof response.suggest.node !== 'undefined' && response.suggest.node && response.suggest.node.length > 0) {
      console.info('<\youneeq-tracker\> suggestions received');
      this.fire('iron-signal', {name: 'youneeq-suggestions', data: {content: response.suggest.node}});
    }
  }

  _parsePageHitResponse(response) {
    // console.info('<\youneeq-tracker\> page hit sent');
  }

  _contentChanged(content) {
    this.async(() => {
      if (typeof content !== 'undefined' && Object.keys(content).length > 0 && !content.noContent) {
        let domain = this.get('domain');
        let user = this.get('user');
        let callbackId = this.get("yqCallbackId");
        
        let fullObject = {
          domain: domain,
          observe: [{
            title: content.title,
            categories: [content.sectionInformation.section],
            description: content.preview,
            create_date: content.published,
            image: (Object.keys(content.mediaAssets). length > 0 ? domain + content.mediaAssets.images[0].exlarge : '')
          }],
          suggest: [{
            type: 'node',
            count: 6,
            categories: [],
            is_panel_detailed: true,
            isAllClientDomains: false
          }],
          content_id: content.itemId,
          bof_profile: this.get('youneeqId'),
          href: window.location.href,
          gigya: user
        };
        
        let request = this.querySelector('#observeRequest');
        let currentRequest = this.get('request');

        let jsonString = JSON.stringify(fullObject);

        if (typeof currentRequest !== 'undefined' && currentRequest.loading === true) {
          console.info('<\youneeq-tracker\> aborting previous observe request');
          request.abortRequest(currentRequest);
        }

        request.url = 'http://api.youneeq.ca/api/observe';
        request.params.json = jsonString;

        if (!callbackId.sessionId){
          callbackId.sessionId = this._generateId();
        }

        callbackId.requestCount++;
        this.fire('iron-signal', {name: 'youneeq-callbackid', data: { content: callbackId }});
        let now = new Date().getTime();
        request.setAttribute('callback-value', "yq_" + callbackId.sessionId + "_" + callbackId.pageId + "_" + now + "_" + callbackId.requestCount);

        request.generateRequest();
      }
    });
  }

  _pageHitChanged(content) {
    this.async(() => {
      if (typeof content !== 'undefined' && Object.keys(content).length > 0) {
        let domain = this.get('domain');
        let timeZone = jzTimezoneDetector.determine_timezone();
        let utcOffset = timeZone.timezone.utc_offset;
        let timeZoneName = timeZone.timezone.olson_tz;
        let bof_profile = this.get('youneeqId');
        let referrer = this.get('previousURL');

        let fullObject = {
          domain: domain,
          content_id: (typeof content.itemId !== 'undefined' ? content.itemId : ''),
          page_hit: {
            href: window.location.href,
            tz_off: utcOffset,
            tz_name: timeZoneName
          },
          bof_profile: bof_profile,
          href: window.location.href,

        };

        let jsonString = JSON.stringify(fullObject);
        let request = this.querySelector('#pageHitRequest');
        let currentRequest = this.get('pageHitRequest');
        let callbackId = this.get("yqCallbackId");

        if (typeof currentRequest !== 'undefined' && currentRequest.loading === true) {
          console.info('<\youneeq-tracker\> aborting previous page hit request');
          request.abortRequest(currentRequest);
        }
        
        callbackId.pageId = this._generateId();
        this.set("yqCallbackId", callbackId);
        request.url = 'http://api.youneeq.ca/api/observe';
        request.params.json = jsonString;

        if (!callbackId.sessionId){
          callbackId.sessionId = this._generateId();
        }

        callbackId.requestCount++;
        this.fire('iron-signal', {name: 'youneeq-callbackid', data: { content: callbackId }});
        let now = new Date().getTime();
        request.setAttribute('callback-value', "yq_" + callbackId.sessionId + "_" + callbackId.pageId + "_" + now + "_" + callbackId.requestCount);

        request.generateRequest();

        this.set('previousURL', window.location.href);
      }
    });
  }
}
Polymer(youneeqTracker);
