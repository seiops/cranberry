class gigyaComments {
  beforeRegister() {
    this.is = 'gigya-comments';
    this.properties = {
      commentsId: {
        type: String
      },
      streamId: {
        type: String,
        value: '',
        observer: '_updateComments'
      }
    };
  }

  _timeId() {
    if (!Date.now) {
      Date.now = function() {
        return new Date().getTime();
      }
    }

    let timeStamp = Math.floor(Date.now() / 1000);

    return timeStamp;
  }

  _updateComments(id) {
    if (typeof id !== 'undefined' && id.length > 0) {
      let time = this._timeId();

      this.set('containerId', time);

      let streamId = this.get('streamId');

      let checkGigya = function() {
        setTimeout(function() {
          if (typeof gigya !== 'undefined') {
            var params = {
              categoryID: '3946962',
              streamID: streamId,
              streamURL: window.location.href,
              version: 2,
              containerID: time,
              cid: '',
              width: '100%'
            };
            gigya.comments.showCommentsUI(params);
          } else {
            checkGigya();
          }
        }, 1000);
      }

      checkGigya();
    }
  }
}
Polymer(gigyaComments);
