class youneeqContent {
  beforeRegister() {
    this.is = 'youneeq-content';
    this.properties = {
      content: {
        type: Object
      },
      domain: {
        type: String
      },
      hasItems: {
        type: Boolean,
        value: false
      },
      hidden: {
        type: Boolean,
        value: true,
        reflectToAttribute: true
      },
      items: {
        type: Object
      },
      response: {
        type: Object,
        observer: '_responseChanged'
      },
      yqCallbackId: {
        type: Object
      }
    };
    this.listeners = {
      'youneeq-callbackid': 'callbackIdRecieved',
      'youneeq-suggestions': 'suggestionsRecieved',
    }
  };
  
  callbackIdRecieved(event) {
    this.async(() => {
      console.info('<\youneeq-content\> CallbackId recieved');
      let hidden = this.get('hidden');

      if (typeof hidden !== 'undefined' && !hidden) {
        let callbackId = event.detail.content;

        this.set('yqCallbackId', callbackId);
      }
    });
  }

  suggestionsRecieved(event) {
    this.async(() => {
      console.info('<\youneeq-content\> Suggestion event recieved');
      let hidden = this.get('hidden');

      if (typeof hidden !== 'undefined' && !hidden) {
        let suggestions = event.detail.content;

        this.set('hasItems', true);
        this.set('items', suggestions);
      }
    });
  }

  _generateId() {
		return Math.floor(10000000 + Math.random() * 89999999).toString();
	}

  _checkImage(image) {
    if (image !== '') {
      if (image.charAt(0) === '/') {
        let domain = this.get('domain');
        return domain + image;
      } else {
        return image;
      }
    } else {
      return '../images/story/unavail.png';
    }
  }

  _computeSectionName(sectionName) {
    if (typeof sectionName === 'undefined' || sectionName === '') {
      return 'news';
    } else {
      return sectionName;
    }
  }

  _trimTitle(title) {
    return String(title).replace(/'/g, "").replace(/"/g, "").replace(/"/g, "").replace(/'/g, ""); 
  }

  _trackClick(event) {
    let item = event.model.item;

    let yq_id = item.id;
    let yq_title = this._trimTitle(item.title);
    let yq_url = item.url;

    let profile = document.querySelector('youneeq-tracker').youneeqId;
    let requestUrl = 'http://ype.youneeq.ca/api/panelaction';
    let currentUrl = window.location.href;
    let callbackId = this.get("yqCallbackId");

    let panel_click_data = {
      domain_name: window.location.hostname,
      user_id: profile,
      recommendation_url: yq_url,
      recommendation_title: yq_title,
      recommendation_content_id: yq_id,
      current_page: currentUrl
    };

    let request = this.$.request;

    request.url = requestUrl;
    request.params.json = JSON.stringify(panel_click_data);
    
    try {
      if (!callbackId.sessionId){
        callbackId.sessionId = this._generateId();
      }
      callbackId.requestCount++;
      this.fire('iron-signal', {name: 'yq-callback-id', data: {content: callbackId}});
      let now = new Date().getTime();
      request.setAttribute('callback-value', "yq_" + callbackId.sessionId + "_" + callbackId.pageId + "_" + now + "_" + callbackId.requestCount);
    }
    catch(exception) {

    }

    request.generateRequest();
    console.info('<\youneeq-content\> click tracked sent');
  }

  _handleResponse() {
    console.info('<\youneeq-content\> click tracked response recieved');
  }

  _responseChanged(response) {
    
  }
  
}
Polymer(youneeqContent);
