class GigyaChangePassword {
  beforeRegister() {
    this.is = 'gigya-change-password';
    this.properties = {
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
      let el = this;
      let form = Polymer.dom(this.root).querySelector('#changePasswordForm');

      form.addEventListener('iron-form-submit', function() {
        app.logger('\<gigya-change-password\> form submit event');

        el._disableForm();
        el._submit();
      });
    });
  }

  _changePasswordCallback(data) {
    app.logger('\<gigya-change-password\> change password callback');

    let el = data.context;

    if (data.errorCode === 0) {
      app.logger('\<gigya-change-password\> password updated');
    } else {
      console.error('\<gigya-change-password\> gigya error -> ' + data.errorDetails);

      el._processError(data.errorCode);
    }

    el._enableForm();
  }

  _disableForm() {
    app.logger('\<gigya-update-profile\> disable form');

    this.$.submit.disabled = true;
  }

  _enableForm() {
    app.logger('\<gigya-update-profile\> enable form');

    this.$.submit.disabled = false;
  }

  _handleChangePassword(event) {
    app.logger('\<gigya-change-password\> handle change password');

    let form = Polymer.dom(event).localTarget.parentElement;

    form.submit();
  }

  _handleReset(event) {
    let form = Polymer.dom(event).localTarget.parentElement;

    form.reset();
  }

  _processError(code) {
    app.logger('\<gigya-update-profile\> process error');

    console.log(code);
  }

  _submit() {
    app.logger('\<gigya-change-password\> submit gigya');

    let form = Polymer.dom(this.root).querySelector('#changePasswordForm');

    let params = {
      callback: this._changePasswordCallback,
      context: this,
      newPassword: form.newPassword.value,
      password: form.oldPassword.value
    };

    gigya.accounts.setAccountInfo(params);
  }
}

Polymer(GigyaChangePassword);
