class GigyaForgotPassword {
  beforeRegister() {
    this.is = 'gigya-forgot-password';
    this.properties = {
      showForm: {
        type: Boolean,
        value: true
      },
      notices: {
        type: Object,
        value: []
      }
    };
  }

  attached() {
    app.logger('\<gigya-forgot-password\> attached');

    this.async(function() {
      let el = this;
      let form = Polymer.dom(this.root).querySelector('#forgotPasswordForm');

      form.addEventListener('iron-form-submit', function() {
        app.logger('\<gigya-forgot-password\> form submit event');

        el._disableForm();
        el._submit();
      });
    });
  }

  _forgotPasswordCallback(data) {
    app.logger('\<gigya-forgot-password\> forgot password callback');

    let el = data.context;

    if (data.errorCode === 0) {
      app.logger('\<gigya-forgot-password\> password reset email sent');

      el.set('showForm', false);

      let notice = {
        type: 'success',
        message: 'An email was sent with instructions on resetting your password.'
      };

      el.push('notices', notice);
    } else {
      console.error('\<gigya-forgot-password\> gigya error -> ' + data.errorMessage);

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

  _disableForm() {
    app.logger('\<gigya-forgot-password\> disable form');

    this.$.submit.disabled = true;
  }

  _enableForm() {
    app.logger('\<gigya-forgot-password\> enable form');

    this.$.submit.disabled = false;
  }

  _handleForgotPassword(event) {
    app.logger('\<gigya-forgot-password\> handle forgot password');

    let form = Polymer.dom(this.root).querySelector('#forgotPasswordForm');

    this.debounce('submit', function() {
      form.submit();
    }, 100);
  }

  // handle register link click
  _handleRegister() {
    let base = Polymer.dom(document).querySelector('cranberry-base');
    let socialize = base.querySelector('gigya-socialize');

    socialize.set('guestSelected', 1);
  }

  _handleReset(event) {
    let form = Polymer.dom(this.root).querySelector('#forgotPasswordForm');

    this.debounce('reset', function() {
      this.set('notices', []);
      form.reset();
    }, 100);
  }

  // process error code from API
  _processError(error) {
    app.logger('\<gigya-forgot-password\> API response error');

    let notice = {};

    let errorCode = error.errorCode;
    notice.code = errorCode;

    switch(errorCode) {
      case 403047:
        notice.type = 'error';
        notice.message = 'There is no user with that username or email.';
        break;
      case 400028:
        notice.type = 'error';
        notice.message = 'The email for this username isn\'t verified. Please click on the verification link sent to the email address for this username.';
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
    app.logger('\<gigya-forgot-password\> API validation error');

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

  _submit() {
    app.logger('\<gigya-forgot-password\> submit gigya');

    this.set('notices', []);

    let form = Polymer.dom(this.root).querySelector('#forgotPasswordForm');

    let params = {
      callback: this._forgotPasswordCallback,
      context: this,
      loginID: form.username.value
    };

    gigya.accounts.resetPassword(params);
  }
}

Polymer(GigyaForgotPassword);
