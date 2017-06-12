class CranberryBrowserDetection {
  beforeRegister() {
    this.is = 'cranberry-browser-detection';
    this.properties = {
      browser: {
        type: Object,
        value: function() {
          return {};
        },
        observer: '_browserChanged'
      },
      chromeVersion: {
        type: String,
        value: '56'
      },
      edgeVersion: {
        type: String,
        value: '14'
      },
      firefoxVersion: {
        type: String,
        value: '51'
      },
      operaVersion: {
        type: String,
        value: '43'
      },
      safariVersion: {
        type: String,
        value: '8'
      }
    }
  }

  // Lifecycle callback methods
  ready() {
    console.info('\<cranberry-browser-detection\> ready');
  }

  attached() {
    console.info('\<cranberry-browser-detection\> attached');
    
    let browserModal = Polymer.dom(this.root).querySelector('#browserDetectionModal');

      browserModal.addEventListener('opened-changed', function() {
        if(browserModal.opened) {
          Polymer.IronDropdownScrollManager.pushScrollLock(browserModal);
        } else {
          Polymer.IronDropdownScrollManager.removeScrollLock(browserModal);
        }
      });

      browserModal.open();
  }

  detached() {
    console.info('\<cranberry-browser-detection\> detached');
  }

  // Public Methods


  // Private Methods
  _checkBorder(desktop) {
    if (typeof desktop !== 'undefined' && desktop) {
      return 'border';
    }
  }

  _browserChanged(browser, oldBrowser) {
    // this.async(() => {
    //   if (Object.keys(browser).length > 0) {
    //     let supportedBrowserVersion = '';
    //     let currentBrowserVersion = browser.version;

    //     switch(browser.name) {
    //       case 'Chrome':
    //         supportedBrowserVersion = this.get('chromeVersion');
    //         this._handleOpen(supportedBrowserVersion, currentBrowserVersion);
    //         break;
    //       case 'Firefox':
    //         supportedBrowserVersion = this.get('firefoxVersion');
    //         this._handleOpen(supportedBrowserVersion, currentBrowserVersion);
    //         break;
    //       case 'Safari':
    //         supportedBrowserVersion = this.get('safariVersion');
    //         this._handleOpen(supportedBrowserVersion, currentBrowserVersion);
    //         break;
    //       case 'Edge':
    //         supportedBrowserVersion = this.get('edgeVersion');
    //         this._handleOpen(supportedBrowserVersion, currentBrowserVersion);
    //         break;
    //       case 'Opera':
    //         supportedBrowserVersion = this.get('operaVersion');
    //         this._handleOpen(supportedBrowserVersion, currentBrowserVersion);
    //         break;
    //     }
    //   }
    // })
  }

  _handleOpen(supportedBrowserVersion, currentBrowserVersion) {

    if (currentBrowserVersion < supportedBrowserVersion) {
      let browserModal = Polymer.dom(this.root).querySelector('#browserDetectionModal');

      browserModal.addEventListener('opened-changed', function() {
        if(browserModal.opened) {
          Polymer.IronDropdownScrollManager.pushScrollLock(browserModal);
        } else {
          Polymer.IronDropdownScrollManager.removeScrollLock(browserModal);
        }
      });

      browserModal.open();
    }
  }
}

Polymer(CranberryBrowserDetection);