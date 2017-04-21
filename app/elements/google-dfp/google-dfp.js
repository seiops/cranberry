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
        this.listeners = {
          'refresh': 'refresh'
        };
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
      if (!hidden) {
        if (typeof dfpObject !== 'undefined' && Object.keys(dfpObject).length > 0) {
          this._setupAdvertisement(dfpObject);
        }
      }
    }

    _setupAdvertisement(dfpObject) {
      this.async(() => {
        let advertisementContainer = this.querySelector('.advertisement');
        let id = advertisementContainer.getAttribute('id');

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
      let adSize = this.get('adSize');
      let adSizeMapping = this.get('adSizeMapping');
      let position = this.get('adPos');
      let content = dfpObject.content;
      let outOfPage = this.get('outOfPage');

      this.async(() => {
        this.logger(`Building ${id} using ${dfpObject.adSection}`, { type: 'build' });

        if (typeof window.slots === 'undefined') {
          window.slots = {};
        }

        if (typeof adSizeMapping !== 'undefined') {
          var mapping;

          if (adSizeMapping === 'leaderboard') {
            mapping = googletag.sizeMapping().
              addSize([0, 0], [320, 50]).
              addSize([400, 400], [[320, 50]]).
              addSize([850, 200], [[728, 90], [300, 50]]).
              addSize([1050, 200], [[970, 250], [970, 90], [728, 90]]).
              build();
          }

          if (adSizeMapping === 'mobileLeader') {
            mapping = googletag.sizeMapping().
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

        googletag.cmd.push(function() {
          googletag.pubads().setTargeting('section', section);
          googletag.pubads().setTargeting('placement', placement);

          if (typeof content !== 'undefined' && content.length > 0) {
            googletag.pubads().setTargeting('content', content);
          }
          
          googletag.enableServices();

          let dfpURL = dfpObject.adSection + '/' + position;

          if (!outOfPage) {
            window.slots[id] = googletag.defineSlot(dfpURL, adSize, id).addService(googletag.pubads()).setCollapseEmptyDiv(true);
          } else {
            window.slots[id] = googletag.defineOutOfPageSlot(dfpURL, id).addService(googletag.pubads()).setCollapseEmptyDiv(true);
          }


          window.slots[id].setTargeting('position', position);

          if (typeof adSizeMapping !== 'undefined') {
            window.slots[id].defineSizeMapping(mapping);
          }

          googletag.display(id);
        });        
      });
    }

    _checkGoogle() {
      setTimeout(() => {
        if (typeof googletag !== 'undefined' && typeof googletag.sizeMapping === 'function') {
          this.set('googleReady', true);
          // this._buildAd(section, parent);
        } else {
          this._checkGoogle();
        }
      }, 50);
    }

    refresh() {
      let slot = this.get('slotId');
      let hidden = this.get('hidden');

      if (!hidden) {
        if (typeof slot !== 'undefined' && slot !== '') {
          this.logger('refreshing: ' + slot);
          googletag.pubads().refresh([window.slots[slot]]);
        }
      }
    }

    destroy() {
      let slot = this.get('slotId');

      if (typeof slot !== 'undefined' && slot !== '') {
        this.logger(`Destorying ${slot}`, { type: 'destroy' });
        googletag.destroySlots([window.slots[slot]]);

        delete window.slots[slot];

        this.set('slotId', '');
        this.set('dfpObject', {});

      }
    }
}

Polymer(GoogleDFP);
