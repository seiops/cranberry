class GigyaSocialize {
  beforeRegister() {
    this.is = 'gigya-socialize';
    this.properties = {
      formError: {
        type: String,
        observer: '_formError'
      },
      items: {
        type: Object
      },
      user: {
        type: Object,
        value: {},
        notify: true
      },
      account: {
        type: Object,
        value: {},
        notify: true
      },
      userSelected: {
        type: Number,
        value: 0
      },
      guestSelected: {
        type: Number,
        value: 0
      }
    };
  }

  attached() {
    app.logger('\<gigya-socialize\> attached');

    this.async(function() {
      this._checkGigya();
    });
  }

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

  checkUser() {
    app.logger('\<gigya-socialize\> check user');

    let params = {
      callback: this._loadUser,
      context: this
    };

    gigya.socialize.getUserInfo(params);
  }

  _userProfile(selected) {
      if (selected === 0) {
          return true;
      } else {
          return false;
      }
  }

  _userMembership(selected) {
      if (selected === 1) {
          return true;
      } else {
          return false;
      }
  }

  _userNewsletters(selected) {
      if (selected === 2) {
          return true;
      } else {
          return false;
      }
  }

  _isFeatured(selected) {
      if (selected === 2) {
          return true;
      } else {
          return false;
      }
  }

  _showAccountSettings() {
    this.set('userSelected', 3);
  }

  _handleLogout() {
    app.logger('\<gigya-socialize\> handle logout');

    let params = {
      callback: this._logoutUser,
      context: this
    };

    gigya.accounts.logout(params);
  }

  _loadAccount(account) {
    app.logger('\<gigya-socialize\> account loaded');
    let el = account.context;
    console.dir(account);
    el.set('account', account);
    gigya.socialize.refreshUI();
  }

  openModal() {
    this.$.userModal.open();
  }

  _loadUser(user) {
    let el = user.context;

    if (typeof user.UID !== 'undefined') {
      app.logger('\<gigya-socialize\> user loaded');
      console.dir(user);

      el.set('user', user.user);

      let params = {
        callback: el._loadAccount,
        context: el,
        include: 'all'
      };

      gigya.accounts.getAccountInfo(params);
    } else {
      app.logger('\<gigya-socialize\> anonymous user');
      console.dir(user);
    }
  }

  _equal(a, b) {
      if (a === b) {
          return true;
      } else {
          return false;
      }
  }

  _logoutUser(response) {
    app.logger('\<gigya-socialize\> logged out');
    console.dir(response);

    let el = response.context;

    el.set('user', {});

    gigya.socialize.refreshUI();
  }
}

Polymer(GigyaSocialize);
