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
            value: 'http://sedev.libercus.net/rest.json'
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
          params: {
            type: Object,
            value: {}
          }
        };
        this.observers = ['_checkParams(routeData.id)'];
    }

    // Public methods.
    attached () {
      app.logger('\<cranberry-story\> attached');
    }

    ready () {
      app.logger('\<cranberry-story\> ready');
    }

    // Private methods.

    // Called by observer when params object is changed.
    _changeParams () {
      let params = this.get('params');
      let storyId = this.get('storyId');

      this.set('story', {});

      if (params.length !== 0 && storyId !== 0) {
        this.$.request.url = this.rest;
        this.$.request.params = params;

        this.$.request.generateRequest();
      }
    }

    // Updates id value from route.
    _checkParams () {
      let storyId = this.get('routeData.id');
      let currentId = this.get('storyId');

      if (typeof storyId !== 'undefined' && currentId !== storyId) {
        app.logger('\<cranberry-story\> setting new story id -\> ' + storyId);

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
    _displayContent (newValue) {
      // Check if the new story value is empty. Failsafe for _changeParams setting the story object to empty on storyId change.
      if (Object.keys(newValue).length !== 0) {
        let paragraphs = newValue.paragraphs;
        let contentArea = Polymer.dom(this.$.storyContentArea);

        // Remove all children of the content area to prevent old paragraphs showing
        while(contentArea.firstChild) {
          contentArea.removeChild(contentArea.firstChild);
        }

        if(typeof paragraphs !== 'undefined') {
          // Create a document fragment to append all elements to
          let fragment = document.createDocumentFragment();

          paragraphs.forEach(function(value, index) {
            if (value.shortcode) {
              let shortcodeEl = document.createElement('cranberry-shortcode');

              shortcodeEl.set('shortcodeObject', value);
              shortcodeEl.set('storyObject', newValue);
              
              fragment.appendChild(shortcodeEl);
            } else {
              let paragraphEl = document.createElement('p');
              let node = document.createTextNode(value.text);

              paragraphEl.appendChild(node);
              fragment.appendChild(paragraphEl);
            }
          });

          contentArea.appendChild(fragment);
        }
      }
    }

    // Format JSON response and set story object.
    _handleResponse(json) {
      app.logger('\<cranberry-story\> json response received');

      let result = JSON.parse(json.detail.Result);

      this.set('story', result);
    }

    // Unknown functionality, unable to trace.
    _openLink (e) {
      let element = e.currentTarget;
      let twitterName = element.getAttribute('twitter-name');
    }

    // Scrolls to comment area.
    _scrollToComments () {
        let commentsDiv = this.querySelector('#commentsButton');

        commentsDiv.scrollIntoView(true);
      }

    // Observer method for when the story id changes.
    _storyIdChanged () {
      let storyId = this.get('storyId');

      if (storyId !== 0) {
        app.logger('\<cranberry-story\> storyId set to ' + storyId);

        this._updateStoryId(storyId);
      }

    }

    // Update story id in request parameters.
    _updateStoryId (storyid) {
      this.set('jsonp.desiredItemID', storyid);

      let request = this.get('jsonp');

      this.set('params', request);

      this._changeParams();
    }
}
Polymer(CranberryStory);
