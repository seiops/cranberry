class CranberryFeaturedContent {
    beforeRegister() {
        this.is = 'cranberry-featured-content';
        this.properties = {
            count: {
                type: Number
            },
            items: {
                type: Object,
                value: []
            },
            params: {
                type: Object,
                value: [],
                observer: '_changeParams'
            },
            request: Object,
            response: {
                type: Object,
                observer: '_parseResponse'
            },
            rest: {
                type: String
            },
            sections: {
                type: String,
                observer: '_changeSections'
            },
            section: {
                type: String
            },
            start: {
                type: Number
            },
            type: {
                type: String
            },
            tags: {
              type: Boolean,
              value: false
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
        app.logger('<\cranberry-featured-content\> attached');
    }

    _changeParams() {
        let params = this.get('params');

        if (params.length !== 0 && params.desiredCount) {
            this.$.request.setAttribute('url', this.get('rest'));
            this.$.request.params = params;
            this.$.request.generateRequest();
        }
    }

    _changeSections(section) {
        this.async(function() {
            app.logger('<\cranberry-featured-content\> section changed -\> ' + section);
            this._updateParams();
        });
    }

    _changeType() {
        app.logger('<\cranberry-featured-content\> type changed');
    }

    _changeResponse() {
        app.logger('<\cranberry-featured-content\> response changed')
    }

    _firstItem(item, index) {
        if (index === 0) {
            return true;
        } else {
            return false;
        }
    }

    _handleLoad() {
        app.logger('<\cranberry-featured-content\> load received');
    }

    _handleResponse() {
        app.logger('<\cranberry-featured-content\> response received');
    }

    _parseResponse(response) {
      var result = JSON.parse(response.Result);

      console.dir(result);

      if (typeof result !== 'undefined' && result.length > 0) {
        let livestreamResult = result[0];
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
          this.set('livestreamItem', result[0].mediaAssets.videos[0]);
          this.set('livestream', true);
        } else {
          this.set('items', result);
        }
      }
    }

    _updateParams() {
        let currentRequest = this.get('request');
        let tags = this.get('tags');

        if (typeof currentRequest !== 'undefined' && currentRequest.loading === true) {
            app.logger('<\cranberry-featured-content\> aborting previous request');
            console.dir(currentRequest);
            this.$.request.abortRequest(currentRequest);
        }

        this.set('items', []);

        let jsonp = {};

        jsonp.request = 'content-list';
        if (typeof tags !== 'undefined' && tags) {
          let sections = this.get('sections');
          sections = sections.replace('-', ' ');
          // jsonp.desiredTags = sections + ', featured';
        } else {
          jsonp.desiredSection = this.get('sections');
          // jsonp.desiredTags = 'featured';
        }

        // console.log(jsonp.desiredTags);
        jsonp.desiredContent = this.get('type');
        jsonp.desiredCount = this.get('count');
        jsonp.desiredDelivery = 'imagesOnly';
        this.set('params', jsonp);
    }

    _computeLivestreamURL(url) {
      if (typeof url !== 'undefined' && url.length > 0) {
        return url + '/player?width=640&amp;height=360&amp;autoPlay=false&amp;mute=false';
      } else {
        return '';
      }
    }
}
// Public methods.
// ready () {
//   app.logger('\<cranberry-featured-content\> ready');
// }
// Private methods.
Polymer(CranberryFeaturedContent);
