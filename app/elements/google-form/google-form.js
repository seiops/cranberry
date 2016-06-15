class googleForm {
  beforeRegister() {
    this.is = 'google-form';
    this.properties = {
      url: {
        type: String,
        observer: 'urlChanged'
      }
    };
  }

  urlChanged() {
    console.info(this.url);
  }
}
Polymer(googleForm);
