class GigyaNewsletterSignup {
  // element registration
  beforeRegister() {
    this.is = 'gigya-newsletter-signup';
    this.properties = {
      account: Object,
      newsletters: {
        type: Array,
        value: function() {
          return [];
        }
      },
      notices: {
        type: Object,
        value: []
      },
      user: Object
    }
  }

  attached() {
    console.info('\<gigya-newsletter-signup\> attached');

    this.async(function() {
      let el = this;
      let form = Polymer.dom(this.root).querySelector('#newsletterForm');

      form.addEventListener('iron-form-submit', function() {
        console.info('\<gigya-newsletter-signup\> form submit event');

        el._disableForm();
        el._submit();
      });

    });
  }

  _enableForm() {
    console.info('\<gigya-newsletter-signup\> enable form');

    this.$.submit.disabled = false;
  }

  _disableForm() {
    console.info('\<gigya-newsletter-signup\> disable form');

    this.$.submit.disabled = true;
  }

  _getNewsletterValue(account, item) {
    let accountNewsletters = (typeof account.data !== 'undefined' ? account.data.srNewsletters : {});
    let name = item.name;

    return (typeof accountNewsletters[name] !== 'undefined' ? accountNewsletters[name] : false);
  }

  _handleUpdateAccount(event) {
    console.info('\<gigya-newsletter-signup\> handle update profile');

    let form = Polymer.dom(this.root).querySelector('#newsletterForm');

    form.submit();
  }

  _submit() {
    console.info('\<gigya-update-profile\> submit gigya');
    let username = this.get('account').loginIDs.username;
    let newsletters = this.get('newsletters');
    this.set('notices', []);

    this.$.spinner.active = true;

    let form = Polymer.dom(this.root).querySelector('#newsletterForm');

    form = Polymer.dom(form);

    let params = {
      callback: this._updateNewsletterCallback,
      context: this,
      username: username,
      data: {}
    };

    for (let newsletter of newsletters) {
      let correctChild = form.children.filter((element) => {
        if (element.name === newsletter.naming) {
          return element;
        }
      });

      let value = correctChild[0].checked;

      params.data[newsletter.linking] = value;
    }

    console.dir(params);

    gigya.accounts.setAccountInfo(params);
  }

  _updateNewsletterCallback(data) {
    console.info('\<gigya-newsletter-signup\> update profile callback');

    let el = data.context;

    if (data.errorCode === 0) {
      console.info('\<gigya-newsletter-signup\> user updated');

      let base = Polymer.dom(document).querySelector('cranberry-base');
      let socialize = base.querySelector('gigya-socialize');

      socialize.checkUser();

      let notice = {
        type: 'success',
        message: 'Sign-up successful.'
      };

      el.push('notices', notice);
    } else {
      console.error('\<gigya-newsletter-signup\> gigya error -> ' + data.errorMessage);

      el._processError(data);
    }

    el.$.spinner.active = false;
    el._enableForm();

  }

    // process error code from API
  _processError(error) {
    console.info('\<gigya-newsletter-signup\> API response error');

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

}
Polymer(GigyaNewsletterSignup);
