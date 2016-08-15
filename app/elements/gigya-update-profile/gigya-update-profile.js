class GigyaUpdateProfile {
  // element registration
  beforeRegister() {
    this.is = 'gigya-update-profile';
    this.properties = {
      account: {
        type: Object,
        value: {}
      },
      notices: {
        type: Object,
        value: []
      },
      user: {
        type: Object,
        value: {}
      }
    };
  }

  // public methods
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
  
  // private methods
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

    let form = Polymer.dom(this.root).querySelector('#updateProfileForm');

    form.reset();
  }

  _handleUpdateProfile(event) {
    app.logger('\<gigya-update-profile\> handle update profile');

    let form = Polymer.dom(this.root).querySelector('#updateProfileForm');

    form.submit();
  }

  // process error code from API
  _processError(error) {
    app.logger('\<gigya-update-profile\> API response error');

    let notice = {};

    let errorCode = error.errorCode;
    notice.code = errorCode;

    switch(errorCode) {
      case 400003:
        notice.type = 'error';
        notice.message = 'Username already in use.';
        break;
      case 403043:
        notice.type = 'error';
        notice.message = 'Email already in use.';
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

  _showChangePassword() {
    let base = Polymer.dom(document).querySelector('cranberry-base');
    let socialize = base.querySelector('gigya-socialize');

    socialize.set('userSelected', 4);
  }

  _submit() {
    app.logger('\<gigya-update-profile\> submit gigya');

    this.set('notices', []);

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

      let notice = {
        type: 'success',
        message: 'Profile updated successfully.'
      };

      el.push('notices', notice);
    } else {
      console.error('\<gigya-update-profile\> gigya error -> ' + data.errorMessage);

      el._processError(data);
    }

    el.$.spinner.active = false;
    el._enableForm();

  }
}

Polymer(GigyaUpdateProfile);
