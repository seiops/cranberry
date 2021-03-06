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

                },
                { // Pinterest button
                    provider: 'pinterest'
                },
                { // Email button
                    provider:'email',
                    tooltip:'Email this'
                }
            ],
            noButtonBorders: true,
            showAlwaysShare: 'unchecked',
            layout:'vertical',
            deviceType: 'mobile'
          };
          return params;
        }
      }
    };
    this.observers = ['_updateGigya(title, route, shareButtonsId)'];
  }

  _updateGigya(title, route, shareButtonsId) {
    this.async(() => {
      if (typeof route !== 'undefined') {

        var gigyaPromise = new Promise((resolve, reject) => {
          setTimeout(() => {
            if (typeof gigya !== 'undefined') {
              resolve(true);
            }
          }, 50);
        });

        gigyaPromise.then((value) => {
          console.info("Finished loading Gigya Sharebar.");
          let params = this.get('params');
          let ua = new gigya.socialize.UserAction();

          ua.setLinkBack(window.location.href);
          ua.setTitle(title);

          params.userAction = ua;
          params.containerID = shareButtonsId;

          gigya.socialize.showShareBarUI(params);
        });
      }
    });
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
