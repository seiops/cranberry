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
                type: String,
                value: 'http://sedev.libercus.net/rest.json'
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
        console.log('response changed');
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

        this.set('items', result);
    }

    _updateParams() {
        let currentRequest = this.get('request');

        if (typeof currentRequest !== 'undefined' && currentRequest.loading === true) {
            app.logger('<\cranberry-featured-content\> aborting previous request');
            console.dir(currentRequest);
            this.$.request.abortRequest(currentRequest);
        }

        this.set('items', []);

        let jsonp = {};

        jsonp.request = 'content-list';
        jsonp.desiredSection = this.get('sections');
        jsonp.desiredContent = this.get('type');
        jsonp.desiredCount = this.get('count');
        this.set('params', jsonp);
    }
}
// Public methods.
// ready () {
//   app.logger('\<cranberry-featured-content\> ready');
// }
// Private methods.
Polymer(CranberryFeaturedContent);
