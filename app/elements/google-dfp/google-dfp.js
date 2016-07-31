class GoogleDFP {
    beforeRegister() {
        this.is = 'google-dfp';
        this.properties = {
            section: {
                type: String,
                observer: '_sectionChanged'
            },
            sectionParent: {
                type: String
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

    _buildAd(section) {
        this.async(function() {
            let advertisement = Polymer.dom(this.root).firstElementChild;
            let idModifier = advertisement.getAttribute('id');
            let parentSection = section;
            let childSection = '';
            let adGroup = this.get('adGroup');
            let adGrouping = this.get('adGrouping');
            let adSubGrouping = this.get('adSubGrouping');
            let adSize = this.get('adSize');
            let position = this.get('adPos');
            let adSection = section.replace(' ', '_').replace('-', '_');
            let sectionParent = this.get('sectionParent');

            if (typeof sectionParent !== 'undefined' && sectionParent.length > 0) {
                let parent = sectionParent.replace(' ', '_').replace('-', '_');

                adSection = parent + '/' + adSection;
            }

            window.slots = window.slots || {};
            if (Polymer.dom(this.root).querySelector('.advertisement').firstChild) {
                googletag.destroySlots([window.slots[idModifier]]);
            }

            googletag.cmd.push(function() {
                googletag.pubads().setTargeting('section', parentSection);
                googletag.pubads().setTargeting('placement', 'development');
                googletag.enableServices();

                let dfpURL = adGroup + '/' + adGrouping + '/' + adSubGrouping + '/' + adSection + '/' + position;

                window.slots[idModifier] = googletag.defineSlot(dfpURL, adSize, idModifier).addService(googletag.pubads(

                )).setCollapseEmptyDiv(true);
                slots[idModifier].setTargeting('position', position);
                googletag.display(idModifier);
            });
        });
    }

    _sectionChanged(section) {
        if (typeof section !== 'undefined') {
            this._buildAd(section);
        }
    }

    _adCount() {
        window.adCounter = window.adCounter || 0;
        window.adCounter += 1;

        return '_' + window.adCounter;
    }
}
// attached() {
//     this.async(function() {
//         let section = this.get('section');
//
//         if (typeof section !== 'undefined') {
//             console.log('section found', section);
//             this._buildAd(section);
//         }
//     });
// }
Polymer(GoogleDFP);
