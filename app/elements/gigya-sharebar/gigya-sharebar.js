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
        type: Object
      },
      params: {
        type: Object,
        value: function() {
          let params = {
            userAction: ua,
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
            containerID: shareDiv,
            noButtonBorders: true,
            showAlwaysShare: 'unchecked',
            layout:'vertical'
          };
          return params;
        }
      }
    };
    this.observers = ['_updateParams(title, path)'];
  }

  _updateGigya(title, route) {
    let params = this.get('params');
    let shareDiv = this.get('shareButtonsId');
    console.info(route);
    
    var checkGigya = function () {
      setTimeout(function () {
        if (typeof gigya !== 'undefined') {
          // Gigya callback goes here.
          // Bind to login and logout evenets.
          app.logger("Finished loading Gigya Sharebar.");

          var ua = new gigya.socialize.UserAction();
              ua.setLinkBack('http://srdevcore.libercus.net' + window.location.pathname);
              ua.setTitle(title);

          gigya.socialize.showShareBarUI(params);

          return;

        } else {
          checkGigya();
        }
      }, 1000);
    };
    checkGigya();
  }

  attached() {
    let shareDiv = this.shareButtonsId;

    var checkGigya = function () {
      setTimeout(function () {
        if (typeof gigya !== 'undefined') {
          // Gigya callback goes here.
          // Bind to login and logout evenets.
          app.logger("Finished loading Gigya Sharebar.");

          var ua = new gigya.socialize.UserAction();
            console.info('http://srdevcore.libercus.net' + window.location.pathname);
              ua.setLinkBack('http://srdevcore.libercus.net' + window.location.pathname);
              ua.setTitle("HOME");

          var params = {
              userAction: ua,
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
              containerID: shareDiv,
              noButtonBorders: true,
              showAlwaysShare: 'unchecked',
              layout:'vertical'
          };

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
    let buttonDiv = this.querySelector('paper-material');
    console.info(buttonDiv);
    // Toggle display property on the sharebutton div
    buttonDiv.classList.toggle('ut-hide');

  }
}
Polymer(gigyaSharebar);
