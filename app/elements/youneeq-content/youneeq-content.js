class youneeqContent {
  beforeRegister() {
    this.is = 'youneeq-content';
    this.properties = {
      content: {
        type: Object
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
      'youneeq-suggestions': 'suggestionsRecieved'
    };
  }

  callbackIdRecieved(event) {
    let callbackId = event.detail.content;

    this.set('yqCallbackId', callbackId);
  }

  suggestionsRecieved(event) {
    let suggestions = event.detail.content;

    this.set('hasItems', true);
    this.set('items', suggestions);
  }

  _generateId() {
		return Math.floor(10000000 + Math.random() * 89999999).toString();
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
    //let requestUrl = 'http://localhost:62778/api/panelaction';
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
