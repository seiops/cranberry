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
      loggedIn: {
        type: Boolean,
        value: false
      },
      user: {
        type: Object,
        value: {},
        notify: true
      }
    };
  }

  attached() {
    app.logger('\<gigya-socialize\> attached');

    this.async(function() {
      this._addListeners();
      this._checkGigya();
    });
  }

  _addListeners() {
    let request = Polymer.dom(this.root).querySelector('#request');
    let loginForm = Polymer.dom(this.root).querySelector('#loginForm');

    loginForm.addEventListener('iron-form-submit', function(event) {
      let params = {};

      params.apiKey = '3_6UHHWrJ4LmAOWWdgqP0UWqk-2InoMn5NH8Lo1aOfcmFl6zAS4u_-IxvC3mbGAxch';
      params.format = 'jsonp';
      params.loginID = loginForm.loginID.value;
      params.password = loginForm.password.value;

      request.params = params;
      request.url = 'https://accounts.us1.gigya.com/accounts.login';

      request.generateRequest();
    });
  }

  _checkGigya() {
    let el = this;

    setTimeout(function() {
      if (typeof gigya !== 'undefined' && typeof gigya.socialize !== 'undefined' && typeof gigya.socialize.getUserInfo === 'function') {
        el._checkUser();

        return;
      } else {
        el._checkGigya();
      }
    }, 50);
  }

  _checkUser() {
    app.logger('\<gigya-socialize\> check user');

    let params = {
      callback: this._loadUser,
      context: this
    };

    gigya.socialize.getUserInfo(params);
  }

  _handleLogin(event) {
    app.logger('\<gigya-socialize\> handle login');

    let form = Polymer.dom(event).localTarget.parentElement;

    form.submit();
  }

  _handleLoginSocial(event) {
    let provider = Polymer.dom(event).localTarget.getAttribute('provider');

    let params = {
        provider: provider,
        callback: this._loadUser,
        context: this
    };

    gigya.accounts.socialLogin(params);
  }

  _handleLogout() {
    app.logger('\<gigya-socialize\> handle logout');

    let params = {
      callback: this._logoutUser,
      context: this
    };

    gigya.accounts.logout(params);
  }

  _handleReset(event) {
    let form = Polymer.dom(event).localTarget.parentElement;

    form.reset();
  }

  _handleResponse(response) {
    let detail = response.detail;

    if (typeof detail !== undefined && detail.errorCode === 0) {
      this._setUserCookie(detail.sessionInfo.cookieName, detail.sessionInfo.cookieValue, 365);

      this._checkUser();
    } else if (detail.errorCode !== 0 ) {
      this._handleError(detail);
    }
  }

  _loadUser(user) {
    let el = user.context;

    if (typeof user.UID !== 'undefined') {
      app.logger('\<gigya-socialize\> user logged in');
      console.dir(user);
      el.set('loggedIn', true);
      el.set('user', user.user);

      gigya.socialize.refreshUI();
    } else {
      app.logger('\<gigya-socialize\> anonymous user');
      console.dir(user);
    }
  }

  _logoutUser(response) {
    let el = response.context;

    el.set('loggedIn', false);
    el.set('user', {});

    gigya.socialize.refreshUI();
  }

  _setUserCookie(cname, cvalue, exdays) {
    let d = new Date();

    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));

    let expires = "expires=" + d.toUTCString();

    document.cookie = cname + "=" + cvalue + "; " + expires + "; path=/";
  }
}

Polymer(GigyaSocialize);
