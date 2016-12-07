class cranberryProfileCard {
  beforeRegister() {
    this.is = 'cranberry-profile-card';
    this.properties = {
      profile: {
        type: Object,
        observer: '_profileChanged'
      },
      hideEmail: {
        type: Boolean,
        value: true
      },
      hideFacebook: {
        type: Boolean,
        value: true
      },
      hideLinkedin: {
        type: Boolean,
        value: true
      },
      hideTwitter: {
        type: Boolean,
        value: true
      },
    }
  }

  _profileChanged(newValue, oldValue) {
    if (typeof newValue !== 'undefined' && typeof newValue.socialInfo !== 'undefined') {
      this._setHidden('email', newValue.socialInfo);
      this._setHidden('facebook', newValue.socialInfo);
      this._setHidden('linkedin', newValue.socialInfo);
      this._setHidden('twitter', newValue.socialInfo);
    }
  }

  _setHidden(type, value) {
    let variableType = 'hide' + type.charAt(0).toUpperCase() + type.slice(1);
    
    if (typeof value[type] !== 'undefined' && value[type] !== '') {
      this.set(variableType, false);
    } else {
      this.set(variableType, true);
    }
  }
}
Polymer(cranberryProfileCard);
