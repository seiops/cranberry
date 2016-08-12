class GigyaLogin {
  beforeRegister() {
    this.is = 'gigya-login';
    this.properties = {
      notices: {
        type: Object,
        value: []
      },
      verify: {
        type: Object,
        value: {}
      }
    };
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

  _checkUser() {
    let base = Polymer.dom(document).querySelector('cranberry-base');
    let socialize = base.querySelector('gigya-socialize');

    socialize.checkUser();
  }

  _disableForm() {
    app.logger('\<gigya-login\> disable form');

    this.$.submit.disabled = true;
  }

  _enableForm() {
    app.logger('\<gigya-login\> enable form');

    this.$.submit.disabled = false;
  }

  _handleLogin(event) {
    app.logger('\<gigya-login\> handle login');

    let form = Polymer.dom(this.root).querySelector('#loginForm');

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

  _handleRegister() {
    let base = Polymer.dom(document).querySelector('cranberry-base');
    let socialize = base.querySelector('gigya-socialize');

    socialize.set('guestSelected', 1);
  }

  _handleReset(event) {
    app.logger('\<gigya-login\> reset form');

    this.set('notices', []);

    let form = Polymer.dom(this.root).querySelector('#loginForm');

    form.reset();
  }

  _handleResponse(response) {
    let detail = {};

    if (typeof response.detail !== 'undefined') {
      detail = response.detail;
    } else {
      detail = response;
    }

    let el = this;

    if (typeof detail.context !== 'undefined') {
      el = detail.context;
    }

    if (typeof detail !== 'undefined') {
      if (detail.loginProvider === 'site' && detail.errorCode === 0) {
        this._setUserCookie(detail.sessionInfo.cookieName, detail.sessionInfo.cookieValue, 365);
      }
      if ((detail.loginProvider === 'site' && detail.errorCode === 0) || (detail.loginProvider !== 'site' && detail.errorCode === '0')) {
        el._checkUser();
        el.$.spinner.active = false;
        el._handleReset();
        el._enableForm();
      } else if ((detail.loginProvider === 'site' && detail.errorCode !== 0) || (detail.loginProvider !== 'site' && detail.errorCode !== '0')) {
        let form = el.querySelector('#loginForm');
        form.password.value = '';
        this._processError(detail);
      }
    } else {
      console.error('Unhandled form error');
    }
  }

  _processError(code) {
    app.logger('\<gigya-login\> error');

    let notice = {};

    let errorCode = code.errorCode;

    switch(errorCode) {
      case 206001:
        notice.type = 'error';
        notice.message = 'Account pending finalized registration.'
        break;
      case 206002:
        notice.type = 'warning';
        notice.message = 'Your account requires e-mail verification.';
        notice.verify = true;
        notice.code = code.errorCode;
        let verify = {
          UID: code.UID,
          regToken: code.regToken
        };
        this.set('verify', verify);
        break;
      case 401020:
        notice.type = 'error';
        notice.message = 'Too many failed CAPTCHA attempts.';
        break;
      case 401021:
        notice.type = 'error';
        notice.message = 'Incorrect CAPTCHA code.';
        break;
      case 401030:
        notice.type = 'error';
        notice.message = 'You are attempting to use an old password to login.';
        break;
      case 401041:
        notice.type = 'error';
        notice.message = 'This account has been disabled.';
        break;
      case 403042:
        notice.type = 'error';
        notice.message = 'Invalid username or password.';
        break;
      case 403043:
        notice.type = 'error';
        notice.message = 'Login identifier exists.';
        break;
      case 403044:
        notice.type = 'error';
        notice.message = 'User under the age of 13.';
        break;
      case 403100:
        notice.type = 'warning';
        notice.message = 'Password change required.';
        break;
      case 403120:
        notice.type = 'error';
        notice.message = 'Account temporarily locked out.';
        break;
      default:
        notice.type = 'error';
        notice.message = 'Unknown error.';
        console.dir(code);
      break;
    }

    this.push('notices', notice);

    this.$.spinner.active = false;

    this._enableForm();
  }

  _resendVerification() {
    this.set('notices', []);

    let verify = this.get('verify');

    let params = {
      callback: this._verificationSent,
      context: this,
      UID: verify.UID,
      regToken: verify.regToken
    };

    let optionalEmail = this.$$('#verifyEmail').value;

    if (optionalEmail.length > 0) {
      params.email = optionalEmail;
    }

    gigya.accounts.resendVerificationCode(params);
  }

  _setUserCookie(cname, cvalue, exdays) {
    let d = new Date();

    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));

    let expires = "expires=" + d.toUTCString();

    document.cookie = cname + "=" + cvalue + "; " + expires + "; path=/";
  }

  _submit() {
    app.logger('\<gigya-login\> submit gigya');

    this.set('notices', []);
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

  _verificationSent(data) {
    let notice = {};

    notice.type = 'success';
    notice.message = 'Verification e-mail sent';
    notice.code = 0;

    data.context.push('notices', notice);
  }
}

Polymer(GigyaLogin);
