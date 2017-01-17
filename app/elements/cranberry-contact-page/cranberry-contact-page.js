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
  
  attached() {
    // Send pageview event with iron-signals
    this.fire('iron-signal', {name: 'track-page', data: { path: '/contact' } });

    // Send Chartbeat
    this.fire('iron-signal', {name: 'chartbeat-track-page', data: { path: '/contact' } });
  }
  _openLink(event, detail) {
    let iFrame = document.createElement('iframe');

    iFrame.src = event.model.item.linkUrl;
    iFrame.height = '95%';
    iFrame.width = '100%';

    let modal = Polymer.dom(document).querySelector('cranberry-base').querySelector('#globalModal');

    let modalContent = Polymer.dom(modal).querySelector('paper-dialog-scrollable').querySelector('#scrollable').querySelector('.content-area');

    modalContent.appendChild(iFrame);

    modal.open();
    modal.refit();
  }

}
Polymer(cranberryContactPage);
