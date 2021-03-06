class GigyaChangePassword {
  beforeRegister() {
    this.is = 'gigya-change-password';
    this.properties = {
      notices: {
        type: Object,
        value: []
      },
      user: {
        type: Object,
        value: {},
        notify: true
      },
      spinnerActive: {
        type: Boolean,
        value: false
      }
    };
  }

  attached() {
    console.info('\<gigya-change-password\> attached');

    this.async(function() {
      let el = this;
      let form = Polymer.dom(this.root).querySelector('#changePasswordForm');

      form.addEventListener('iron-form-submit', function() {
        console.info('\<gigya-change-password\> form submit event');

        el._disableForm();
        el._submit();
      });
    });
  }

  _changePasswordCallback(data) {
    console.info('\<gigya-change-password\> change password callback');

    let el = data.context;

    if (data.errorCode === 0) {
      console.info('\<gigya-change-password\> password updated');

      let notice = {
        type: 'success',
        message: 'Your password has been changed.'
      };

      el.push('notices', notice);
      el._handleReset();
    } else {
      console.error('\<gigya-change-password\> gigya error -> ' + data.errorDetails);

      el._processError(data);
    }

    el.set('spinnerActive', false);
    el._enableForm();
  }

  _disableForm() {
    console.info('\<gigya-update-profile\> disable form');

    this.$.submit.disabled = true;
  }

  _enableForm() {
    console.info('\<gigya-update-profile\> enable form');

    this.$.submit.disabled = false;
  }

  _handleChangePassword(event) {
    console.info('\<gigya-change-password\> handle change password');

    let form = Polymer.dom(this.root).querySelector('#changePasswordForm');

    this.debounce('submit', function() {
      form.submit();
    }, 100);

    this.set('spinnerActive', true);
  }

  _handleReset(event) {
    let form = Polymer.dom(this.root).querySelector('#changePasswordForm');

    this.debounce('reset', function() {
      form.reset();
    }, 100);
  }

  // process error code from API
  _processError(code) {
    console.info('\<gigya-change-password\> error');

    console.dir(code);

    let notice = {};

    let errorCode = code.errorCode;
    notice.code = errorCode;

    switch(errorCode) {
      case 400006:
        notice.type = 'error';
        notice.message = 'New password cannot be the same as your current password.';
        break;
      case 401030:
        notice.type = 'error';
        notice.message = 'You are attempting to use an old password as your current password.';
        break;
      case 403042:
        notice.type = 'error';
        notice.message = 'Invalid password.';
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

  _submit() {
    this.async(function(){
      console.info('\<gigya-change-password\> submit gigya');

      this.set('notices', []);

      let form = Polymer.dom(this.root).querySelector('#changePasswordForm');

      let params = {
        callback: this._changePasswordCallback,
        context: this,
        newPassword: form.password.value,
        password: form.oldPassword.value
      };

      gigya.accounts.setAccountInfo(params);
    });
  }
}

Polymer(GigyaChangePassword);
