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
        type: Object,
        observer: '_pageHitChanged'
      },
      previousURL: {
        type: String,
        value: ''
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
    console.info('<\youneeq-tracker\> page hit event received');
    this.set('pageHit', this._setPageHit());
  }

  // Method to send the observe object and get in return the suggest object
  sendObserve(event) {
    let content = event.detail.content;
    this._contentChanged(content);
  }

  _handleLoad() {
    console.info('<\youneeq-tracker\> load received');
  }

  _handleResponse() {
    console.info('<\youneeq-tracker\> response received');
  }

  _handlePageHitResponse() {
    console.info('<\youneeq-tracker\> page hit response received');
  }

  _parseResponse(response) {
    if (typeof response.suggest !== 'undefined' && typeof response.suggest.node !== 'undefined' && response.suggest.node && response.suggest.node.length > 0) {
      console.info('<\youneeq-tracker\> suggestions received');
      this.fire('iron-signal', {name: 'youneeq-suggestions', data: {content: response.suggest.node}});
    }
  }

  _parsePageHitResponse(response) {
    console.info('<\youneeq-tracker\> page hit sent');
  }

  _contentChanged(content, oldContent) {
    if (typeof content !== 'undefined' && Object.keys(content).length > 0) {
      // Content has CHANGED
      let fullObject = {};
      let observe = [];
      let observeObj = {};
      let suggest = [];
      let suggestObj = {};
      let domain = this.get('domain');
      let user = this.get('user');
      let callbackId = this.get("yqCallbackId");
      
      observeObj.type = 'node';
      observeObj.name = content.itemId;
      observeObj.title = content.title;
      observeObj.categories = [content.sectionInformation.section];
      observeObj.description = content.preview;
      if (Object.keys(content.mediaAssets).length > 0) {
        observeObj.image = domain + content.mediaAssets.images[0].exlarge;
      }
      observeObj.create_date = content.published;

      observe[0] = observeObj;

      suggestObj.type = 'node';
      suggestObj.count = 5;
      suggestObj.categories = [];
      suggestObj.is_panel_detailed = true;
      suggestObj.isAllClientDomains = false;

      suggest[0] = suggestObj;
      

      fullObject.domain = domain;
      // For Localhost Testing uncomment below; comment out above line.
      // fullObject.domain = 'localhost';
      fullObject.observe = observe;
      fullObject.suggest = suggest;
      // For Localhost Testing uncomment this
      // fullObject.alt_href = 'http://sedev.libercus.net/News/2016/08/18/Ogden-s-STEM-school-makes-its-debut-with-enthusiasm.html';
      fullObject.bof_profile = this.get('youneeqId');
      fullObject.href = window.location.href;
      fullObject.gigya = user;

      let request = this.querySelector('#observeRequest');
      let jsonString = JSON.stringify(fullObject);

      request.url = 'http://api.youneeq.ca/api/observe';
      request.params.json = jsonString;

      if (!callbackId.sessionId){
        callbackId.sessionId = this._generateId();
      }
      callbackId.requestCount++;
      //this.set('yqCallbackId', callbackId);
      this.fire('iron-signal', {name: 'youneeq-callbackid', data: { content: callbackId }});
      let now = new Date().getTime();
      request.setAttribute('callback-value', "yq_" + callbackId.sessionId + "_" + callbackId.pageId + "_" + now + "_" + callbackId.requestCount);


      request.generateRequest();
    }
  }

  _pageHitChanged(pageHit, oldPageHit) {
    if (typeof pageHit !== 'undefined' && Object.keys(pageHit).length > 0) {
      // GENERATE THE PAGEHIT REQUEST AND SEND IT OFF
      let request = this.querySelector('#pageHitRequest');
      let jsonString = JSON.stringify(pageHit);
      let callbackId = this.get("yqCallbackId");

      
      callbackId.pageId = this._generateId();
      this.set("yqCallbackId", callbackId);

      request.url = 'http://api.youneeq.ca/api/page_hit';
      request.params.json = jsonString;

      if (!callbackId.sessionId){
        callbackId.sessionId = this._generateId();
      }
      callbackId.requestCount++;
      //this.set('yqCallbackId', callbackId);
      this.fire('iron-signal', {name: 'youneeq-callbackid', data: { content: callbackId }});
      let now = new Date().getTime();
      request.setAttribute('callback-value', "yq_" + callbackId.sessionId + "_" + callbackId.pageId + "_" + now + "_" + callbackId.requestCount);

      request.generateRequest();
    }
  }

  _setPageHit() {
    let pageHit = {};
    let timeZone = jzTimezoneDetector.determine_timezone();
    let utcOffset = timeZone.timezone.utc_offset;
    let timeZoneName = timeZone.timezone.olson_tz;
    let bof_profile = this.get('youneeqId');
    let referrer = this.get('previousURL');

    pageHit.href = window.location.href;
    pageHit.referrer = referrer;
    pageHit.tz_off = utcOffset;
    pageHit.tz_name = timeZoneName;
    pageHit.bof_profile = bof_profile;

    // Set Previous URL
    this.set('previousURL', window.location.href);

    return pageHit;
  }
}
Polymer(youneeqTracker);
