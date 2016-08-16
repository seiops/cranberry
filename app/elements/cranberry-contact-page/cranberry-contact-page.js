class cranberryContactPage {
  beforeRegister() {
    this.is = 'cranberry-contact-page';
    this.properties = {
      needHelp: {
        type: Object
      }
    }
  }

  attached() {
    let help = this.get('needHelp');
    console.info(help);
  }
}
Polymer(cranberryContactPage);
