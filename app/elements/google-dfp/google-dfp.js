class GoogleDFP {
    beforeRegister() {
        this.is = 'google-dfp';
        this.properties = {
            section: {
                type: String,
                observer: '_sectionChanged'
            },
            sectionParent: String,
            adElementReady: {
              type: Boolean,
              value: false
            },
            adSize: Array,
            adSizeMapping: String,
            adPos: String,
            adGroup: Number,
            adGrouping: String,
            adSubGrouping: String,
            shareThrough: {
              type: Boolean,
              value: false
            },
            shareThroughId: {
              type: String
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
            }
        };
        this.listeners = {
          'refresh': 'refresh'
        };
    }

<<<<<<< HEAD
    _buildAd(idModifier) {
      this.async(function() {
=======

    _buildAd() {
      this.async(() => {
        let advertisement = Polymer.dom(this.root).querySelector('.advertisement');
        let idModifier = advertisement.getAttribute('id');
        let parentSection = section;
>>>>>>> development
        let childSection = '';
        let adGroup = this.get('adGroup');
        let adGrouping = this.get('adGrouping');
        let adSubGrouping = this.get('adSubGrouping');
        let adSize = this.get('adSize');
        let adSizeMapping = this.get('adSizeMapping');
        let position = this.get('adPos');
        let section = this.get('section');
        let adSection = section.replace(/-/g, '_').replace(/\&/g, '').replace(/\s+/g, '_');
        let sectionParent = this.get('sectionParent');
        let tags = this.get('tags');
        let outOfPage = this.get('outOfPage');

        // Logical statement to make default section news if no section is provided
        // This is mainly a provision for gallery pages that do not have a section by default
        if (typeof adSection === 'undefined' || adSection.length === 0) {
          adSection = 'news';
        }

        if (typeof sectionParent !== 'undefined' && sectionParent.length > 0) {
          let parent = sectionParent.replace(/-/g, '_').replace(/\&/g, '').replace(/\s+/g, '_');

          adSection = parent + '/' + adSection;
        }

        window.slots = window.slots || {};
        if (Polymer.dom(this.root).querySelector('.advertisement').firstChild) {
          googletag.destroySlots([window.slots[idModifier]]);
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


        googletag.cmd.push(function() {
            googletag.pubads().setTargeting('section', adSection);
            googletag.pubads().setTargeting('placement', 'development');
            if (typeof tags !== 'undefined') {
              googletag.pubads().setTargeting('content', tags);
            }
            googletag.enableServices();

            let dfpURL = adGroup + '/' + adGrouping + '/' + adSubGrouping + '/' + adSection + '/' + position;

            if (!outOfPage) {
              window.slots[idModifier] = googletag.defineSlot(dfpURL, adSize, idModifier).addService(googletag.pubads()).setCollapseEmptyDiv(true);
            } else {
              window.slots[idModifier] = googletag.defineOutOfPageSlot(dfpURL, idModifier).addService(googletag.pubads()).setCollapseEmptyDiv(true);
            }


            window.slots[idModifier].setTargeting('position', position);

            if (typeof adSizeMapping !== 'undefined') {
              slots[idModifier].defineSizeMapping(mapping);
            }

            googletag.display(idModifier);
        });
      });
    }

    _checkGoogle() {
<<<<<<< HEAD
      let adElementReady = this.get('adElementReady');
      setTimeout(() => {
        if (typeof googletag !== 'undefined' && typeof googletag.pubads === 'function' && typeof googletag.sizeMapping === 'function' && adElementReady) {
          let advertisement = Polymer.dom(this.root).querySelector('.advertisement');
          let id = advertisement.getAttribute('id');

          this._buildAd(id);
          return;
        } else {
          this._checkGoogle();
        }
      }, 50);
=======

      let dfpPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
          if (typeof googletag !== 'undefined' && typeof googletag.sizeMapping === 'function') {
            resolve(true);
          }
        }, 50);
      });

      dfpPromise.then((value) => {
        this._buildAd();
      });
>>>>>>> development
    }

    _sectionChanged(section) {
      if (typeof section === 'undefined') {
        this.set('section', 'homepage');
      }

      this._checkGoogle();
    }

    _adCount() {
        window.adCounter = window.adCounter || 0;
        window.adCounter += 1;

        this.set('adElementReady', true);

        return '_' + window.adCounter;
    }

    refresh() {
      let hidden = this.get('hidden');

      if (!hidden) {
        let advertisement = Polymer.dom(this.root).firstElementChild;
        let slot = advertisement.getAttribute('id');

        if (advertisement !== null && typeof advertisement !== 'undefined' && typeof slot !== 'undefined' && slot !== null) {
          googletag.pubads().refresh([window.slots[slot]]);
        }
      }
      
    }
}

Polymer(GoogleDFP);
