class cranberryChartBeat {
  beforeRegister() {
    this.is = 'cranberry-chart-beat';
    this.properties = {
      author: {
        type: String
      },
      chartbeatLoaded: {
        type: Boolean,
        value: false
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
            'data': {
              'uid': 0,
              'domain': '',
              'useCanonical': true,
              'authors': ''
            }
          };
        },
        notify: true
      },
      initialLoad: {
        type: Boolean,
        value: true
      }
    }
    this.observers = [
      '_configChanged(sfConfig.data.*)'
    ];
    this.listeners = {
      'chartbeat-track-page': 'trackPage'
    };
  }

  trackPage(e) {
    let load = this.get('initialLoad');

    this.async(() => {
      if (load) {
        this._setupConfig(e.detail);
        this.set('initialLoad', false);
        this._establishGlobal();
        this._loadChartBeat();
        this.trackPage(e);
      } else {
        let config = this.get('sfConfig.data');

        if (typeof e.detail.data !== 'undefined' && typeof e.detail.data.authors !== 'undefined') {
          config.authors = e.detail.data.authors;
        }
        
        if (typeof e.detail.data !== 'undefined' && typeof e.detail.data.sections !== 'undefined') {
          config.sections = e.detail.data.sections;
        }

        this.set('sfConfig.data', config);
        this._establishGlobal();
        this._fireVirtualPage(e.detail.path);
      }
    });
  }

  _setupConfig(details) {
    let config = this.get('sfConfig.data');

    config.uid = this.get('uid');
    config.domain = this.get('siteName');
    
    if (typeof details.data !== 'undefined' && typeof details.data.authors !== 'undefined') {
      config.authors = details.data.authors;
    }
    
    if (typeof details.data !== 'undefined' && typeof details.data.sections !== 'undefined') {
      config.sections = details.data.sections;
    }
    
    this.set('sfConfig.data', config);
  }

  _configChanged(newConfig, oldConfig) {
    // console.log('Config changed');
    // console.dir(newConfig);
  }

  _establishGlobal() {
    let _sf_async_config = (window._sf_async_config = window._sf_async_config || {});
    let config = this.get('sfConfig.data');

    Object.assign(_sf_async_config, config);
  }

  _loadChartBeat() {
    let chartbeatLoaded = this.get('chartbeatLoaded');

    if (!chartbeatLoaded) {
      window._sf_endpt = (new Date()).getTime();
    
      let loader = document.querySelector('cranberry-script-loader');

      loader.loadScript('http://static.chartbeat.com/js/chartbeat.js');

      this.set('chartbeatLoaded', true);
    }
  }

  _fireVirtualPage(path) {
    let superflyPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        if (typeof window.pSUPERFLY !== 'undefined' && typeof window.pSUPERFLY.virtualPage !== 'undefined') {
          resolve(true);
        }
      }, 50);
    });

    superflyPromise.then((value) => {
      console.info('\<cranberry-chart-beat\> pageview sent');
        let title = Polymer.dom(document).querySelector('title').innerText;

        window.pSUPERFLY.virtualPage(path, title);
    });
  }

}
Polymer(cranberryChartBeat);
