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
        
        this.set('items', result);
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
          // jsonp.desiredSection = this.get('sections');
          // jsonp.desiredTags = 'featured';
        }

        // console.log(jsonp.desiredTags);

        // jsonp.desiredContent = this.get('type');
        jsonp.desiredContent = 'story';
        jsonp.desiredCount = this.get('count');
        // jsonp.desiredDelivery = 'imagesOnly';
        jsonp.desiredDelivery = 'livestream';
        this.set('params', jsonp);
    }
}
// Public methods.
// ready () {
//   app.logger('\<cranberry-featured-content\> ready');
// }
// Private methods.
Polymer(CranberryFeaturedContent);
