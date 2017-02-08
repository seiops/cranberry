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
    this.listeners = {
      'scroll-to-comments': 'scrollToComments'
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

  _destroyOldComments() {
    this.$.commentContainer.innerHTML = '';
  }

  _updateComments(id, content, configId) {
    if (typeof id !== 'undefined' && id.length > 0) {
      this._destroyOldComments();
      let time = this._timeId();
      this.set('containerId', time);

      let div = document.createElement('div');
      div.setAttribute('id', time);

      this.$.commentContainer.appendChild(div);

      this.async(() => {
        // Context needs to be the gigya socialize element for logout handling
        let params = {
          context: Polymer.dom(document).querySelector('gigya-socialize'),
          categoryID: configId,
          streamID: id,
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
            function timeoutFunction() {
              setTimeout(function() {
                if (typeof gigya !== 'undefined' && typeof gigya.comments !== 'undefined' && typeof gigya.comments.showCommentsUI === 'function') {
                  resolve(true);
                  return;
                } else {
                  timeoutFunction();
                }
              }, 50);
            }
            timeoutFunction();
          }
        );

        gigyaDefined.then(function(val) {
          if (val) {
            gigya.comments.showCommentsUI(params);
          }
        });
      });
    }
  }

  _onSiteLoginHandler(event) {
    let app = Polymer.dom(document).querySelector('cranberry-base');

    app.openUserModal();
  }

  scrollToComments() {
    let scrollPosition = Polymer.dom(this).node.offsetTop;

    this.fire('iron-signal', { name: 'app-scroll', data: { scrollPosition: scrollPosition, scrollSpeed: 1500, scrollAnimation: 'easeInOutQuint' } });
  }
}

Polymer(gigyaComments);
