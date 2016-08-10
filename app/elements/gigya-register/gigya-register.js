class GigyaRegister {
  beforeRegister() {
    this.is = 'gigya-register';
    this.properties = {
      user: {
        type: Object,
        value: {}
      },
      account: {
        type: Object,
        value: {}
      }
    };
  }

  attached() {
    app.logger('\<gigya-register\> attached');

    this.async(function() {
      let el = this;
      let form = Polymer.dom(this.root).querySelector('#registerForm');

      form.addEventListener('iron-form-submit', function() {
        app.logger('\<gigya-register\> form submit event');

        el._disableForm();
        el._submit();
      });

    });
  }

  _computeBirthday(user) {
    app.logger('\<gigya-register\> compute birthday');

    let birthday = user.birthYear + '-' + user.birthMonth + '-' + user.birthDay;

    return birthday;
  }

  _disableForm() {
    app.logger('\<gigya-register\> disable form');

    this.$.submit.disabled = true;
  }

  _enableForm() {
    app.logger('\<gigya-register\> enable form');

    this.$.submit.disabled = false;
  }

  _handleReset(event) {
    app.logger('\<gigya-register\> reset form');

    let form = Polymer.dom(event).localTarget.parentElement.parentElement;

    form.reset();
  }

  _handleRegister(event) {
    app.logger('\<gigya-register\> handle update profile');

    let form = Polymer.dom(event).localTarget.parentElement.parentElement;

    form.submit();
  }

  _processError(code) {
    app.logger('\<gigya-register\> process error');

    console.log(code);
  }

  _register(response) {
    if (response.errorCode === 0) {
      let form = Polymer.dom(response.context.root).querySelector('#registerForm');

      let params = {
        callback: response.context._registerCallback,
        context: response.context,
        email: form.email.value,
        password: form.password.value,
        regToken: response.regToken,
        username: form.username.value
      };

      gigya.accounts.register(params);
    } else {
      console.error('unknown error in _register');
    }
  }

  _submit() {
    app.logger('\<gigya-register\> submit gigya');

    this.$.spinner.active = true;

    let params = {
      callback: this._register,
      context: this
    };

    gigya.accounts.initRegistration(params);
  }

  _registerCallback(data) {
    app.logger('\<gigya-register\> register callback');

    console.dir(data);
    // let el = data.context;
    //
    // if (data.errorCode === 0) {
    //   app.logger('\<gigya-register\> user updated');
    //
    //   let base = Polymer.dom(document).querySelector('cranberry-base');
    //   let socialize = base.querySelector('gigya-socialize');
    //
    //   socialize.checkUser();
    // } else {
    //   console.error('\<gigya-register\> gigya error -> ' + data.errorMessage);
    //
    //   el._processError(data.errorCode);
    // }
    //
    // el.$.spinner.active = false;
    // el._enableForm();
  }
}

Polymer(GigyaRegister);
