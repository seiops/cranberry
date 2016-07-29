class CranberryContentList {
    beforeRegister() {
        this.is = 'cranberry-content-list';
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
            start: {
                type: Number
            },
            type: {
                type: String
            }
        };
    }

    attached() {
        app.logger('\<cranberry-content-list\> attached');
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
            app.logger('\<cranberry-content-list\> section changed -\> ' + section);
            this._updateParams();
        });
    }

    _checkInStreamAd(item, index) {
        let modulus = index % 6;

        if (index > 0 && modulus === 0) {
            return true;
        } else {
            return false;
        }
    }

    _checkLeaderboardAd(item, index) {
        let modulus = index % 10;

        if (index > 0 && modulus === 0) {
            return true;
        } else {
            return false;
        }
    }

    _handleLoad() {
        app.logger('<\cranberry-content-list\> load received');
    }

    _handleResponse() {
        app.logger('<\cranberry-content-list\> response received');
    }

    _hasImage(image) {
        if (typeof image !== 'undefined' && image.length > 0) {
            return true;
        } else {
            return false;
        }
    }

    _hasPreview(preview) {
        if (typeof preview !== 'undefined' && preview.length > 0) {
            return true;
        } else {
            return false;
        }
    }

    _isStory(item) {
        if (item === 'Story') {
            return true;
        } else {
            return false;
        }
    }

    _parseResponse(response) {
        var result = JSON.parse(response.Result);

        this.set('items', result);
    }

    _trimText(text) {
        let trunc = text;

        if (trunc.length > 125) {
            trunc = trunc.substring(0, 125);
            trunc = trunc.replace(/\w+$/, '');
            trunc += '...';
        }

        return trunc;
    }

    _updateParams() {
        let currentRequest = this.get('request');

        if (typeof currentRequest !== 'undefined' && currentRequest.loading === true) {
            app.logger('<\cranberry-content-list\> aborting previous request');
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
//   app.logger('\<cranberry-content-list\> ready');
// }
// Private methods
Polymer(CranberryContentList);
