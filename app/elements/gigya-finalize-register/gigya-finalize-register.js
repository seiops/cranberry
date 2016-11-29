class GigyaFinalizeRegister {
  // element registration
  beforeRegister() {
    this.is = 'gigya-finalize-register';
    this.properties = {
      showForm: {
        type: Boolean,
        value: true
      },
      notices: {
        type: Object,
        value: []
      },
      token: {
        type: String
      }
    };
  }

  // public methods

  // attached to document
  attached() {
    console.info('\<gigya-finalize-register\> attached');

    this.async(function() {
      let el = this;
      let form = Polymer.dom(this.root).querySelector('#registerFinalizeForm');
      let base = Polymer.dom(document).querySelector('cranberry-base');
      let socialize = base.querySelector('gigya-socialize');

      // Fire resize event when this element is attached SAFARI FIX
      socialize.resize();
      form.addEventListener('iron-form-submit', function() {
        console.info('\<gigya-finalize-register\> form submit event');

        el._disableForm();
        el._submit();
      });

    });
  }

  // private methods

  // disable form elements
  _disableForm() {
    console.info('\<gigya-finalize-register\> disable form');

    this.$.submit.disabled = true;
  }

  // enable form elements
  _enableForm() {
    console.info('\<gigya-finalize-register\> enable form');

    this.$.submit.disabled = false;
  }

  _handleLogin() {
    let base = Polymer.dom(document).querySelector('cranberry-base');
    let socialize = base.querySelector('gigya-socialize');

    socialize.set('guestSelected', 0);
  }

  // handle social login button click
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

  // handle reset form, clear notices
  _handleReset(event) {
    console.info('\<gigya-finalize-register\> reset form');

    this.set('notices', []);

    let form = Polymer.dom(this.root).querySelector('#registerFinalizeForm');

    form.reset();
  }

  // handle register form link
  _handleRegister(event) {
    console.info('\<gigya-finalize-register\> handle update profile');

    let form = Polymer.dom(this.root).querySelector('#registerFinalizeForm');

    form.submit();
  }

  // process error code from API
  _processError(error) {
    console.info('\<gigya-login\> API response error');

    let notice = {};

    let errorCode = error.errorCode;
    notice.code = errorCode;

    switch(errorCode) {
      case 206002:
        notice.type = 'warning';
        notice.message = 'Account pending verification. Check your e-mail address to verify your account.';
        this.set('showForm', false);
        break;
      case 400006:
        notice.type = 'error';
        notice.message = 'Invalid email address.';
        break;
      default:
        notice.type = 'error';
        notice.message = 'Unhandled error -> ' + error.errorMessage;
        console.dir(error);
        break;
    }

    this.push('notices', notice);

    this.$.spinner.active = false;

    this._enableForm();
  }

  // process error code from API
  _processValidationError(error) {
    console.info('\<gigya-finalize-register\> API validation error');

    let notice = {};

    let errorCode = error.errorCode;
    let errorField = error.fieldName;

    notice.code = errorCode;

    if(errorCode === 400003) {
      notice.type = 'error';
      if(errorField === 'email') {
        notice.message = 'An account is already registered with that e-mail address.';
      } else if(errorField === 'username') {
        notice.message = 'That username already exists.';
      }
     }else {
      notice.type = 'error';
      notice.message = 'Unhandled error.';
      console.dir(error);
    }

    this.push('notices', notice);
  }

  // submit register form data with Gigya token
  _register() {
      let context = this;
      let form = Polymer.dom(context.root).querySelector('#registerFinalizeForm');
      let token = this.get('token');

      // Set profile details that will be needed for finalizeRegistration to actually work
      let params = {
        callback: context._registerCallback,
        context: context,
        data: {
          terms: true
        },
        email: form.email.value,
        finalizeRegistration: true,
        password: form.password.value,
        regToken: token,
        username: form.username.value,
        profile: {
          email: form.email.value,
          nickname: form.username.value
        }
      };

      gigya.accounts.setAccountInfo(params);
      // gigya.accounts.finalizeRegistration(params);
  }

  // submit initRegistration call for Gigya token
  _submit() {
    console.info('\<gigya-finalize-register\> submit gigya');

    this.set('notices', []);

    this.$.spinner.active = true;

    this._register();
    // let params = {
    //   callback: this._register,
    //   context: this
    // };
    //
    // gigya.accounts.initRegistration(params);
  }

  // callback for registration from Gigya
  _registerCallback(data) {
    console.info('\<gigya-finalize-register\> register callback');
    console.dir(data);

    let el = data.context;

    if (data.errorCode === 0) {
      console.info('\<gigya-finalize-register\> user updated');

      let base = Polymer.dom(document).querySelector('cranberry-base');
      let socialize = base.querySelector('gigya-socialize');

      let token = data.requestParams.regToken;

      let params = {
        callback: socialize.checkUser,
        context: el,
        regToken: token
      };
      gigya.accounts.finalizeRegistration(params);
    } else {
      console.error('\<gigya-finalize-register\> gigya error -> ' + data.errorMessage);

      if(typeof data.validationErrors !== 'undefined') {
        data.validationErrors.forEach(function(value) {
          el._processValidationError(value);
        });
      } else {
        el._processError(data);
      }
    }

    el.$.spinner.active = false;
    el._enableForm();
  }
}

Polymer(GigyaFinalizeRegister);
