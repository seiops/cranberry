class GoogleDFP {
    beforeRegister() {
        this.is = 'google-dfp';
        this.properties = {
          route: {
            type: Object,
            notify: true
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
        this.observers = ['_onRouteChanged(route)'];
    }

    _onRouteChanged() {
      let route = this.get('route');

      if (Object.keys(route).length !== 0 && route.constructor === Object) {
        // Get Current Section Element for processing ads
        // var currentSectionEl = document.querySelector('section.iron-selected');
        let pages = document.querySelector('iron-pages');
        let currentSectionEl = pages.selectedItem;


        // Get this elements advertisement div
        let advertisement = Polymer.dom(this.root).firstElementChild;

        // Get this ads ID
        var idModifier = advertisement.getAttribute('id');

        // Dummy Section Setup. Will be removed after established sections are made
        var parentSection = (this.route.path === '/sample-grid' ? 'frontpage' : 'news');
        var childSection = '';

        // Get passed in values from google-dfp element
        let adGroup = this.get('adGroup');
        let adGrouping = this.get('adGrouping');
        let adSubGrouping = this.get('adSubGrouping');
        let adSize = this.get('adSize');
        let position = this.get('adPos');

        // Establish a global slots object that will house all ads. This is for refreshing ads on content page change.
        window.slots = window.slots || {};

        if (currentSectionEl.contains(advertisement)) {
          // The currently routed section has this advertisement in it
          if (this.querySelector('.advertisement').firstChild) {
            // This advertisement already contains an ad. Refresh this ad slot
            googletag.pubads().refresh([window.slots[idModifier]]);
          } else {
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
              slots[idModifier].setTargeting('position', position);
              //Call to display
              googletag.display(idModifier);
            });
          }
        }
      }

    }

    // Function to setup an ad counter for id distribution
    _adCount() {
      window.adCounter = window.adCounter || 0;
      window.adCounter += 1;
      return '_' + window.adCounter;
    }
  }

Polymer(GoogleDFP);
