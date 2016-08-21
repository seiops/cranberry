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

  _commentsCallback(response) {
    console.dir(response);
  }
}
Polymer(GigyaTopComments);
