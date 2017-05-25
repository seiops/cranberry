class cranberryNewsletter {
  beforeRegister() {
    this.is = 'cranberry-newsletter';
    this.properties = {
      account: {
        type: Object,
        value: function() {
          return {}
        },
        observer: '_setupUserVariable',
        sizing: {
          type: String,
          value: 'small'
        }
      },
      user: {
        type: Object,
        value: function() {
          return {};
        }
      }
    };
    this.listeners = { 'account-changed': '_accountChanged' };
  }

  attached() {
    console.info('\<cranberry-newsletter\> attached');
    let account = this.get('account');

    if (typeof account === 'undefined' || Object.keys(account).length === 0) {
      // Reach out and set account to gigya socialize account
      let app = Polymer.dom(document).querySelector('#app');
      let socialize = app.querySelector('gigya-socialize');
      let account = socialize.get('account');
      this.set('account', account);
    }
  }

  _accountChanged(e) {
    let account = e.detail.account;
    this.set('account', account);
  }

  _setupUserVariable(account, oldAccount) {
    console.dir(account);
    if (typeof account !== 'undefined' && account.userInfo) {
      this.set('user', account.userInfo);
    } else {
      this.set('user', {});
    }
  }

  _openSignup() {
    this.fire('iron-signal', { name: 'open-user-modal', data: { goToScreen: 1 } });
  }

  _openLogin() {
    this.fire('iron-signal', { name: 'open-user-modal', data: { goToScreen: 1 } });
  }
}
Polymer(cranberryNewsletter);
