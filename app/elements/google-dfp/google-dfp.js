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
      //Grab new section ads and section elements
      let newSection = document.querySelector('section[data-route="' + newValue + '"]');
      let newSectionAds = [];
      let oldSection = document.querySelector('section[data-route="' + oldValue + '"]');
      let oldSectionAds = [];

      //Establish testing sections
      let sectionInfo = {};
      //TODO Write logic for pulling in site specific from config files.
      //TODO Replace parentSection and childSection with route information from app
      sectionInfo.parentSection = (newValue == 'sample-grid' ? 'frontpage' : 'news');
      sectionInfo.childSection = (newValue == 'sample-grid' ? '' : 'education');

      if (newSection !== null) {
        newSectionAds = newSection.querySelectorAll('.advertisement');
      }

      if (oldSection !== null) {
        oldSectionAds = oldSection.querySelectorAll('.advertisement');
      }

      this._setId(newSectionAds, oldSectionAds);

      var checkGoogleTag = function (thisElement) {
        setTimeout(function () {
          if (googletag.apiReady) {
            thisElement._setup(newSectionAds, sectionInfo);
            return;
          } else {
            checkGoogleTag(this);
          }
        }, 100);
      };

      //prevent running if newSection has no ads
      if (newSection !== null) {
        checkGoogleTag(this);
      }

    }

    _setup(newSectionAds, sectionInfo) {
      //Destroy all googletag ad slots. This will prevent ad units, from the first page in the DOM, from being displayed on page change.
      if (googletag.pubads().$.length > 0) {
        googletag.pubads().clear();
        googletag.destroySlots();
        googletag.pubads().clearTargeting('section');
        googletag.pubads().clearCategoryExclusions();
      }
      //Command Push Function for DFP Slot definition
      googletag.cmd.push(function() {
        //Establish global targeting values and enable googletag services function
        _setGlobalTargeting();

        //Timeout function to check for pubadsReady flag
        var checkPubadsReady = function () {
          setTimeout(function () {
            if (googletag.pubadsReady) {
              _adSetup();
              return;
            } else {
              checkPubadsReady();
            }
          }, 100);
        };
        checkPubadsReady();

        function _adSetup() {
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
        }

      });


      //Define _setGlobalTargeting function
      function _setGlobalTargeting() {
        //Establish Global Targeting
        googletag.pubads().setTargeting("section", sectionInfo.parentSection);
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
        //Generate DFP URL for ad using all established variables/config file variables.
        let dfpURL = adStructure.adGroupID + '/' + adStructure.adGrouping + '/' + adStructure.adSubGrouping + '/' + sectionInfo.parentSection + '/' + (sectionInfo.childSection != '' ? sectionInfo.childSection + '/' : '') + position;
        //Define slot call for DFP.
        let slot = googletag.defineSlot(dfpURL, adSizing, position)
                            .addService(googletag.pubads())
                            .setCollapseEmptyDiv(true);
        //Set Slot Level Targeting
        _setSlotTargeting(slot, position, adSizing);

        //Call to display
        googletag.display(position);
      }

    }

    //Define _setID function
    _setId(newArray, oldArray) {
      //if old array has length remove old ids
      if (oldArray.length > 0) {
        for (let i = 0; i < oldArray.length; i++) {
          //Erase old section ad slots ID
          oldArray[i].setAttribute('id', '');
          //Erase old section ad inner content
          oldArray[i].innerHTML = '';
        }
      }
      //if new array has length add new ids
      if (newArray.length > 0) {
        for (let i = 0; i < newArray.length; i++) {
          //Set current section ad slots to have proper ID for DFP
          newArray[i].setAttribute('id', newArray[i].getAttribute('position'));
        }
      }
    }

  }
Polymer(GoogleDFP);
