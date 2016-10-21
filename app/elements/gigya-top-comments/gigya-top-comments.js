class GigyaTopComments {
  // element registration
  beforeRegister() {
    this.is = 'gigya-top-comments';
    this.properties = {
      count: {
        type: Number,
        value: 3
      },
      age: {
        type: Number,
        value: 5
      },
      items: {
        type: Array,
        observer: '_itemsChanged'
      },
      hideDefaultMessage: {
        type: Boolean,
        value: true
      }
    };
  }
  // public methods

  // attached to document
  attached() {
    app.logger('\<gigya-top-comments\> attached');

    this.async(function() {
      this._checkGigya();
    });
  }

  // private methods

  // check if Gigya API is loaded
  _checkGigya() {
    let el = this;

    setTimeout(function() {
      if (typeof gigya !== 'undefined' && typeof gigya.comments !== 'undefined' && typeof gigya.comments.getTopStreams === 'function') {
        el._getComments();

        return;
      } else {
        el._checkGigya();
      }
    }, 50);
  }

  _itemsChanged(items) {
    if (items.length === 0) {
      this.set('hideDefaultMessage', false);
    }
    this.set('count', items.length);
  }

  // Gigya API callback
  _commentsCallback(response) {
    app.logger('\<gigya-top-comments\> response');

    if (response.status === 'FAIL') {
      console.error('\<gigya-top-comments\> api response error -> ' + response.errorMessage);
    }

    this.originalParams.context.set('items', response.streams);
  }

  // request top comments from Gigya API
  _getComments() {
    let el = this;

    let age = this.get('age');
    let count = this.get('count');

    gigya.comments.getTopStreams({
      callback: el._commentsCallback,
      context: this,
      limit: count,
      maxStreamAge: age
     });
  }

  _isLast(index) {
    let count = this.get('count');

    if (index === count - 1) {
      return true;
    }
  }
}
Polymer(GigyaTopComments);
