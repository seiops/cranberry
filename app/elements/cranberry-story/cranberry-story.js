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
            type: String,
            value: "http://sedev.libercus.net/rest.json"
          },
          routeData: Object,
          story: {
            type: Object,
            value: {}
          },
          storyId: {
            type: Number,
            value: 0,
            observer: '_storyIdChanged'
          },
          params: {
            type: Object,
            value: {}
          }
        };
        this.observers = ['_routeChange(routeData.id)'];

        // Are these being used?
        //
        // this.notShortcode = function(paragraph) {
        //   if (paragraph.shortcode) {
        //     return false;
        //   } else {
        //     return true;
        //   }
        // };
        // this.inContentAd = function(index) {
        //   if (index === 3) {
        //     return true;
        //   } else {
        //     return false;
        //   }
        // };
    }

    // Public methods.

    attached() {
      app.logger('\<cranberry-story\> attached');
    }

    ready() {
      app.logger('\<cranberry-story\> ready');
    }

    // Private methods.

    // Called by observer when params object is changed.
    _changeParams() {
      app.logger('\<cranberry-story\> _changeParams');

      let params = this.get('params');

      if (params.length !== 0) {
        this.$.request.url = this.rest;
        this.$.request.params = params;

        this.$.request.generateRequest();
      }
    }

    // Updates id value from route.
    _checkParams() {
      app.logger('\<cranberry-story\> _checkParams');

      let storyId = this.get('routeData.id');
      let currentId = this.get('storyId');

      if (currentId === 0 || currentId !== storyId) {
        this.set('storyId', storyId);
      }
    }

    // Calculates byline display.
    _computeBylineURL (url) {
      if (typeof url === 'undefined') {
        return 'http://imgsrc.me/250x400/9c9c9c/000000/Image Unavailable?showDimensions=0&font=arial';
      } else {
        return 'http://www.standard.net' + url;
      }
    }

    // Processes shortcodes and displays content.
    _displayContent(paragraph, index) {
      if (paragraph.shortcode) {
        let shortcodeEl = document.createElement('cranberry-shortcode');

        shortcodeEl.storyObject = this.get('story');
        shortcodeEl.shortcodeObject = paragraph;

        this.$.storyContentArea.appendChild(shortcodeEl);
      } else {
        let paragraphEl = document.createElement('p');
        let node = document.createTextNode(paragraph.text);

        // [TODO] Lots of draw calls here, heavy optimization needed.
        paragraphEl.appendChild(node);
        this.$.storyContentArea.appendChild(paragraphEl);
      }
    }

    // Format JSON response and set story object.
    _handleResponse(json) {
      app.logger('\<cranberry-story\> _handleResponse');

      let result = JSON.parse(json.detail.Result);

      this.set('story', result);
    }

    // Unknown functionality, unable to trace.
    _openLink(e) {
      let element = e.currentTarget;
      let twitterName = element.getAttribute('twitter-name');
    }

    // Observer method for changes to the id in the routing path.
    _routeChange(storyid) {
      app.logger('\<cranberry-story\> _routeChange');

      this._checkParams();
    }

    // Scrolls to comment area.
    _scrollToComments() {
        let commentsDiv = this.querySelector('#commentsButton');

        commentsDiv.scrollIntoView(true);
      }

    // Observer method for when the story id changes.
    _storyIdChanged() {
      app.logger('\<cranberry-story\> _storyIdChanged');

      let storyId = this.get('storyId');

      this._updateStoryId(storyId);
    }

    // Update story id in request parameters.
    _updateStoryId(storyid) {
      app.logger('\<cranberry-story\> _updateStoryId');

      this.set('jsonp.desiredItemID', storyid);

      let request = this.get('jsonp');

      this.set('params', request);

      this._changeParams();
    }
}
Polymer(CranberryStory);
