class CranberryBrowserDetection {
  beforeRegister() {
    this.is = 'cranberry-browser-detection';
    this.properties = {
      browser: {
        type: Object,
        value: function() {
          return {};
        }
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
      gaReady: {
        type: Boolean,
        reflectToAttribute: true
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
    this.observers = ['_checkBrowser(browser, gaReady)']
  }

  // Lifecycle callback methods
  ready() {
    console.info('\<cranberry-browser-detection\> ready');
  }

  attached() {
    console.info('\<cranberry-browser-detection\> attached');
  }

  detached() {
    console.info('\<cranberry-browser-detection\> detached');
  }

  // Public Methods


  // Private Methods
  _checkCookie(browser) {
    let browserWarn = this._getCookie('browserWarn');
    if (browserWarn === '') {
      let supportedBrowserVersion = '';
      let currentBrowserVersion = browser.version;

      switch(browser.name) {
        case 'Chrome':
          supportedBrowserVersion = this.get('chromeVersion');
          this._handleOpen(supportedBrowserVersion, currentBrowserVersion);
          break;
        case 'Firefox':
          supportedBrowserVersion = this.get('firefoxVersion');
          this._handleOpen(supportedBrowserVersion, currentBrowserVersion);
          break;
        case 'Safari':
          supportedBrowserVersion = this.get('safariVersion');
          this._handleOpen(supportedBrowserVersion, currentBrowserVersion);
          break;
        case 'Edge':
          supportedBrowserVersion = this.get('edgeVersion');
          this._handleOpen(supportedBrowserVersion, currentBrowserVersion);
          break;
        case 'Opera':
          supportedBrowserVersion = this.get('operaVersion');
          this._handleOpen(supportedBrowserVersion, currentBrowserVersion);
          break;
      }
    }
  }

  _getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return '';
  }

  _setCookie(cname, cvalue, exdays) {
    let d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

  _checkBorder(desktop) {
    if (typeof desktop !== 'undefined' && desktop) {
      return ' border';
    } else {
      return '';
    }
  }

  _checkBrowser(browser, gaReady) {
    this.async(() => {
      if (Object.keys(browser).length > 0 && gaReady) {
        this._checkCookie(browser);
      }
    });
  }

  _handleOpen(supportedBrowserVersion, currentBrowserVersion) {

    if (currentBrowserVersion < supportedBrowserVersion) {
      this._setCookie('browserWarn', true, 7);
      let browserModal = Polymer.dom(this.root).querySelector('#browserDetectionModal');

      browserModal.addEventListener('opened-changed', function() {
        if(browserModal.opened) {
          Polymer.dom(document.body).classList.add('no-scroll');
        } else {
          Polymer.dom(document.body).classList.remove('no-scroll');
        }
      });

      browserModal.open();

      this.async(() => {
        let event = {
          category: 'Browser Version Detection',
          action: 'Version_Detection_Displayed'
        };
    
        // Send pageview event with iron-signals
        this.fire('iron-signal', {name: 'track-event', data: { event } });

        console.info('\<cranberry-browser-detection\> Browser Version Event Sent');
      });
    }
  }
}

Polymer(CranberryBrowserDetection);