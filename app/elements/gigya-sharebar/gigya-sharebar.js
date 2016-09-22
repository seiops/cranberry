class gigyaSharebar {
  beforeRegister() {
    this.is = 'gigya-sharebar';
    this.properties = {
      shareButtonsId: {
        type: String
      },
      title: {
        type: String,
        value: ''
      },
      route: {
        type: Object,
        value: {}
      },
      open: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      params: {
        type: Object,
        value: function() {
          let params = {
            shortURLs: 'never',
            shareButtons:
            [
                { // Google Plus button
                    provider:'googleplus',
                    tooltip:'Share this on Google +',
                    userMessage:'default user message'
                },
                { // Facebook Like button
                    provider:'facebook',
                    tooltip:'Share this on Facebook',
                    action:'recommend',
                    font:'arial'
                },
                { // Twitter Share button
                    provider:'twitter',
                    tooltip:'Share on Twitter',
                    defaultText: 'Twitter message'

                },,
                { // Pinterest button
                    provider: 'pinterest'
                },
                { // Email button
                    provider:'email',
                    tooltip:'Email this'
                },
                { // General Share Button
                    provider:'share',
                    tooltip:'General Share Button',
                    userMessage:'default user message'
                }
            ],
            noButtonBorders: true,
            showAlwaysShare: 'unchecked',
            layout:'vertical'
          };
          return params;
        }
      }
    };
    this.observers = ['_updateGigya(title, route)'];
  }

  _updateGigya(title, route) {
    let params = this.get('params');
    let shareDiv = this.get('shareButtonsId');

    var checkGigya = function () {
      setTimeout(function () {
        if (typeof gigya !== 'undefined') {
          // Gigya callback goes here.
          // Bind to login and logout evenets.
          app.logger("Finished loading Gigya Sharebar.");

          var ua = new gigya.socialize.UserAction();
              ua.setLinkBack('http://srdevcore.libercus.net' + route.prefix + route.path);
              ua.setTitle(title);

          params.userAction = ua;
          params.containerID = shareDiv;

          gigya.socialize.showShareBarUI(params);

          return;

        } else {
          checkGigya();
        }
      }, 1000);
    };
    checkGigya();
  }

  _shareButtonHandler() {
    let open = this.get('open');
    let buttonDiv = this.querySelector('paper-material');
    // Toggle display property on the sharebutton div
    buttonDiv.classList.toggle('ut-hide');
    this.set('open', !open);
  }

  close() {
    let open = this.get('open');
    if (open) {
      this._shareButtonHandler();
    }
  }

}
Polymer(gigyaSharebar);
