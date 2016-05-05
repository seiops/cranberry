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
      let newSectionAds = newSection.querySelectorAll('.advertisement');
      let oldSection = {};
      let oldSectionAds = [];
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
      //TODO Replace adStructure with object from site specific config.js files
      //TODO Replace parentSection and childSection with route information from app
      var parentSection = (newValue == 'home' ? 'frontpage' : 'news'),
          childSection = (newValue == 'home' ? '' : 'education'),
          adStructure = {
            adGroupID: 30103046,
            adGrouping: 'Ogden_Publisher',
            adSubGrouping: 'Standard_Examiner',
            top_of_stream: {
              adSize: [[300,250],[300,600]]
            },
            middle_of_stream: {
              adSize: [300,250]
            },
            bottom_of_stream: {
              adSize: [300,250]
            },
            pencil_pushdown: {
              adSize: [970,30]
            }
          };
      function checkGoogleTag() {
        if (googletag.apiReady) {
          initDFP();
        }
      }
      setTimeout(checkGoogleTag, 50);

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
          }
        }
      }
      //Define _setupSlot function
      function _setupSlot(position, adSizing) {
        //Generate DFP URL for ad using all established variables.
        let dfpURL = adStructure.adGroupID + '/' + adStructure.adGrouping + '/' + adStructure.adSubGrouping + '/' + parentSection + '/' + (childSection != '' ? childSection + '/' : '') + position;
        //Async googletag push command to set adunit
        googletag.cmd.push(function() {
          //scope variable to not trample defined slots.
          let slot = googletag.defineSlot(dfpURL, adSizing, position)
                     .addService(googletag.pubads())
                     .setCollapseEmptyDiv(true);
          googletag.enableServices();
          googletag.display(position);
        });
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
