class GigyaLogin {
  // before element registration
  beforeRegister() {
    this.is = 'gigya-login';
    this.properties = {
      apiKey: {
        type: String
      },
      notices: {
        type: Object,
        value: []
      },
      regToken: {
        type: String
      },
      tmpUser: {
        type: Object,
        value: {}
      },
      spinnerActive: {
        type: Boolean,
        value: false
      },
      verify: {
        type: Object,
        value: function () {
          return {}
        }
      }
    };
  }

  // attached to document
  attached() {
    console.info('\<gigya-login\> attached');

    this.async(() => {
      let el = this;
      let form = Polymer.dom(this.root).querySelector('#loginForm');

      form.addEventListener('iron-form-submit', function() {
        console.info('\<gigya-login\> form submit event');

        el._disableForm();
        el._submit();
      });
    });
  }

  // internal method calling gigya-socialize method
  _checkUser() {
    let base = Polymer.dom(document).querySelector('cranberry-base');
    let socialize = base.querySelector('gigya-socialize');

    socialize.checkUser();
  }

  // disable form elements
  _disableForm() {
    console.info('\<gigya-login\> disable form');

    this.$.submit.disabled = true;
  }

  // enable form elements
  _enableForm() {
    console.info('\<gigya-login\> enable form');

    this.$.submit.disabled = false;
  }

  // handle login form click
  _handleLogin(event) {
    console.info('\<gigya-login\> handle login');

    let form = Polymer.dom(this.root).querySelector('#loginForm');

    this.debounce('submit', () => {
      form.submit();
    }, 100);
  }

  // handle social login button click
  _handleLoginSocial(event) {
    this._disableForm();
    this.set('spinnerActive', false);

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

  // handle forgot password link click
  _handleForgotPassword() {
    let base = Polymer.dom(document).querySelector('cranberry-base');
    let socialize = base.querySelector('gigya-socialize');

    socialize.set('guestSelected', 2);
  }

  // handle register link click
  _handleRegister(event) {
    event.preventDefault();
    this.async(() => {
      let base = Polymer.dom(document).querySelector('cranberry-base');
      let socialize = base.querySelector('gigya-socialize');

      socialize.set('guestSelected', 1);
    }, 25);
  }

  // handle reset form, clear notices
  _handleReset(event) {
    console.info('\<gigya-login\> reset form');

    let form = Polymer.dom(this.root).querySelector('#loginForm');

    this.debounce('reset', function() {
      this.set('notices', []);
      form.reset();
    }, 100);
  }

  // handle Gigya API response
  _handleResponse(response) {
    let base = Polymer.dom(document).querySelector('cranberry-base');
    let socialize = base.querySelector('gigya-socialize');
    let login = socialize.querySelector('gigya-login');

    let detail = {};

    if (typeof response.detail !== 'undefined') {
      detail = response.detail;
    } else {
      detail = response;
    }

    let el = login;

    if (typeof detail.context !== 'undefined') {
      el = detail.context;
    }

    if (typeof detail !== 'undefined') {
      if (detail.loginProvider === 'site' && detail.errorCode === 0) {
        el._setUserCookie(detail.sessionInfo.cookieName, detail.sessionInfo.cookieValue, 365);
      }
      if ((detail.loginProvider === 'site' && detail.errorCode === 0) || (detail.loginProvider !== 'site' && detail.errorCode === '0')) {
        el._checkUser();
        el.set('spinnerActive', false);
        el._handleReset();
        el._enableForm();
      } else if ((detail.loginProvider === 'site' && detail.errorCode !== 0) || (detail.loginProvider !== 'site' && detail.errorCode !== '0')) {
        let form = el.querySelector('#loginForm');
        form.password.value = '';
        el._processError(detail);
      }
    } else {
      console.error('Unhandled form error');
    }
  }

  // process error code from API
  _processError(code) {
    console.info('\<gigya-login\> error');

    let notice = {};

    let errorCode = parseInt(code.errorCode);
    notice.code = errorCode;

    switch(errorCode) {
      case 206001:
        notice.type = 'success';
        notice.message = 'Account pending finalized registration.'
        notice.finalize = true;

        this.set('tmpUser', code.profile);
        this.set('regToken', code.regToken);
        console.log('user code 2');
        let derp = this.get('tmpUser');
        console.dir(derp);
        // let el = this;
        // gigya.accounts.finalizeRegistration({callback: el._checkUser, regToken: code.regToken});

        break;
      case 206002:
        notice.type = 'warning';
        notice.message = 'Your account requires e-mail verification. Check your e-mail address to verify your account.';
        notice.verify = true;

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
        notice.message = 'Login exists as site account. Please login using the username and password form below.';
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
        notice.message = 'Unhandled error.';
        console.dir(code);
        break;
    }

    this.push('notices', notice);

    this.set('spinnerActive', false);

    this._enableForm();
  }

  // resend verification code with optional e-mail address
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

  // set cookie for Gigya, this enables the autologin functionality
  _setUserCookie(cname, cvalue, exdays) {
    let d = new Date();

    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));

    let expires = "expires=" + d.toGMTString();

    document.cookie = cname + "=" + cvalue + "; " + expires + "; path=/";
  }

  // submit login form data
  _submit() {
    this.async(() => {
      console.info('\<gigya-login\> submit gigya');

      this.set('notices', []);
      this.set('spinnerActive', true);

      let form = Polymer.dom(this.root).querySelector('#loginForm');
      let request = Polymer.dom(this.root).querySelector('#request');

      let params = {};
      let apiKey = this.get('apiKey');

      params.apiKey = apiKey;
      params.format = 'jsonp';
      params.loginID = loginForm.loginID.value;
      params.password = loginForm.password.value;
      params.callback = this._handleResponse;

      gigya.accounts.login(params);

      // request.params = params;
      // request.url = 'https://accounts.us1.gigya.com/accounts.login';
      //
      // request.generateRequest();
    });
  }

  // callback for verification e-mail, adds notice
  _verificationSent(data) {
    let notice = {};

    notice.type = 'success';
    notice.message = 'Verification e-mail sent';
    notice.code = 0;

    data.context.push('notices', notice);
  }
}

Polymer(GigyaLogin);
