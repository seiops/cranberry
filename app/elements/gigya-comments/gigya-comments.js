class gigyaComments {
  beforeRegister() {
    this.is = 'gigya-comments';
    this.properties = {
      commentsId: {
        type: String
      }
    }
  }

  ready() {
    let self = this;
    let checkGigya = function () {
      setTimeout(function () {
        if (typeof gigya !== 'undefined') {
          var params = {
            categoryID: 'Default',
            streamID: '',
            version: 2,
            containerID: self.get('commentsId'),
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
