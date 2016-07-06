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
          params: {
            type: Object,
            value: {}
          }
        };
        this.observers = ['_storyIdChanged(story.routeId)','_routeChange(routeData.id)','_changeParams(params.desiredItemID)'];

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
      console.log('changeParams');
      let params = this.get('params');

      if (params.length !== 0) {
        this.$.request.url = this.rest;

        this.$.request.params = params;

        this.$.request.generateRequest();
      }
    }

    // Updates id value from route.
    _checkParams() {
      let storyId = this.get('routeData.id');

      console.dir('checkParams');

      if (typeof this.story.routeId === 'undefined' || this.story.routeId !== storyId) {
        console.dir('checkParams2');
        this.set('story.routeId', storyId);
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
      let result = JSON.parse(json.detail.Result);

      this.set('story', result);
    }

    _openLink(e) {
      let element = e.currentTarget;
      let twitterName = element.getAttribute('twitter-name');
    }

    _routeChange(storyid) {
      this._checkParams();
    }
    _scrollToComments() {
        let commentsDiv = this.querySelector('#commentsButton');

        commentsDiv.scrollIntoView(true);
      }

    // Observer method for when the story id changes.
    _storyIdChanged() {
      console.log('_storyIdChanged');
      let storyId = this.get('story.routeId');
      console.dir(storyId);
      if (typeof storyId !== 'undefined') {
        this._updateStoryId(storyId);
      }
    }


    _updateStoryId(storyid) {

      console.log('updatestoryid');
      this.set('jsonp.desiredItemID', storyid);

      let request = this.get('jsonp');

      console.dir(request);

      this.set('params', request);
    }
}
Polymer(CranberryStory);
