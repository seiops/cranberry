class CranberryGoogleAnalytics {
  // element registration
  beforeRegister() {
    this.is = 'cranberry-google-analytics';
    this.properties = {
      gaReady: {
        type: Boolean,
        notify: true,
        value: false,
        reflectToAttribute: true
      },
      trackingId: Array,
      trackerIds: {
        type: Array,
        value : []
      },
      user: {
        type: Object,
        value: {}
      },
      userId: {
          type: String,
          notify: true
      }
    };
    this.listeners = {
      'track-event': 'trackEvent',
      'track-page': 'trackPage',
      'track-timing': 'trackTiming',
      'user-id-changed': 'userIDChanged'
    };
  }

  // public methods

  // attached to document
  attached() {
    console.info('\<cranberry-google-analytics\> attached');
    
    this._checkGoogle();
  }

  _checkGoogle() {
    let el = this;

    setTimeout(function() {
      if (typeof ga !== 'undefined') {
        el._setupGA();

        return;
      } else {
        el._checkGoogle();
      }
    }, 50);
  }

  _setupGA() {
    let trackingArray = this.get('trackingId');

    if (typeof trackingArray !== 'undefined' && trackingArray.length > 0) {
      trackingArray.forEach((value, index) => {
        this._createGA(value.code, index);
      });
    }
    this.async(() => {
      let event = {
        category: 'Cranberry',
        action: 'Loaded',
        nonInteraction: true
      };
    
      // Send pageview event with iron-signals
      this.trackEvent({detail: { event: event } });
      if (typeof window.performance !== 'undefined' && typeof window.performance.timing !== 'undefined') {
        this.trackTiming();
      }

      this.set('gaReady', true);
    });
  }

  _createGA(id, index) {
    this.async(() => {
      let user = this.get('user');
      let trackerId = '';
      let trackerIds = this.get('trackerIds');

      if (index >= 1) {
        trackerId = 'tracker' + index;
      }

      console.info('\<cranberry-google-analytics\> setting tracking for ' + id + ' with trackerId ' + ((trackerId !== '') ? trackerId : 'default'));

      if (trackerId !== '') {
        ga('create', id, 'auto', trackerId);
        trackerIds.push(trackerId);
        this.set('trackerIds', trackerIds);
      } else {
        ga('create', id, 'auto');
      }
      ga('require', 'displayfeatures');
      ga('require', 'eventTracker');
      ga('require', 'outboundLinkTracker');
    });
  }

  trackTiming(e) {
    setTimeout(() => {
      if (typeof ga !== 'undefined') {
        if (typeof window.performance !== 'undefined' && typeof window.performance.timing !== 'undefined') {
          let cranberryBase = Polymer.dom(document).querySelector('cranberry-base');
          let appStartedValue = performance.timing.responseEnd - performance.timing.navigationStart;
          let cranberryBaseAttached = cranberryBase.get('cranberryBaseTiming');
          let trackerIds = this.get('trackerIds');
          let timingVar1 = 'App Started Loading';
          let timingVar2 = 'Cranberry Base Element Attached';

          console.info('\<cranberry-google-analytics\> page timing sent with data on default tracker');
          ga('send', 'timing', 'App Loading', timingVar1, appStartedValue);
          ga('send', 'timing', 'App Loading', timingVar2, cranberryBaseAttached);

          trackerIds.forEach((value, index) => {
            console.info('\<cranberry-google-analytics\> page timing sent with data on ' + value);
            ga( value + '.send', 'timing', 'App Loading', timingVar1, appStartedValue);
            ga( value + '.send', 'timing', 'App Loading', timingVar2, cranberryBaseAttached);
          });
        }
      } else {
          this.trackTiming(e);
        }
      }, 50);
  }

  trackEvent(e) {
    setTimeout(() => {
      if (typeof ga !== 'undefined') {
        let eventDetails = e.detail.event;
        let eventObject = {
          eventCategory: eventDetails.category,
          eventAction: eventDetails.action,
          nonInteraction: (typeof eventDetails.nonInteraction !== 'undefined' && eventDetails.nonInteraction ? true : false)
        };

        let trackerIds = this.get('trackerIds');
        console.info(`\<cranberry-google-analytics\> event ${eventObject.eventCategory} sent with data on default`);
        ga('send', 'event', eventObject.eventCategory, eventObject.eventAction, '', { nonInteraction: eventObject.nonInteraction });
        trackerIds.forEach((value, index) => {
          console.info(`\<cranberry-google-analytics\> event ${eventObject.eventCategory} sent with data on ${value}`);
          ga( value + '.send', 'event', eventObject.eventCategory, eventObject.eventAction, '', { nonInteraction: eventObject.nonInteraction });
        });
      } else {
        this.trackEvent(e);
      }
    }, 50);
  }

  trackPage(e) {
    setTimeout(() => {
      if (typeof ga !== 'undefined') {
        //Use set param, this way if we then send a subsequent event on the page it will be correctly associated with the same page

        if (typeof e !== 'undefined' && typeof e.detail.path !== 'undefined') {
            ga('set', 'page', e.detail.path);
        }
        
        let trackerIds = this.get('trackerIds');

        if(typeof e.detail.data !== 'undefined') {
          console.info('\<cranberry-google-analytics\> pageview sent with data on default tracker');
          ga('send', 'pageview', e.detail.data);
          trackerIds.forEach((value, index) => {
            console.info('\<cranberry-google-analytics\> pageview sent with data on ' + value);
            ga( value + '.send', 'pageview', e.detail.data);
          });
        } else {
          console.info('\<cranberry-google-analytics\> pageview sent on default tracker');
          ga('send', 'pageview');

          trackerIds.forEach((value, index) => {
            console.info('\<cranberry-google-analytics\> pageview sent on ' + value);
            ga( value + '.send', 'pageview');
          });
        }

        console.log('\<cranberry-google-analytics\> pageview object', e.detail.data);
        return;
      } else {
        this.trackPage(e);
      }
    }, 50);
  }

  userIDChanged(e) {
      ga('set', '&uid', this.userId);
  }
}
Polymer(CranberryGoogleAnalytics);