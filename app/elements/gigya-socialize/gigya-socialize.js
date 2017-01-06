class GigyaSocialize {
  // element registration
  beforeRegister() {
    this.is = 'gigya-socialize';
    this.properties = {
      account: {
        type: Object,
        value: {},
        notify: true
      },
      accountVerify: {
        type: Boolean,
        value: false,
        observer: '_verifyAccount'
      },
      apiKey: {
        type: String
      },
      guestSelected: {
        type: Number,
        value: 0
      },
      profileSelected: {
        type: Number,
        value: 0
      },
      route: {
        type: Object,
        observer: '_onRouteChanged'
      },
      scriptAttached: {
        type: Boolean,
        value: false
      },
      sessionId: {
        type: String
      },
      sessionLabel: {
        type: String
      },
      sessionSyncronex: {
        type: String
      },
      user: {
        type: Object,
        value: {},
        notify: true
      },
      userSelected: {
        type: Number,
        value: 0
      }
    };
  }

  // public methods

  // attached to document
  attached() {
    console.info('\<gigya-socialize\> attached');

    let scriptAttached = this.get('scriptAttached');

    if (!scriptAttached) {
      let apiKey = this.get('apiKey');
      let loader = document.querySelector('cranberry-script-loader');

      loader.loadScript('https://cdns.gigya.com/JS/gigya.js?apikey=' + apiKey);
      this.set('scriptAttached', true);
    }

    let el = this;

    let gigyaDefined = new Promise(
      function(resolve, reject) {
        function timeoutFunction() {
          setTimeout(function() {
            if (typeof gigya !== 'undefined' && typeof gigya.socialize !== 'undefined' && typeof gigya.socialize.getUserInfo === 'function') {
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
      el.checkUser();

      gigya.accounts.addEventHandlers({
        context: el,
        onLogin: el._loginUser,
        onLogout: el._logoutUser
      });
    });
  }

  // build user object to authenticate with Libercus
  _buildUser(user) {
    this.async(function() {
      let user = this.get('user');

      // Check for a valid profile object.
      if (typeof user !== 'undefined' && typeof user.statusCode !== 'undefined' && user.statusCode === 200) {
          console.info('\<gigya-socialize\> building user data object');

          // Initialize empty data object.
          let data = {};

          // Check profile.username value, use nickname if no username.
          if (typeof user.nickname !== 'undefined') {
              data.nickName = user.nickname;
          } else if (typeof profile.nickname !== 'undefined') {
              data.nickName = user.email;
          }

          // Check for profile.firstName, use e-mail if no firstName.
          if (typeof user.firstName !== 'undefined') {
              data.firstName = user.firstName;
          } else {
              data.firstName = user.email;
          }

          // Check for profile.lastName, use e-mail if no firstName.
          if (typeof user.lastName !== 'undefined') {
              data.lastName = user.lastName;
          } else {
              data.lastName = user.email;
          }

          // Set Gigya UID and email for Libercus data object.
          data.UID = user.UID;
          data.email = user.email;

          // Get label for dynamic key creation.
          let label = this.get('sessionLabel');

          // Set session label key for Libercus.
          data[label] = this.get('sessionId');

          // Login to Libercus user authentication system.
          this._loginLibercus(data);
        } else {
          console.error('\<gigya-socialize\> no user found or incomplete data');
        }
    });
  }


  // check Gigya user
  checkUser() {
    console.info('\<gigya-socialize\> check user');

    this.async(function() {
      let sessionCheck = this.get('sessionId');

      if (typeof sessionCheck === 'undefined' || sessionCheck.length === 0) {
        this._loginSession();
      }

      let params = {
        callback: this._loadUser,
        context: this
      };

      gigya.socialize.getUserInfo(params);
    });
  }

  // open modal window
  openModal() {
    this.$.userModal.toggle();
  }

  // private methods

  // check if Gigya API is loaded
  // _checkGigya() {
  //   let el = this;

  //   setTimeout(function() {
  //     if (typeof gigya !== 'undefined' && typeof gigya.socialize !== 'undefined' && typeof gigya.socialize.getUserInfo === 'function') {
  //       el.checkUser();

  //       return true;
  //     } else {
  //       el._checkGigya();
  //     }
  //   }, 50);
  // }

  // Simple method checking equal value
  _equal(a, b) {
    if (a === b) {
      return true;
    } else {
      return false;
    }
  }

  // echo response data (logging out) to console
  _handleLibercusLogout() {
    console.info('\<gigya-socialize\> user session data cleared');
  }

  // echo response data (user created or blank) to console and check session
  _handleLibercusResponse(response) {
    console.info('\<gigya-socialize\> Libercus response received');
    // console.dir(response);

    // Set session information.
    this._loginSession();
  }

  // logout from Gigya API
  _handleLogout() {
    console.info('\<gigya-socialize\> handle logout');

    gigya.accounts.logout();
  }

  // set session information from Libercus
  _handleSessionResponse(response) {
    console.info('\<gigya-socialize\> session response received');

    let result = JSON.parse(response.detail.Result);

    this.set('sessionLabel', result.sessionLabel);
    this.set('sessionId', result.sessionId);

    if (typeof result.syncronexAccount !== 'undefined') {
      this.set('sessionSyncronex', result.syncronexAccount);
    }

    this.async(function(){
      this._sessionChanged();
    });
  }

  // load Gigya account information
  _loadAccount(account) {
    console.info('\<gigya-socialize\> Gigya account loaded');

    let el = account.context;
    el.set('account', account);

    el._buildUser();

    gigya.socialize.refreshUI();
  }

  // load Gigya user information
  _loadUser(user) {
    let el = user.context;

    if (typeof user.UID !== 'undefined') {
      console.info('\<gigya-socialize\> user loaded');

      app.$.infoToast.text = 'Logged in, loading user information.';
      app.$.infoToast.show();

      el.set('user', user.user);

      let params = {
        callback: el._loadAccount,
        context: el,
        include: 'all'
      };

      gigya.accounts.getAccountInfo(params);
    } else {
      console.info('\<gigya-socialize\> anonymous user');
    }

    if (user.status === 'FAIL') {
      console.error('\<gigya-socialize\> api response error -> ' + user.errorMessage);
    }
  }

  // logout user from Libercus sessions
  _logoutLibercus() {
    this.$.libercusLogoutRequest.url = 'http://srdevcore.libercus.net/ajaxquery/logout';
    this.$.libercusLogoutRequest.params = '';
    this.$.libercusLogoutRequest.generateRequest();
  }

  // callback from Gigya logout API
  _logoutUser(data) {
    console.info('\<gigya-socialize\> logged out of Gigya, clearing session data');

    app.$.infoToast.text = 'Logged out.';
    app.$.infoToast.show();

    let el = data.context;

    el.set('user', {});
    el._logoutLibercus();
    gigya.socialize.refreshUI();
  }

  _loginUser(eventObj) {
    if (eventObj.newUser) {
      this.context.checkUser();
    }
  }

  // login to Libercus platform, creates synced account if none exists
  _loginLibercus(params) {
    console.info('\<gigya-socialize\> logging in to Libercus');

    this.$.libercusRequest.url = 'http://srdevcore.libercus.net/.auth';
    this.$.libercusRequest.params = params;
    this.$.libercusRequest.generateRequest();
  }

  // retrieve user session information from Libercus users
  _loginSession() {
    console.info('\<gigya-socialize\> checking session data');

    this.$.sessionRequest.url = 'http://srdevcore.libercus.net/ajaxquery/userinfo';
    this.$.sessionRequest.params = '';
    this.$.sessionRequest.generateRequest();
  }

  // show profile update form
  _showAccountSettings() {
    this.set('userSelected', 3);
  }

  // Method to check if queryParams has a value of verifyAccount
  _onRouteChanged(newValue) {
    if (newValue.__queryParams.verifyAccount === '1') {
      // Set the boolean accountVerify to true
      this.set('accountVerify', true);
    }
  }

  // Observer method for when session value changes
  _onUserChanged(user) {
    console.info('\<gigya-socialize\> session changed');

    this.async(function() {
      this._buildUser(user);
    });
  }

  // Method to reset query params to empty object
  _resetQueryParams() {
    this.async(function() {
      // Reset the queryParams value to a blank object to tidy up the URL.
      let base = Polymer.dom(document).querySelector('cranberry-base');
      let location = base.querySelector('app-location');

      location.set('queryParams', {});
    });
  }

  // Method to update user session properties
  _sessionChanged(){
    console.info('\<gigya-socialize\> session changed, updating information');

    this.async(function() {
      let user = this.get('user');

      if (typeof user.UID !== 'undefined') {
        let sessionId = this.get('sessionId');
        let sessionLabel = this.get('sessionLabel');
        let sessionSyncronex = this.get('sessionSyncronex');

        this.set('user.sessionid', sessionId);
        this.set('user.sessionlabel', sessionLabel);

        if (typeof sessionSyncronex !== 'undefined') {
          this.set('user.sessionaccount', sessionSyncronex);
        }

        // this._showSession();
      }
    });
  }

  // Print session values to console
  _showSession(){
    this.async(function(){
      let session = this.get('user.sessionid');
      let label = this.get('user.sessionlabel');
      let account = this.get('user.sessionaccount');

      if (typeof account === 'undefined') {
        account = 'guest';
      }

      console.info(label);
      console.info(session);
      console.info(account);
    });
  }

  // Method to check verify param
  _verifyAccount(verify) {
    if (typeof verify !== 'undefined' && verify) {
      // Check the User, open the Modal, and clear query params
      this.checkUser();
      this.openModal();
      this._resetQueryParams();
    }
  }

  // Notify resize event for Safari fix
  resize() {
    this.$.userModal.notifyResize();
  }
}

Polymer(GigyaSocialize);
