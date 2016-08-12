class GigyaForgotPassword {
  beforeRegister() {
    this.is = 'gigya-forgot-password';
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

    console.dir(data);
    let el = data.context;
    //
    // if (data.errorCode === 0) {
    //   app.logger('\<gigya-forgot-password\> password updated');
    // } else {
    //   console.error('\<gigya-forgot-password\> gigya error -> ' + data.errorDetails);
    //
    //   el._processError(data.errorCode);
    // }

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

  _handleForgotPassword(event) {
    app.logger('\<gigya-forgot-password\> handle forgot password');

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
    app.logger('\<gigya-forgot-password\> submit gigya');

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
