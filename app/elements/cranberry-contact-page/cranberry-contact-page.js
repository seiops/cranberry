class cranberryContactPage {
  beforeRegister() {
    this.is = 'cranberry-contact-page';
    this.properties = {
      needHelp: {
        type: Object
      },
      footerLinks: {
        type: Object
      },
      noStaff: {
        type: Boolean,
        value: false
      }
    }
  }
}
Polymer(cranberryContactPage);
