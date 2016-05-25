class ContactForm {
  beforeRegister() {
    this.is = 'contact-form';
    this.properties = {
      recipient: {
        type: String
      }
    };
    // Reset button behavior
    this.handleReset = function(event) {
      let form = Polymer.dom(event).localTarget.parentElement;
      // Reset inputs, checkboxes, and radio buttons
      form.reset();
      // Reset the textarea
      form.querySelector('.output').innerHTML = '';
      // Fire a change event on the form to re-validate
      form.fire('change');
    };
    // Submit button behavior
    this.handleSubmit = function(event) {
      let form = this.$$('form');
      // Check form for validity
      let validForm = form.validate();
      // if the form is in a valid state then submit
      if (validForm) {
        request.url = "http://sedevcore.libercus.net/contact-form"

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
    };
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
    this.querySelector('.output').innerHTML = response;
  }
}

Polymer(ContactForm);
