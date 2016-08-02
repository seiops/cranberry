class gigyaComments {
  beforeRegister() {
    this.is = 'gigya-comments';
    this.properties = {
      commentsId: {
        type: String
      },
      commentsUniqueId: {
        type: String
      }
    };
    this.observers = ['_checkParams(commentsId, commentsUniqueId)'];
  }

  _checkParams(id, uniqueId) {
    let self = this;
    let checkGigya = function () {
      setTimeout(function () {
        if (typeof gigya !== 'undefined') {
          var params = {
            categoryID: 'Default',
            streamID: uniqueId,
            streamURL: window.location.href,
            version: 2,
            containerID: id,
            cid: '',
            enabledShareProviders: 'facebook,twitter,yahoo,linkedin',
            width: '100%'
          };
          gigya.comments.showCommentsUI(params);
        } else {
          checkGigya();
        }
      },1000);
    }
    checkGigya();
  }
}
Polymer(gigyaComments);
