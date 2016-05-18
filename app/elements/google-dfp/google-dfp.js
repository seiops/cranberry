class GoogleDFP {
    beforeRegister() {
        this.is = 'google-dfp',
        this.properties = {
          selected: {
            type: String,
            notify: true,
            observer: '_pageChanged'
          }
        };
    }

    ready() {
      //Define app
      let app = document.querySelector('#app');
      //Log DFP has loaded
      app.logger('Finished loading DFP');
    }

    //Observer function for route change.
    //This is for dynamic creation/deletion of ad slots and ID changes for advertisement divs throughout the DOM.
    _pageChanged(newValue, oldValue) {
      console.info(newValue, oldValue);
      //Grab new section ads and section elements
      let newSection = document.querySelector('section[data-route="' + newValue + '"]');
      let newSectionAds = [];
      let oldSection = {};
      let oldSectionAds = [];

      if (newSection !== null) {
        newSectionAds = newSection.querySelectorAll('.advertisement');
        //Check oldValue for undefined, if not undefined grab old section ads and section elements
        if (typeof oldValue !== 'undefined') {
          oldSection = document.querySelector('section[data-route="' + oldValue + '"]');
          oldSectionAds = oldSection.querySelectorAll('.advertisement');
          //Put ID on new Ads
          _setId(newSectionAds, oldSectionAds);
        } else {
          //Put ID on initial page ads
          _setId(newSectionAds, undefined);
        }

        //Define static values for ads. These will idealy be pulled in via site specific config.js files.
        //TODO Write logic for pulling in site specific from config files.
        //TODO Replace parentSection and childSection with route information from app
        var parentSection = (newValue == 'sample-grid' ? 'frontpage' : 'news'),
            childSection = (newValue == 'sample-grid' ? '' : 'education');

        function checkGoogleTag() {
          if (googletag.apiReady) {
            initDFP();
          }
        }
        setTimeout(checkGoogleTag, 50);
      }

      /* INNER FUNCTION SCRIPTS */
      function initDFP() {
        //Destroy all googletag ad slots. This will prevent ad units, from the first page in the DOM, from being displayed on page change.
        googletag.destroySlots();

        //Empty old pages ads.
        if (oldSectionAds.length !== 0) {
          //empty old divs
          for (let i = 0; i < oldSectionAds.length; i++) {
            oldSectionAds[i].innerHTML = '';
          }
        }
        //Command Push Function for DFP Slot definition
        googletag.cmd.push(function() {
          //Establish global targeting values and enable googletag services function
          _setGlobalTargeting();
          //Iterate through newSectionAds (current section from route)
          for (let i = 0; i < newSectionAds.length; i++) {
            //Switch on positions creating slots for ads.
            switch(newSectionAds[i].getAttribute('position')) {
              case 'top_of_stream':
                _setupSlot('top_of_stream', adStructure.top_of_stream.adSize);
                break;
              case 'middle_of_stream':
                _setupSlot('middle_of_stream', adStructure.middle_of_stream.adSize);
                break;
              case 'bottom_of_stream':
                _setupSlot('bottom_of_stream', adStructure.bottom_of_stream.adSize);
                break;
              case 'pencil_pushdown':
                _setupSlot('pencil_pushdown', adStructure.pencil_pushdown.adSize);
                break;
              case 'leaderboard_bottom':
                _setupSlot('leaderboard_bottom', adStructure.leaderboard_bottom.adSize);
                break;
            }
          }
        });
      }
      //Define _setGlobalTargeting function
      function _setGlobalTargeting() {
        //All global level services and tags will go within this function

        //Establish Global Targeting
        googletag.pubads().setTargeting("Section", app.route);
        //Enable googletag services prior to display calls on slots.
        googletag.enableServices();
      }
      //Define _setSlotTargeting function
      function _setSlotTargeting(slot, position, adSizing) {
        //Passed in targeting or generic targeting
        slot.setTargeting('position', position);
        //Slot level targeting can also be established against the slot variable
        /* EX:
          if (position == 'bottom_of_stream' && app.route == 'frontpage') {
            slot.setTargeting('myKey', 'myValue');
          }
        */
      }
      //Define _setupSlot function
      function _setupSlot(position, adSizing) {
        //All slot level definitions will go within this function

        //Generate DFP URL for ad using all established variables/config file variables.
        let dfpURL = adStructure.adGroupID + '/' + adStructure.adGrouping + '/' + adStructure.adSubGrouping + '/' + parentSection + '/' + (childSection != '' ? childSection + '/' : '') + position;
        //Define slot call for DFP.
        let slot = googletag.defineSlot(dfpURL, adSizing, position)
                            .addService(googletag.pubads())
                            .setCollapseEmptyDiv(true);
        //Set Slot Level Targeting
        _setSlotTargeting(slot, position, adSizing);

        //Call to display
        googletag.display(position);
      }
      //Define _setID function
      function _setId(newArray, oldArray) {
        //Check for undefined on oldArray
        if (typeof oldArray !== 'undefined') {
          //Do both arrays
          for (let i = 0; i < newArray.length; i++) {
            //Set current section ad slots to have proper ID for DFP
            newArray[i].setAttribute('id', newArray[i].getAttribute('position'));
          }
          //Remove ID on old ads
          for (let i = 0; i < oldArray.length; i++) {
            //Erase old section ad slots ID
            oldArray[i].setAttribute('id', '');
          }
        } else {
          //Set initial Load for this current page (initial page load / refresh)
          for (let i = 0; i < newArray.length; i++) {
            //Set current section ad slots to have proper ID for DFP
            newArray[i].setAttribute('id', newArray[i].getAttribute('position'));
          }
        }
      }

    }

  }
Polymer(GoogleDFP);
