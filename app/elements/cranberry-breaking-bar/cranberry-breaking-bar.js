class cranberryBreakingBar {
  beforeRegister() {
    this.is = 'cranberry-breaking-bar';
    this.properties = {
      response: {
        type: Object,
        observer: '_parseResponse'
      },
      items: {
        type: Object
      },
      tags: {
        type: String,
        value: '',
        observer: '_onTagsChanged'
      },
      type: {
        type: String
      },
      rest: {
        type: String
      },
      params: {
        type: Object,
        value: {
          'request': 'content-list',
          'desiredTags': 'Alert|Breaking',
          'desiredContent': 'story',
          'breakingbar': 'true'
        }
      },
      index: {
        type: Number,
        value: 0
      },
      requestIndex: {
        type: Number,
        value: 0
      },
      count: {
        type: Number,
        value: 0
      },
      setTimer: {
        type: Boolean,
        value: false
      },
      mobile: {
        type: Boolean,
        reflectToAttribute: true
      },
      tablet: {
        type: Boolean,
        reflectToAttribute: true
      },
      desktop: {
        type: Boolean,
        reflectToAttribute: true
      },
      hideSelectors: {
        type: Boolean,
        value: false
      },
      hiddenForever: {
        type: Boolean,
        value: false
      }
    };
    // this.observers = ['_onSizingChanged(mobile, tablet, desktop)']
  }

  attached() {
    let params = this.get('params');

    if (params.length !== 0) {
      let request = this.$.request;
      request.url = this.rest;
      request.setAttribute('callback-value', 'breakingBar');
      request.params = params;
      request.generateRequest();
    }
  }

  timer() {
    let app = Polymer.dom(document).querySelector('cranberry-base');
    let self = app.querySelector('cranberry-breaking-bar');

    self._showNext();
  }

  _handleLoad() {
    console.info('<\cranberry-breaking-bar\> load received');
  }

  _handleResponse() {
    console.info('<\cranberry-breaking-bar\> response received');
  }

  _parseResponse(response) {
    var result = JSON.parse(response.Result);

    let content = result.content;
    this.set('count', content.length);

    if (content.length > 1) {
      this.set('setTimer', true);
      window.breakingBarTimer = window.setInterval(this.timer, 7000);
    } else {
      this.set('hideSelectors', true);
    }

    this.set('items', content);
  }

  _computeShow(item) {
    let index = this.items.indexOf(item);
    let requestIndex = this.get('requestIndex');

    if (index === requestIndex) {
      this.set('tags', item.tags);
      return true;
    } else {
      return false;
    }
  }

  _computeUrl(item) {
    let contentType = item.contentType;

    if (contentType === 'Gallery') {
      return '/photo-gallery/' + item.itemId;
    } else if (contentType === 'Story') {
      return '/story/' + item.itemId;
    }
  }

  _onTagsChanged(tagsString) {
    console.log(`Tags Changed ${tagsString}`);
    if (typeof tagString !== 'undefined' && tagString !== '') {
      let tags = tagsString.split(',');

      tags.forEach((value, index) => {
        if (value === 'alert' || value === 'Alert') {
          this.set('type', 'ALERT: ');
        } else if (value === 'breaking' || value === 'Breaking') {
          this.set('type', 'BREAKING: ');
        }
      });
    }
  }

  _showNext() {
    let setTimer = this.get('setTimer');

    if (setTimer) {
      clearInterval(window.breakingBarTimer);
    }

    let move = 1;
    let requestIndex = this.get('requestIndex');
    let count = this.get('count');

    let newNumber = requestIndex + move;

    if (newNumber > count - 1) {
      newNumber = 0;
    }

    this.set('requestIndex', newNumber);
    // this.playAnimation('exit');

    let template = this.$.repeat;
    template.render();
    if (setTimer) {
      window.breakingBarTimer = window.setInterval(this.timer, 7000);
    }
  }

  _showPrevious() {
    let setTimer = this.get('setTimer');

    if (setTimer) {
      clearInterval(window.breakingBarTimer);
    }
    let move = -1;
    let requestIndex = this.get('requestIndex');
    let count = this.get('count');

    let newNumber = requestIndex + move;

    if (newNumber < 0) {
      newNumber = count - 1;
    }

    this.set('requestIndex', newNumber);
    // this.playAnimation('exit');

    let template = this.$.repeat;
    template.render();
    if (setTimer) {
      window.breakingBarTimer = window.setInterval(this.timer, 4000);
    }
  }

  _closeBar() {
    console.info('<\cranberry-breaking-bar\> hidden!');
    let setTimer = this.get('setTimer');

    if (setTimer) {
      clearInterval(window.breakingBarTimer);
    }

    this.set('hiddenForever', true);
  }

  _truncateText(text) {
    if(typeof text !== 'undefined'){
      let trunc = text;
      if (trunc.length > 25) {
          trunc = trunc.substring(0, 25);
          trunc = trunc.replace(/\w+$/, '');
          trunc += '...';
      }
      return trunc;
    }
  }

  _showNextPrev() {
    let items = this.get('items');

    if (typeof items !== 'undefined' && items.length > 1) {
      return true;
    } else {
      return false;
    }
  }
}
Polymer(cranberryBreakingBar);
