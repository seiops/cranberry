class ContactForm {
  // handleResponse (data) {
  //   var restResponse = JSON.parse(data.detail.Result);
  //
  //   console.dir(restResponse);
  //   var responseMessage = '';
  //
  //   if (typeof restResponse !== undefined && restResponse.errorCode === 0) {
  //
  //     var params = {
  //         provider:restResponse.loginProvider,
  //         callback: this._onlogin(data),
  //         UID: restResponse.UID,
  //         UIDSignature: restResponse.UIDSignature,
  //         signatureTimestamp: restResponse.signatureTimestamp
  //     };
  //
  //     restResponse.callback = this._onlogin(data);
  //
  //
  //     gigya.socialize.getUserInfo(params);
  //
  //     responseMessage = 'User: ' + restResponse.profile.nickname + '<br />UID: ' + restResponse.UID + '<br />Signature: ' + restResponse.UIDSignature + '<br />Provider: ' + restResponse.loginProvider;
  //   } else {
  //     responseMessage = restResponse.errorDetails;
  //   }
  //
  //
  //   form.querySelector('.output').innerHTML = responseMessage;
  // }

  // _submit(event) {
  //   request.url = "http://sedevcore.libercus.net/gigya"
  //
  //   var params = {};
  //
  //   params.request = "login";
  //   params.loginID = form.loginID.value;
  //   params.password = form.password.value;
  //
  //   request.params = params;
  //
  //   request.generateRequest();
  // }

  beforeRegister() {
    this.is = 'contact-form';
    this.properties = {
      items: {
        type: Object,
        notify: true
      }
    };
    this.handleReset = function(event) {
      var form = Polymer.dom(event).localTarget.parentElement;
      form.reset();
      form.querySelector('.output').innerHTML = '';
    };
    this.handleSubmit = function(event) {
      let form = this.$$('form');
      console.info(form);
      request.url = "http://sedevcore.libercus.net/contact-form"

      var params = {};

      params.request = "submit";
      params.fullname = form.name.value;
      params.email = form.email.value;
      params.address = form.address.value;
      params.telephone = form.telephone.value;
      params.captcha = '';
      params.message = form.message.value;

      params.recipient = 'mjohnstone@standard.net';

      request.params = params;

      request.generateRequest();
    };
  }
  ready() {
  }

  handleResponse (data) {
    console.info(data);
  }


}

Polymer(ContactForm);
