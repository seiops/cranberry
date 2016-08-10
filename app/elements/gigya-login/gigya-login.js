class GigyaLogin {
  beforeRegister() {
    this.is = 'gigya-login';
  }

  attached() {
    app.logger('\<gigya-login\> attached');

    this.async(function() {
      let el = this;
      let form = Polymer.dom(this.root).querySelector('#loginForm');

      form.addEventListener('iron-form-submit', function() {
        app.logger('\<gigya-login\> form submit event');

        el._disableForm();
        el._submit();
      });
    });
  }

  _disableForm() {
    app.logger('\<gigya-login\> disable form');

    this.$.submit.disabled = true;
  }

  _enableForm() {
    app.logger('\<gigya-login\> enable form');

    this.$.submit.disabled = false;
  }

  _handleReset(event) {
    app.logger('\<gigya-login\> reset form');

    let form = Polymer.dom(event).localTarget.parentElement.parentElement;

    form.reset();
  }

  _handleLogin(event) {
    app.logger('\<gigya-login\> handle login');

    let form = Polymer.dom(event).localTarget.parentElement.parentElement;

    form.submit();
  }

  _handleLoginSocial(event) {
    this._disableForm();
    this.$.spinner.active = true;

    let provider = Polymer.dom(event).localTarget.getAttribute('provider');

    let base = Polymer.dom(document).querySelector('cranberry-base');
    let socialize = base.querySelector('gigya-socialize');

    let params = {
        provider: provider,
        callback: this._handleResponse,
        context: this
    };

    gigya.accounts.socialLogin(params);
  }

  _processError(code) {
    app.logger('\<gigya-login\> error');
    if(code.errorCode === 206002) {
      console.log('unverified');
      let params = {
        callback: this._consoleLog,
        context: this,
        UID: code.UID,
        regToken: code.regToken
      };
      console.dir(params);
      gigya.accounts.resendVerificationCode(params);
    }
  }

  _consoleLog(data) {
    console.dir(data);
  }

  _register() {
    let base = Polymer.dom(document).querySelector('cranberry-base');
    let socialize = base.querySelector('gigya-socialize');

    socialize.set('guestSelected', 1);
  }

  _submit() {
    app.logger('\<gigya-login\> submit gigya');

    this.$.spinner.active = true;
    let form = Polymer.dom(this.root).querySelector('#loginForm');
    let request = Polymer.dom(this.root).querySelector('#request');

    let params = {};

    params.apiKey = '3_6UHHWrJ4LmAOWWdgqP0UWqk-2InoMn5NH8Lo1aOfcmFl6zAS4u_-IxvC3mbGAxch';
    params.format = 'jsonp';
    params.loginID = loginForm.loginID.value;
    params.password = loginForm.password.value;

    request.params = params;
    request.url = 'https://accounts.us1.gigya.com/accounts.login';

    request.generateRequest();
  }

  _checkUser() {
    let base = Polymer.dom(document).querySelector('cranberry-base');
    let socialize = base.querySelector('gigya-socialize');

    socialize.checkUser();
  }

  _handleResponse(response) {
    let detail = {};

    if (typeof response.detail !== 'undefined') {
      detail = response.detail;
    } else {
      detail = response;
    }

    if(typeof detail !== 'undefined') {
      if (detail.loginProvider === 'site' && detail.errorCode === 0) {
        this._setUserCookie(detail.sessionInfo.cookieName, detail.sessionInfo.cookieValue, 365);
      }
      if ((detail.loginProvider === 'site' && detail.errorCode === 0) || (detail.loginProvider !== 'site' && detail.errorCode === '0')) {
        let el = this;

        if (typeof detail.context !== 'undefined') {
          el = detail.context;
        }

        el.$.spinner.active = false;
        el._enableForm();
        el._checkUser();
      } else if ((detail.loginProvider === 'site' && detail.errorCode !== 0) || (detail.loginProvider !== 'site' && detail.errorCode !== '0')) {
        this._processError(detail);
      }
    } else {
      console.error('unhandled form error');
    }
  }

  _setUserCookie(cname, cvalue, exdays) {
    let d = new Date();

    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));

    let expires = "expires=" + d.toUTCString();

    document.cookie = cname + "=" + cvalue + "; " + expires + "; path=/";
  }
}

Polymer(GigyaLogin);
