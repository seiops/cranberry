class cranberryBreakingBar {
  beforeRegister() {
    this.is = 'cranberry-breaking-bar';
    this.properties = {
      response: {
        type: Object,
        observer: '_parseResponse'
      },
      items: {
        type: Object,
        observer: '_itemsChanged'
      },
      tags: {
        type: String,
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
          'desiredContent': 'story'
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
    this.observers = ['_onSizingChanged(mobile, tablet, desktop)']
  }

  attached() {
    let params = this.get('params');

    if (params.length !== 0) {
      this.$.request.url = this.rest;
      this.$.request.params = params;
      this.$.request.generateRequest();
    }
  }

  timer() {
    let self = document.querySelector('cranberry-breaking-bar');
    self._showNext();
  }

  _handleLoad() {
    app.logger('<\cranberry-breaking-bar\> load received');
  }

  _handleResponse() {
    app.logger('<\cranberry-breaking-bar\> response received');
  }

  _parseResponse(response) {
    var result = JSON.parse(response.Result);

    this.set('count', result.length);

    if (result.length > 1) {
      this.set('setTimer', true);
      window.breakingBarTimer = window.setInterval(this.timer, 4000);
    } else {
      this.set('hideSelectors', true);
    }
    this.set('items', result);
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
    let tags = tagsString.split(',');
    let self = this;

    tags.forEach(function(value, index) {
      if (value === 'alert' || value === 'Alert') {
        self.set('type', 'ALERT: ');
      } else if (value === 'breaking' || value === 'Breaking') {
        self.set('type', 'BREAKING NEWS: ');
      }
    });
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
      window.breakingBarTimer = window.setInterval(this.timer, 4000);
    }
  }

  _showPrevious() {
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
    app.logger('<\cranberry-breaking-bar\> hidden!');
    let setTimer = this.get('setTimer');

    if (setTimer) {
      clearInterval(window.breakingBarTimer);
    }

    this.set('hiddenForever', true);
  }

  _onSizingChanged(mobile, tablet, desktop) {
    let count = this.get('count');
    if (count > 1) {
      if (mobile || tablet) {
        this.set('hideSelectors', true);
      } else {
        this.set('hideSelectors', false);
      }
    }
  }
}
Polymer(cranberryBreakingBar);
