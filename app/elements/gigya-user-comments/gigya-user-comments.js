class GigyaUserComments {
  // element registration
  beforeRegister() {
    this.is = 'gigya-user-comments';
    this.properties = {
      commentCount: Number,
      comments: {
        type: Object,
        value: []
      },
      count: {
        type: Number,
        value: 10
      },
      start: {
        type: Number,
        value: 0
      }
    };
  }

  // public methods

  // attached to document
  attached() {
    console.info('\<gigya-user-comments\> attached');

    this.async(function() {
      this._checkGigya();
    });
  }

  // private methods

  // check if Gigya API is loaded
  _checkGigya() {
    let el = this;

    setTimeout(function() {
      if (typeof gigya !== 'undefined' && typeof gigya.comments !== 'undefined' && typeof gigya.comments.getUserComments === 'function') {
        el._getComments();

        return;
      } else {
        el._checkGigya();
      }
    }, 50);
  }

  // check if user has made any comments
  _checkComments(count) {
    if (count > 0) {
      return true;
    } else {
      return;
    }
  }

  // callback for Gigya API request
  _commentsCallback(response) {
    let el = response.context;
    el.set('comments', response.comments);
    el.set('commentCount', response.commentCount);
  }

  // make request to Gigya Comments API
  _getComments() {
    console.info('\<gigya-user-comments\> get user comments');

    let el = this;

    let count = this.get('count');
    let start = this.get('start');

    gigya.comments.getUserComments({
      callback: el._commentsCallback,
      context: this,
      limit: count,
      start: start
    });
  }

  // redirect to compatible URL for redirect
  _viewContent(ev) {
    let el = Polymer.dom(ev).localTarget;
    let url = el.getAttribute('destination');
    let link = 'http://' + window.location.hostname + url;

    window.location = link;
  }
}
Polymer(GigyaUserComments);
