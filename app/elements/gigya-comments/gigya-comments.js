class gigyaComments {
  beforeRegister() {
    this.is = 'gigya-comments';
    this.properties = {
      commentsId: {
        type: String
      },
      streamId: {
        type: String,
        value: ''
      },
      content: {
        type: Object
      },
      configId: {
        type: String
      }
    };
    this.observers = ['_updateComments(streamId, content, configId)'];
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

  _updateComments(id, content, configId) {
    if (typeof id !== 'undefined' && id.length > 0) {
      let el = this;
      let time = this._timeId();
      this.set('containerId', time);
      let streamId = this.get('streamId');

      // Context needs to be the gigya socialize element for logout handling
      let params = {
        context: Polymer.dom(document).querySelector('gigya-socialize'),
        categoryID: configId,
        streamID: streamId,
        streamURL: window.location.href,
        version: 2,
        containerID: time,
        cid: '',
        width: '100%',
        streamTitle: content.title,
        useSiteLogin: true,
        onSiteLoginClicked: this._onSiteLoginHandler
      };

      let gigyaDefined = new Promise(
        function(resolve, reject) {
          let isDefined = false;
          while (!isDefined) {
            if (typeof gigya !== 'undefined' && typeof gigya.comments !== 'undefined' && typeof gigya.comments.showCommentsUI === 'function') {
              isDefined = true;
              resolve(true);
            }
          }
        }
      );

      gigyaDefined.then(function(val) {
        if (val) {
          gigya.comments.showCommentsUI(params);
        }
      });
    }
  }

  // check if Gigya API is loaded
  _checkGigya() {
    let el = this;

    setTimeout(function() {
      if (typeof gigya !== 'undefined' && typeof gigya.comments !== 'undefined' && typeof gigya.comments.showCommentsUI === 'function') {
        console.info('RETURNING TRUE');
        return true;
      } else {
        console.info('FALSE!!!!');
        el._checkGigya();
      }
    }, 50);
  }

  _onSiteLoginHandler(event) {
    let app = Polymer.dom(document).querySelector('cranberry-base');

    app.openUserModal();
  }
}

Polymer(gigyaComments);
