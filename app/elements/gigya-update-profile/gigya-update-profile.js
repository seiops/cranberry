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
    console.info('\<gigya-update-profile\> attached');

    this.async(function() {
      let el = this;
      let form = Polymer.dom(this.root).querySelector('#updateProfileForm');

      form.addEventListener('iron-form-submit', function() {
        console.info('\<gigya-update-profile\> form submit event');

        el._disableForm();
        el._submit();
      });

    });
  }
  
  // private methods
  _computeBirthday(user) {
    console.info('\<gigya-update-profile\> compute birthday');

    let birthday = user.birthYear + '-' + user.birthMonth + '-' + user.birthDay;

    return birthday;
  }

  _disableForm() {
    console.info('\<gigya-update-profile\> disable form');

    this.$.submit.disabled = true;
  }

  _enableForm() {
    console.info('\<gigya-update-profile\> enable form');

    this.$.submit.disabled = false;
  }

  _handleReset(event) {
    console.info('\<gigya-update-profile\> reset form');

    let form = Polymer.dom(this.root).querySelector('#updateProfileForm');

    form.reset();
  }

  _handleUpdateProfile(event) {
    console.info('\<gigya-update-profile\> handle update profile');

    let form = Polymer.dom(this.root).querySelector('#updateProfileForm');

    form.submit();
  }

  // process error code from API
  _processError(error) {
    console.info('\<gigya-update-profile\> API response error');

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

    socialize.set('userSelected', 3);
  }

  _submit() {
    console.info('\<gigya-update-profile\> submit gigya');

    this.set('notices', []);

    this.$.spinner.active = true;

    let form = Polymer.dom(this.root).querySelector('#updateProfileForm');

    let params = {
      callback: this._updateProfileCallback,
      context: this,
      username: form.username.value,
      profile: {
        firstName: (form.firstName.value !== '' ? form.firstName.value : null),
        lastName: (form.lastName.value !== '' ? form.lastName.value : null),
        email: form.email.value,
        gender: (form.gender.value !== '' ? form.gender.value : null),
        birthDay: (form.birthDay.value !== '' ? form.birthDay.value : null),
        birthMonth: (form.birthMonth.value !== '' ? form.birthMonth.value : null),
        birthYear: (form.birthYear.value !== '' ? form.birthYear.value : null),
        zip: (form.zip.value !== '' ? form.zip.value : null)
      }
    };

    console.dir(params);

    gigya.accounts.setAccountInfo(params);
  }

  _updateProfileCallback(data) {
    console.info('\<gigya-update-profile\> update profile callback');

    let el = data.context;

    if (data.errorCode === 0) {
      console.info('\<gigya-update-profile\> user updated');

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
