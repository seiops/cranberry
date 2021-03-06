class GigyaSocialize {
  // element registration
  beforeRegister() {
    this.is = 'gigya-socialize';
    this.properties = {
      apiKey: {
        type: String
      },
      account: {
        type: Object,
        value: {},
        notify: true
      },
      guestSelected: {
        type: Number,
        value: 0
      },
      profileSelected: {
        type: Number,
        value: 0
      },
      user: {
        type: Object,
        value: function() {
          return {
              isLoggedIn: false
            }
        },
        notify: true
      },
      userSelected: {
        type: Number,
        value: 0,
        observer: '_tabChanged'
      },
      route: {
        type: Object,
        observer: '_onRouteChanged'
      },
      accountVerify: {
        type: Boolean,
        value: false,
        observer: '_verifyAccount'
      },
      scriptAttached: {
        type: Boolean,
        value: false
      }
    };
    this.listeners = { 
      'open-user-modal': '_handleOpen'
    };
  }

  // public methods

  // attached to document
  attached() {
    console.info('\<gigya-socialize\> attached');

    let scriptAttached = this.get('scriptAttached');
    
    if (!scriptAttached) {
      let apiKey = this.get('apiKey');
      this.dispatchEvent(
        new CustomEvent(
          'load-script',
          {
            bubbles: true,
            composed: true,
            detail: {
              url: 'https://cdns.gigya.com/JS/gigya.js?apikey=' + apiKey
            }
          }
        )
      );
      this.set('scriptAttached', true);

      let el = this;
      let dialog = Polymer.dom(this.root).querySelector('#userModal');
      window.addEventListener('resize', (e) => {
        e.preventDefault();
        el.debounce('resize', () => {
          this.async(() => {
          if (dialog.opened) {
            console.log('Browser Window Resized. Refitting Modal.');
            dialog.notifyResize();
          }
          }, 100);
        }, 100);
      });
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

  // check Gigya user
  checkUser() {
    console.info('\<gigya-socialize\> check user');
    let params = {
      callback: this._loadUser,
      context: this
    };

    gigya.socialize.getUserInfo(params);
  }

  // open modal window
  _handleOpen(e) {
    
    if (e.detail) {
      this.set('userSelected', e.detail.goToScreen);
    } else {
      this.set('userSelected', 0);
    }
    this._openModal();
  }

  _openModal() {
    let dialog = Polymer.dom(this.root).querySelector('#userModal');

    dialog.addEventListener('opened-changed', function() {
      if(dialog.opened) {
        Polymer.dom(document.body).classList.add('no-scroll');
        Polymer.dom(document.documentElement).classList.add('no-scroll');
      } else {
        Polymer.dom(document.body).classList.remove('no-scroll');
        Polymer.dom(document.documentElement).classList.remove('no-scroll');
      }
    });

    dialog.toggle();
    dialog.refit();
    dialog.center();
  }

  _tabChanged(userSelected, oldUserSelected) {
    let dialog = Polymer.dom(this.root).querySelector('#userModal');
    dialog.refit();
    dialog.center();
  }

  _equal(a, b) {
    if (a === b) {
      return true;
    } else {
      return false;
    }
  }

  // logout from Gigya API
  _handleLogout() {
    console.info('\<gigya-socialize\> handle logout');

    gigya.accounts.logout();
  }

  // load Gigya account information
  _loadAccount(account) {
    console.info('\<gigya-socialize\> account loaded');

    let el = account.context;
    el.set('account', account);
    
    gigya.socialize.refreshUI();

    let dialog = Polymer.dom(this.root).querySelector('#userModal');

    if (dialog) {
      dialog.resetFit();
    }

    el.fire('iron-signal', { name : 'account-changed', data: { account: account } });
  }

  // load Gigya user information
  _loadUser(user) {
    let el = user.context;

    if (typeof user.UID !== 'undefined') {
      let app = Polymer.dom(document).querySelector('#app');
      console.info('\<gigya-socialize\> user loaded');

      // if (app) {
      //   app.$.infoToast.text = 'Logged in, loading user information.';
      //   app.$.infoToast.show();
      // }

      el.set('user', user.user);

      let params = {
        callback: el._loadAccount,
        context: el,
        include: 'all'
      };

      gigya.accounts.getAccountInfo(params);
    } else {
      console.info('\<gigya-socialize\> anonymous user');
      el.set('user', {});
    }

    if (user.status === 'FAIL') {
      console.error('\<gigya-socialize\> api response error -> ' + user.errorMessage);
    }

  }

  // callback from Gigya logout API
  _logoutUser(data) {
    console.info('\<gigya-socialize\> logged out');

    app.$.infoToast.text = 'Logged out.';
    app.$.infoToast.show();

    let el = data.context;
    el.set('user', {});

    gigya.socialize.refreshUI();

    el.fire('iron-signal', { name : 'account-changed', data: { account: {} } });
  }

  _loginUser(eventObj) {
    if (eventObj.newUser) {
      this.context.checkUser();
    }
  }

  // show profile update form
  _showAccountSettings(e) {
    e.preventDefault();
    this.async(() => {
      this.set('userSelected', 2);
    }, 25);
  }

  // Method to check if queryParams has a value of verifyAccount
  _onRouteChanged(newValue) {
    if (newValue.__queryParams.verifyAccount === '1') {
      // Set the boolean accountVerify to true
      this.set('accountVerify', true);
    }
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
    // this.$.userModal.notifyResize();
  }
}

Polymer(GigyaSocialize);
