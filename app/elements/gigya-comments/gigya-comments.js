class gigyaComments {
  beforeRegister() {
    this.is = 'gigya-comments';
  }

  ready() {
    let checkGigya = function () {
      setTimeout(function () {
        console.info(gigya);
        if (typeof gigya !== 'undefined') {
          var params = {
            categoryID: 'Default',
            streamID: '',
            version: 2,
            containerID: 'commentsDiv',
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
