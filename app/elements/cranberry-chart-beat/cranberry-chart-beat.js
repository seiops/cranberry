class cranberryChartBeat {
  beforeRegister() {
    this.is = 'cranberry-chart-beat';
    this.properties = {
      author: {
        type: String
      },
      uid: {
        type: Number
      },
      siteName: {
        type: String
      },
      route: {
        type: Object
      },
      sfConfig: {
        type: Object,
        value: () => {
          return {
            'uid': 0,
            'domain': '',
            'useCanonical': true,
            'authors': ''
          };
        }
      },
      authorSet: {
        type: Boolean,
        value: false,
        observer: '_authorSet'
      }
    }
    this.observers = [
      '_updateConfig(author, uid, siteName, route.path)',
      '_configChanged(sfConfig.*)'
    ]
  }

  // SETUP GLOBAL CONFIG OBJECT
  // ANYTIME THAT OBJECT CHANGES CHECK IF INITIAL LOAD HAPPENED (GLOBAL BOOLEAN)
  // IF IT DID SEND VIRTUAL IF NOT ESTABLISH LOAD


  _updateConfig(author, uid, siteName, path) {
    this.async(() => {
console.log('SETTING UP CONFIG!');
      if (typeof author !== 'undefined' && typeof uid !== 'undefined' && typeof siteName !== 'undefined' && typeof path !== 'undefined') {
        this.set('sfConfig', {});
        let config = {};

        // Setup default chartbeat object
        config.uid = uid;
        config.domain = siteName;
        config.authors = author;
        config.sections = path;

        this.set('sfConfig', config);
      }
    });
      
  }

  _configChanged(newValue) {
    console.log('Config object changed!');
    console.dir(newValue);
  }

  _setupSection(path) {

  }

  _changeAuthors(authors) {
    if (typeof authors !== 'undefined') {
      this.set('sfConfig.authors', authors);
    }
  }

  // _loadChartbeat() {
  //   _sf_endpt=(new Date()).getTime();
    
  //   let loader = document.querySelector('cranberry-script-loader');

  //   loader.loadScript('http://static.chartbeat.com/js/chartbeat.js');
    
  // }

  // _authorSet(newValue, oldValue) {
  //   if (typeof newValue !== 'undefined' && newValue) {
  //     this._loadChartbeat();
  //   }
  // }

  // _fireVirtualPage() {
  //   if (typeof window.pSUPERFLY !== 'undefined' && typeof window.pSUPERFLY.virtualPage !== 'undefined') {
  //     let route = this.get('route');
  //     let title = Polymer.dom(document).querySelector('title').innerText;

  //     window.pSUPERFLY.virtualPage(route.path, title);
  //   }
  // }

}
Polymer(cranberryChartBeat);
