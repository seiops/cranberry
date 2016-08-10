class GigyaUpdateProfile {
  beforeRegister() {
    this.is = 'gigya-update-profile';
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
    app.logger('\<gigya-update-profile\> attached');

    this.async(function() {
      let el = this;
      let form = Polymer.dom(this.root).querySelector('#updateProfileForm');

      form.addEventListener('iron-form-submit', function() {
        app.logger('\<gigya-update-profile\> form submit event');

        el._disableForm();
        el._submit();
      });

    });
  }

  _computeBirthday(user) {
    app.logger('\<gigya-update-profile\> compute birthday');

    let birthday = user.birthYear + '-' + user.birthMonth + '-' + user.birthDay;

    return birthday;
  }

  _disableForm() {
    app.logger('\<gigya-update-profile\> disable form');

    this.$.submit.disabled = true;
  }

  _enableForm() {
    app.logger('\<gigya-update-profile\> enable form');

    this.$.submit.disabled = false;
  }

  _handleReset(event) {
    app.logger('\<gigya-update-profile\> reset form');

    let form = Polymer.dom(event).localTarget.parentElement.parentElement;

    form.reset();
  }

  _handleUpdateProfile(event) {
    app.logger('\<gigya-update-profile\> handle update profile');

    let form = Polymer.dom(event).localTarget.parentElement.parentElement;

    form.submit();
  }

  _processError(code) {
    app.logger('\<gigya-update-profile\> process error');

    console.log(code);
  }

  _submit() {
    app.logger('\<gigya-update-profile\> submit gigya');

    this.$.spinner.active = true;
    let form = Polymer.dom(this.root).querySelector('#updateProfileForm');

    let params = {
      callback: this._updateProfileCallback,
      context: this,
      username: form.username.value,
      profile: {
        firstName: form.firstName.value,
        lastName: form.lastName.value,
        email: form.email.value,
        gender: form.gender.value,
        birthDay: form.birthDay.value,
        birthMonth: form.birthMonth.value,
        birthYear: form.birthYear.value,
        zip: form.zip.value
      }
    };

    gigya.accounts.setAccountInfo(params);
  }

  _updateProfileCallback(data) {
    app.logger('\<gigya-update-profile\> update profile callback');

    let el = data.context;

    if (data.errorCode === 0) {
      app.logger('\<gigya-update-profile\> user updated');

      let base = Polymer.dom(document).querySelector('cranberry-base');
      let socialize = base.querySelector('gigya-socialize');

      socialize.checkUser();
    } else {
      console.error('\<gigya-update-profile\> gigya error -> ' + data.errorMessage);

      el._processError(data.errorCode);
    }

    el.$.spinner.active = false;
    el._enableForm();

  }
}

Polymer(GigyaUpdateProfile);
