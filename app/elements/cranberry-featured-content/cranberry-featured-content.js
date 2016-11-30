class CranberryFeaturedContent {
    beforeRegister() {
        this.is = 'cranberry-featured-content';
        this.properties = {
            items: {
                type: Object,
                value: [],
                observer: '_itemsChanged'
            },
            livestreamItem: {
              type: Object
            },
            livestream: {
              type: Boolean,
              value: false
            }
        };
    }

    attached() {
        console.info('<\cranberry-featured-content\> attached');
    }

    _firstItem(item, index) {
        if (index === 0) {
            return true;
        } else {
            return false;
        }
    }

    _computeLivestreamURL(url) {
        if (typeof url !== 'undefined' && url.length > 0) {
          return url + '/player?width=640&amp;height=360&amp;autoPlay=false&amp;mute=false';
        } else {
          return '';
        }
    }

    _itemsChanged(newValue) {
        if (typeof newValue !== 'undefined' && newValue.length > 0 && !this.hidden) {
            let livestreamResult = newValue[0];
            let livestreamMedia = livestreamResult.mediaAssets;
            let livestreamVideo = {};

             // Check for livestream video being present
            if (typeof livestreamMedia.videos !== 'undefined') {
                if (livestreamMedia.videos[0].delivery === '3') {
                    livestreamVideo = livestreamMedia.videos[0];
                }
            }
            // Check livestream object length for livestream item
            if (Object.keys(livestreamVideo).length > 0) {
                this.set('livestreamItem', livestreamVideo);
                this.set('livestream', true);
            }
        }
    }
}

Polymer(CranberryFeaturedContent);
