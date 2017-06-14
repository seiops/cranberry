class GigyaRegister {
  // element registration
  beforeRegister() {
    this.is = 'gigya-register';
    this.properties = {
      showForm: {
        type: Boolean,
        value: true
      },
      notices: {
        type: Array,
        value: function() {
          return [];
        }
      },
      verify: {
        type: Object,
        value: {}
      }
    };
  }

  // public methods

  // attached to document
  attached() {
    console.info('\<gigya-register\> attached');

    this.async(function() {
      let el = this;
      let form = Polymer.dom(this.root).querySelector('#registerForm');

      form.addEventListener('iron-form-submit', function() {
        console.info('\<gigya-register\> form submit event');

        el._disableForm();
        el._submit();
      });

    });
  }

  // private methods

  // disable form elements
  _disableForm() {
    console.info('\<gigya-register\> disable form');

    this.$.submit.disabled = true;
  }

  // enable form elements
  _enableForm() {
    console.info('\<gigya-register\> enable form');

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
    console.info('\<gigya-register\> reset form');

    this.set('notices', []);

    let form = Polymer.dom(this.root).querySelector('#registerForm');

    form.reset();
  }

  // handle register form link
  _handleRegister(event) {
    console.info('\<gigya-register\> handle update profile');

    let form = Polymer.dom(this.root).querySelector('#registerForm');

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
    console.info('\<gigya-register\> API validation error');

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

    this._deDupNoticies(notice);
    // this.push('notices', notice);
  }

  _deDupNoticies(notice) {
    this.async(() => {
      let notices = this.get('notices');
      let shouldPush = true;

      notices.forEach((value) => {
        if (value.message === notice.message) {
          console.info('\<gigya-register\> API validation error :: Duplicate Error');
          shouldPush = false;
          return false;
        }
      });

      if (shouldPush) {
        this.push('notices', notice);
      }
    });
  }

  // submit register form data with Gigya token
  _register(response) {
    if (response.errorCode === 0) {
      let context = response.context;
      let form = Polymer.dom(context.root).querySelector('#registerForm');

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
        regToken: response.regToken,
        username: form.username.value,
        profile: {
          email: form.email.value,
          nickname: form.username.value
        }
      };

      gigya.accounts.register(params);
    } else {
      console.error('Unknown error in _register.');
    }
  }

  // submit initRegistration call for Gigya token
  _submit() {
    console.info('\<gigya-register\> submit gigya');

    this.set('notices', []);

    this.$.spinner.active = true;

    let params = {
      callback: this._register,
      context: this
    };

    gigya.accounts.initRegistration(params);
  }

  // callback for registration from Gigya
  _registerCallback(data) {
    console.info('\<gigya-register\> register callback');

    let el = data.context;

    if (data.errorCode === 0) {
      console.info('\<gigya-register\> user updated');

      let base = Polymer.dom(document).querySelector('cranberry-base');
      let socialize = base.querySelector('gigya-socialize');

      socialize.checkUser();
    } else {
      console.error('\<gigya-register\> gigya error -> ' + data.errorMessage);

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

Polymer(GigyaRegister);
