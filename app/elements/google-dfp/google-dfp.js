class GoogleDFP {
    beforeRegister() {
        this.is = 'google-dfp';
        this.properties = {
          adPath: String,
          adPresent: {
            type: Boolean,
            value: false
          },
          adEstablished: {
            type: Boolean,
            value: false
          },
          adSize: Array,
          adSizeMapping: String,
          adPos: String,
          dfpObject: Object,
          googleReady: {
            type: Boolean,
            value: false
          },
          shareThrough: {
            type: Boolean,
            value: false
          },
          shareThroughId: {
            type: String
          },
          slotId: {
            type: String,
            value: ''
          },
          tags: String,
          outOfPage: {
            type: Boolean,
            value: false
          },
          hidden: {
            type: Boolean,
            reflectToAttribute: true,
            value: true
          },
          previousPath: {
            type: String,
            value: ''
          }
        };
        this.observers = [
          '_adPathChanged(dfpObject, hidden)'
        ];
    }

    attached() {
    }

    detached() {
      this.destroy();
    }

    logger(text, payload) {
      let color = '#000';

      if (typeof payload !== 'undefined') {
        switch (payload.type) {
          case 'destroy':
            color = '#8C1F00';
            break;
          case 'build':
            color = '#E34213';
            break;
        }
      }

      console.info('\<google-dfp\> %c' + text, 'background: #FF8F6E; color: ' + color + '; display: block;');
    }

    _adPathChanged(dfpObject, hidden) {
      //console.log("_adPathChanged",dfpObject);
      if (!hidden) {
        if (typeof dfpObject !== 'undefined' && Object.keys(dfpObject).length > 0) {
          let googleTagDefined = new Promise(
            function(resolve, reject) {
              function timeoutFunction() {
                setTimeout(() => {
                  if (typeof googletag !== 'undefined' && typeof googletag.apiReady !== 'undefined' && googletag.apiReady) {
                    resolve(true);
                    return;
                  } else {
                    timeoutFunction();
                  }
                }, 50);
              }
              timeoutFunction();
            }
          );
          googleTagDefined.then((val) => {
              this._setupAdvertisement(dfpObject);
          });
        }
      }
    }

    _setupAdvertisement(dfpObject) {
      //console.log("_setupAdvertisement",dfpObject);
      this.async(() => {
        let adPos = this.get('adPos');
        let id = adPos + this._adCount();
        let advertisementContainer = Polymer.dom(this.root).querySelector('.advertisement');
        advertisementContainer.setAttribute('id', id);
        this.set('slotId', id);
        this._buildAdvertisement(dfpObject, id);
      });
    }

    _adCount() {
      window.adCounter = window.adCounter || 0;
      window.adCounter += 1;

      this.set('adEstablished', true);

      return '_' + window.adCounter;
    }

    _buildAdvertisement(dfpObject, id) {
      //console.info('_buildAdvertisement',dfpObject);
      
        if(!window.AdBridgInit){
          window.AdBridgInit = true;
          
          let splitAdPath = dfpObject.adSection.split('/');
          let section = (splitAdPath.length > 0 && splitAdPath.length === 5 ? splitAdPath[4] : splitAdPath[3]);
          let content = dfpObject.content;
          let placement = dfpObject.placement;
          
          AdBridg.cmd.push(() => {
            googletag.pubads().setTargeting('section', section);
            googletag.pubads().setTargeting('placement', placement);

            if (typeof content !== 'undefined' && content.length > 0) {
              googletag.pubads().setTargeting('content', content);
            }
          });
        }
      
        AdBridg.cmd.push(() => {
          let adSize = this.get('adSize');
          let adSizeMapping = this.get('adSizeMapping');
          let position = this.get('adPos');
          let content = dfpObject.content;
          let outOfPage = this.get('outOfPage');
          
          console.info('_buildAdvertisement::', position + ' - ' + adSize);

          this.logger(`Building ${id} using ${dfpObject.adSection}`, { type: 'build' });

          if (typeof window.slots === 'undefined') {
            window.slots = {};
          }

          if (typeof adSizeMapping !== 'undefined') {
            var mapping;

            if (adSizeMapping === 'leaderboard') {
              mapping = AdBridg.sizeMapping().
                addSize([0, 0], [320, 50]).
                addSize([400, 400], [[320, 50]]).
                addSize([850, 200], [[728, 90], [300, 50]]).
                addSize([1050, 200], [[970, 250], [970, 90], [728, 90]]).
                build();
            }

            if (adSizeMapping === 'mobileLeader') {
              mapping = AdBridg.sizeMapping().
                addSize([0, 0], [300, 250]).
                addSize([400, 400], [[300, 250]]).
                addSize([850, 200], [[728, 90], [300, 50]]).
                addSize([1050, 200], [[970, 250], [970, 90], [728, 90], [1,1]]).
                build();
            }
          }

          let splitAdPath = dfpObject.adSection.split('/');
          let section = (splitAdPath.length > 0 && splitAdPath.length === 5 ? splitAdPath[4] : splitAdPath[3]);
          let host = window.location.hostname;
          let placement = dfpObject.placement;

          let dfpURL = dfpObject.adSection + '/' + position;

          if (!outOfPage) {
            window.slots[id] = AdBridg.defineSlot(dfpURL, adSize, id).setCollapseEmptyDiv(true);
          } else {
            window.slots[id] = AdBridg.defineOutOfPageSlot(dfpURL, id).setCollapseEmptyDiv(true);
          }

          window.slots[id].setTargeting('position', position);

          if (typeof adSizeMapping !== 'undefined') {
            window.slots[id].defineSizeMapping(mapping);
            AdBridg.useSizeMapping(window.slots[id], mapping);
          }

          AdBridg.display(id);
          AdBridg.serve();
        });
    }

    destroy() {
      let slot = this.get('slotId');

      if (typeof slot !== 'undefined' && slot !== '') {
        this.logger(`Destorying ${slot}`, { type: 'destroy' });
        AdBridg.destroySlots([window.slots[slot]]);

        delete window.slots[slot];

        this.set('slotId', '');
        this.set('dfpObject', {});

      }
    }

    refresh() {
       this.async(() => {
         let hidden = this.get('hidden');
         if (!hidden) {
           let advertisement = Polymer.dom(this.root).querySelector('.advertisement');
           let slot = advertisement.getAttribute('id');
 
           if (advertisement !== null && typeof advertisement !== 'undefined' && typeof slot !== 'undefined' && slot !== null) {
             console.info('\<google-dfp\> refreshing: ' + slot);
             AdBridg.refresh([window.slots[slot]]);
           }
         }
       });
     }
}

Polymer(GoogleDFP);
