class gigyaSharebar {
  beforeRegister() {
    this.is = 'gigya-sharebar';
    this.properties = {
      shareButtonsId: {
        type: String
      }
    }
    this.listeners = {
      'shareButton.tap': 'shareButtonHandler'
    };
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
              //ua.setLinkBack(window.location.href);
              ua.setTitle("HOME");

          var params = {
              userAction: ua,
              shareButtons:
              [
                  { // General Share Button
                      provider:'share',
                      tooltip:'General Share Button',
                      userMessage:'default user message'
                  },
                  { // Google +1 button
                      provider:'google-plusone',
                      tooltip:'Recommend this on Google',
                      userMessage:'default user message'
                  },
                  { // Facebook Like button
                      provider:'facebook-like',
                      tooltip:'Recommend this on Facebook',
                      action:'recommend',
                      font:'arial'
                  },
                  { // Twitter Tweet button
                      provider:'twitter-tweet',
                      tooltip:'Share on Twitter',
                      defaultText: 'Twitter message'

                  },
                  { // Email button
                      provider:'email',
                      tooltip:'Email this'
                  },
                  { // Pinterest button
                      provider: 'pinterest-pinit'
                  }
              ],
              containerID: shareDiv,
              noButtonBorders: true,
              showAlwaysShare: 'unchecked'
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

  shareButtonHandler() {
    let buttonDiv = this.querySelector('paper-material');
    console.info(buttonDiv);
    // Toggle display property on the sharebutton div
    buttonDiv.classList.toggle('ut-hide');

  }
}
Polymer(gigyaSharebar);
