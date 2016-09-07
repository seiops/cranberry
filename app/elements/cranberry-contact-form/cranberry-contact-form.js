class cranberryContactForm {
  beforeRegister() {
    this.is = 'cranberry-contact-form';
    this.properties = {
      recipient: {
        type: String
      },
      submitting: {
        type: Boolean,
        value: false
      }
    };
  }

  _handleSubmit() {
    let form = this.$.form;
    let request = this.$.request;
    let submit = this.$.submitButton;

    submit.disabled = true;
    this.set('submitting', true);
    // Check form for validity
    let validForm = form.validate();
    // if the form is in a valid state then submit
    if (validForm) {
      request.url = (window.location.hostname === 'localhost' ? 'http://srdevcore.libercus.net' : window.location.protocol +  window.location.host) + '/contact-form';

      var params = {};

      params.request = "submit";
      params.fullname = form.name.value;
      params.email = form.email.value;
      params.address = form.address.value;
      params.telephone = form.telephone.value;
      // Send blank string to by-pass captcha from Libercus.
      params.captcha = '';
      params.message = form.message.value;
      // Passed in value for recipient
      params.recipient = this.recipient;

      // Set params on the request
      request.params = params;

      // Initiate HTTP request
      request.generateRequest();
    }
  }

  _handleReset() {
    let form = this.$.form;
    // Reset inputs, checkboxes, and radio buttons
    form.reset();
    // Reset reCaptcha
    this.$.recap.reset();
    // Fire a change event on the form to re-validate
    form.fire('change');
  }

  ready() {
    let form = this.$.form;
    let reCaptcha = this.querySelector('re-captcha');
    let submitButton = this.$.submitButton;
    // Boolean for if the captcha is validated
    let captchaValidated = false;

    reCaptcha.addEventListener('captcha-response', function(e){
      // Validated is true
      captchaValidated = true;
      // Fire form change event to validate
      form.fire('change');
    });

    form.addEventListener('change', function(event) {
      // Validate the form
      let formValid = form.validate();
      // If the form is valid and the re-captcha has been successfully completed enable the submit button else ensure button is disabled.
      if (formValid && captchaValidated) {
        // Button is no longer disabled
        submitButton.disabled = false;
      } else {
        // Button remains disabled
        submitButton.disabled = true;
      }
    });
  }

  // byutv handle response function
  handleResponse (data) {
    var response = data.detail.Result;

    if (response === 'Your message has been sent') {
      // Message was successfully sent
      app.$.infoToast.text = 'Thank you for your submission!';
      app.$.infoToast.show();

      this._handleReset();
    }

    this.set('submitting', false);
    let submit = this.$.submitButton;
    submit.disabled = false;

  }
}

Polymer(cranberryContactForm);
