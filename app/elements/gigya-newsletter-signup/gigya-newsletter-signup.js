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
      user: Object
    }
  }
}
Polymer(GigyaNewsletterSignup);
