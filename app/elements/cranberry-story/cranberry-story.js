class CranberryStory {
    beforeRegister() {
        this.is = 'cranberry-story';
        this.properties = {
            jsonp: {
                type: Object,
                value: {
                    request: 'story'
                }
            },
            rest: {
                type: String
            },
            routeData: Object,
            story: {
                type: Object,
                value: {},
                observer: '_displayContent'
            },
            storyId: {
                type: Number,
                value: 0,
                observer: '_storyIdChanged'
            },
            hidden: Boolean,
            params: {
                type: Object,
                value: {}
            },
            baseUrl: {
              type: String
            },
            user: {
              type: Object
            }
        };

        this.observers = ['_checkParams(routeData.id)'];
    }

    attached() {
        app.logger('\<cranberry-story\> attached');
    }

    _changeParams() {
        let params = this.get('params');
        let storyId = this.get('storyId');

        this.set('story', {});
        if (params.length !== 0 && storyId !== 0) {
            this.$.request.url = this.rest;
            this.$.request.params = params;
            this.$.request.generateRequest();
        }
    }

    _checkParams() {
        let storyId = this.get('routeData.id');
        let currentId = this.get('storyId');

        if (typeof storyId !== 'undefined' && currentId !== storyId) {
            app.logger('\<cranberry-story\> setting new story id -\> ' + storyId);
            this.set('storyId', storyId);
        }
    }

    _computeBylineURL(url) {
      let baseUrl = this.get('baseUrl');

        if (this.hidden === false) {
            if (typeof url === 'undefined') {
                return 'http://imgsrc.me/250x400/9c9c9c/000000/Image Unavailable?showDimensions=0&font=arial';
            } else {
                return baseUrl + url;
            }
        }
    }

    _displayContent() {
        if (this.hidden === false) {
            let storyId = this.get('storyId');

            if (typeof storyId !== 'undefined' && storyId !== 0) {
                let story = this.get('story');
                let baseUrl = this.get('baseUrl');
                let paragraphs = story.paragraphs;
                let contentArea = this.$.storyContentArea;

                // Remove all children of the content area to prevent old paragraphs showing
                while(contentArea.firstChild) {
                  contentArea.removeChild(contentArea.firstChild);
                }

                if (typeof paragraphs !== 'undefined') {
                    // Create a document fragment to append all elements to
                    let fragment = document.createDocumentFragment();

                    paragraphs.forEach(function(value, index) {
                        if (value.shortcode) {
                            let shortcodeEl = document.createElement('cranberry-shortcode');

                            shortcodeEl.set('shortcodeObject', value);
                            shortcodeEl.set('storyObject', story);
                            shortcodeEl.set('baseUrl', baseUrl);
                            fragment.appendChild(shortcodeEl);
                        } else {
                            let paragraphEl = document.createElement('p');
                            paragraphEl.innerHTML = value.text;

                            fragment.appendChild(paragraphEl);
                        }
                    });
                    contentArea.appendChild(fragment);
                }
            }
        }
    }

    _handleResponse(json) {
        app.logger('\<cranberry-story\> json response received');

        let result = JSON.parse(json.detail.Result);

        this.set('story', result);
    }

    _openLink(e) {
        let element = e.currentTarget;
        let twitterName = element.getAttribute('twitter-name');
    }

    _scrollToComments() {
        let commentsDiv = this.querySelector('#commentsButton');

        commentsDiv.scrollIntoView(true);
    }

    _storyIdChanged() {
        this.async(function() {
            if (this.hidden === false) {
                let storyId = this.get('storyId');

                if (typeof storyId !== 'undefined' && storyId !== 0) {
                    app.logger('\<cranberry-story\> storyId set to ' + storyId);
                    this._updateStoryId(storyId);
                }
            }
        });
    }

    _updateStoryId(storyid) {
        this.set('jsonp.desiredItemID', storyid);

        let request = this.get('jsonp');

        this.set('params', request);
        this._changeParams();
    }
}
// Public methods.
// ready () {
//   app.logger('\<cranberry-story\> ready');
// }
// Private methods.
// Called by observer when params object is changed.
// Updates id value from route.
// Calculates byline display.
// Processes shortcodes and displays content.
// Format JSON response and set story object.
// Unknown functionality, unable to trace.
// Scrolls to comment area.
// Observer method for when the story id changes.
// Update story id in request parameters.
Polymer(CranberryStory);
