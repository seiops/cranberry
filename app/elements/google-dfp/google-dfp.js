class GoogleDFP {
    beforeRegister() {
        this.is = 'google-dfp';
        this.properties = {
          route: {
            type: Object,
            observer: 'onRouteChanged'
          },
          adSize: {
            type: Array
          },
          adPos: {
            type: String
          },
          adGroup: {
            type: Number
          },
          adGrouping: {
            type: String
          },
          adSubGrouping: {
            type: String
          }
        };
    }

    onRouteChanged(newValue) {
      console.info('The Route Changed');

      // Get this elements advertisement div
      let advertisement = Polymer.dom(this.root).firstElementChild;
      let idModifier = advertisement.getAttribute('id');

      console.info(advertisement);
      // Establish a global slots object that will house all ads. This is for refreshing ads on content page change.
      window.slots = window.slots || {};

      if (advertisement.firstChild) {
        console.info('Destroying Slot');
        // This advertisement already contains an ad. Refresh this ad slot
        // googletag.pubads().refresh([window.slots[idModifier]]);
        googletag.destroySlots([idModifier]);
        delete window.slots[idModifier];
        console.info(window.slots);
      }

      console.info(newValue);
            console.info(newValue.prefix !== null);
      if(newValue.prefix !== null) {
        this.buildAd(idModifier, newValue);
      }

    }

    buildAd(idModifier, newValue) {
      let adGroup = this.get('adGroup');
      let adGrouping = this.get('adGrouping');
      let adSubGrouping = this.get('adSubGrouping');
      let adSize = this.get('adSize');
      let position = this.get('adPos');

      // Dummy Section Setup. Will be removed after established sections are made
      let parentSection = (newValue.prefix === '/' ? 'frontpage' : 'news');
      let childSection = '';

      console.info('Building a new ad.');
      // This advertisement has no ad inside. Run through setting up ad slot.
      googletag.cmd.push(function() {
        // Establish Global Targeting
        googletag.pubads().setTargeting('section', parentSection);
        googletag.pubads().setTargeting('placement', 'development');
        // Enable googletag services prior to display calls on slots.
        googletag.enableServices();
        // Generate DFP URL for ad using all established variables/config file variables.
        let dfpURL = adGroup + '/' + adGrouping + '/' + adSubGrouping + '/' + parentSection + '/' + (childSection != '' ? childSection + '/' : '') + position;
        // Define slot call for DFP.
        window.slots[idModifier] = googletag.defineSlot(dfpURL, adSize, idModifier).addService(googletag.pubads()).setCollapseEmptyDiv(true);
        // Set Slot Level Targeting
        window.slots[idModifier].setTargeting('position', position);
        //Call to display
        googletag.display(idModifier);
      });
    }

    // Function to setup an ad counter for id distribution
    _adCount() {
      window.adCounter = window.adCounter || 0;
      window.adCounter += 1;
      return '_' + window.adCounter;
    }
  }

Polymer(GoogleDFP);
