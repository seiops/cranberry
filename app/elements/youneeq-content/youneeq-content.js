class youneeqContent {
  beforeRegister() {
    this.is = 'youneeq-content';
    this.properties = {
      user: {
        type: Object
      },
      content: {
        type: Object,
        observer: '_onContentChanged'
      },
      youneeqId: {
        type: String,
        value: ''
      },
      request: Object,
      response: {
          type: Object,
          observer: '_parseResponse'
      },
      items: {
        type: Object
      },
      hasItems: {
        type: Boolean,
        value: false
      },
      domain: {
        type: String
      },
      yqsessionid: {
        type: String,
        value: this._generateId(),
      },
      yqpageid: {
        type: String,
        value: this._generateId(),
      },
      yqrequestcount: {
        type: Number,
        value: 0,
      }
    }
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

  _onContentChanged(newValue) {
    let el = this;

    this.async(function() {
      if (Object.keys(newValue).length !== 0 && newValue.constructor === Object && typeof newValue !== 'undefined') {
        this._checkYq();

        this._yqInit(newValue);
      }
    });
  }

  _generateId() {
    return Math.floor(100000000 + Math.random() * 899999999).toString();
  }

  _checkYq() {
    let el = this;

    setTimeout(function() {
      if (typeof Yq === 'undefined') {
        return;
      } else {
        el._checkYq();
      }
    }, 50);
  }

  _yqInit(content) {
    this.set("pageid", this._generateId());
    let user = this.get('user');
    let el = this;

    let fullObject = {};
    let observe = [];
    let observeObj = {};
    let suggest = [];
    let suggestObj = {};
    let pagehit = {};
    let timeZone = jzTimezoneDetector.determine_timezone();
    let utcOffset = timeZone.timezone.utc_offset;
    let timeZoneName = timeZone.timezone.olson_tz;
    let domain = this.get('domain');

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

    pagehit.href = window.location.href;
    pagehit.referrer = window.location.href;
    pagehit.tz_off = utcOffset;
    pagehit.tz_name = timeZoneName;

    fullObject.domain = this.get('domain');
    // For Localhost Testing uncomment below; comment out above line.
    // fullObject.domain = 'localhost';
    fullObject.observe = observe;
    fullObject.suggest = suggest;
    // For Localhost Testing uncomment this
    // fullObject.alt_href = 'http://sedev.libercus.net/News/2016/08/18/Ogden-s-STEM-school-makes-its-debut-with-enthusiasm.html';
    fullObject.page_hit = pagehit;
    fullObject.bof_profile = this.get('youneeqId');
    fullObject.href = window.location.href;
    fullObject.gigya = user;

    this._setupRequest(JSON.stringify(fullObject));
  }

  _setupRequest(jsonString) {
    let request = this.$.request;
    let sessionId = this.get("sessionid");
    let pageId = this.get("pageid");
    let requestCount = this.get("requestcount");
    requestCount++;
    this.set("requestcount", requestCount);
    let now = new Date().getTime();

    //request.url = 'http://api.youneeq.ca/api/observe';
    request.url = 'http://localhost:62778/api/observe';
    request.params.json = jsonString;
    request.setAttribute('callback-value', sessionId + "_" + pageId + "_" + now + "_" + requestCount);

    request.generateRequest();
  }

  _handleLoad(l) {
      console.info('<\youneeq-content\> load received');
  }

  _handleResponse() {
      console.info('<\youneeq-content\> response received');
  }

  _parseResponse(suggestions) {
    if (suggestions.suggest !== null){
      let nodes = suggestions.suggest.node;

      this.set('items', nodes);
      if (nodes !== null && nodes.length !== 0) {
        this.set('hasItems', true);
      }
    } else {
      console.info('<\youneeq-content\> no suggested content');
    }
  }

  _checkImage(image) {
    if (image !== '' && image.charAt(0) === '/') {
      let domain = this.get('domain');
      return domain + image;
    } else {
      return image;
    }
  }

  _index(index) {
    if (index === 3) {
      return true;
    }
  }

  _computeSectionName(sectionName) {
    if (typeof sectionName === 'undefined' || sectionName === '') {
      return 'news';
    } else {
      return sectionName;
    }
  }
}
Polymer(youneeqContent);
