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
    app.logger('\<gigya-socialize\> attached');

    this.async(function() {
      this._checkGigya();

      let el = this;

      gigya.accounts.addEventHandlers({
        context: this,
        onLogout: el._logoutUser
       });
    });
  }

  // check Gigya user
  checkUser() {
    app.logger('\<gigya-socialize\> check user');
    let params = {
      callback: this._loadUser,
      context: this
    };

    gigya.socialize.getUserInfo(params);
  }

  // open modal window
  openModal() {
    this.$.userModal.toggle();
  }

  // private methods

  // check if Gigya API is loaded
  _checkGigya() {
    let el = this;

    setTimeout(function() {
      if (typeof gigya !== 'undefined' && typeof gigya.socialize !== 'undefined' && typeof gigya.socialize.getUserInfo === 'function') {
        el.checkUser();

        return;
      } else {
        el._checkGigya();
      }
    }, 50);
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
    app.logger('\<gigya-socialize\> handle logout');

    gigya.accounts.logout();
  }

  // load Gigya account information
  _loadAccount(account) {
    app.logger('\<gigya-socialize\> account loaded');

    console.dir(account);

    let el = account.context;
    el.set('account', account);

    gigya.socialize.refreshUI();
  }

  // load Gigya user information
  _loadUser(user) {
    let el = user.context;

    if (typeof user.UID !== 'undefined') {
      app.logger('\<gigya-socialize\> user loaded');

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
      app.logger('\<gigya-socialize\> anonymous user');
    }

    if (user.status === 'FAIL') {
      console.error('\<gigya-socialize\> api response error -> ' + user.errorMessage);
    }

  }

  // callback from Gigya logout API
  _logoutUser(data) {
    app.logger('\<gigya-socialize\> logged out');

    app.$.infoToast.text = 'Logged out.';
    app.$.infoToast.show();

    let el = data.context;
    el.set('user', {});

    gigya.socialize.refreshUI();
  }

  // show profile update form
  _showAccountSettings() {
    this.set('userSelected', 3);
  }

  // Notify resize event for Safari fix
  resize() {
    this.$.userModal.notifyResize();
  }
}

Polymer(GigyaSocialize);
