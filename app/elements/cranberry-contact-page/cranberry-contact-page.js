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
      },
      hidden: {
        type: Boolean,
        reflectToAttribute: true,
        value: true,
        observer: '_hiddenChanged'
      },
    }
  }

  _hiddenChanged(hidden, oldHidden) {
    this.async(() => {
      if (typeof hidden !== 'undefined' && !hidden) {
        this._firePageViews();
      }
    });
  }

  _firePageViews() {
    this.async(() => {
      // Send pageview event with iron-signals
      this.fire('iron-signal', {name: 'track-page', data: {path: '/contact'}});

      // Send Chartbeat
      this.fire('iron-signal', {name: 'chartbeat-track-page', data: {path: '/contact'}});

      this.fire('iron-signal', {name: 'page-hit'});

      // Fire Mather
      this.fire('iron-signal', {name: 'mather-hit', data: { data: {'section': 'contact', 'hierarchy': '/contact', 'pageType': 'contact', timeStamp: new Date() } } });

      // Cxense
      this.dispatchEvent(
        new CustomEvent(
          'send-cxense-pageview',
          {
            bubbles: true,
            composed: true,
            detail: {
              location: window.location.href
            }
          }
        )
      );
    });
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
