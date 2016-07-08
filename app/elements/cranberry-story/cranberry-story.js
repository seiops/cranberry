class cranberryStory {
    beforeRegister() {
        this.is = 'cranberry-story';
        this.properties = {
          story: {
            type: Object
          },
          route: {
            type: Object,
            observer: 'onRouteChanged'
          }
        };
        this.listeners = {
          'commentButton.tap': '_scrollToComments',
          'twitterButton.tap': '_openLink'
        };
        this.notShortcode = function(paragraph) {
          if (paragraph.shortcode) {
            return false;
          } else {
            return true;
          }
        };
        this.inContentAd = function(index) {
          if (index === 3) {
            return true;
          } else {
            return false;
          }
        };
        this.computeBylineURL = function(url) {
          if (typeof url === 'undefined') {
            return 'http://imgsrc.me/250x400/9c9c9c/000000/Image Unavailable?showDimensions=0&font=arial';
          } else {
            return 'http://www.standard.net' + url;
          }
        };
        this.displayContent = function(paragraph, index) {
          if (paragraph.shortcode) {
            let shortcodeEl = document.createElement('cranberry-shortcode');
            shortcodeEl.storyObject = this.story;
            shortcodeEl.shortcodeObject = paragraph;
            this.$.storyContentArea.appendChild(shortcodeEl);
          } else {
            let paragraphEl = document.createElement('p');
            let node = document.createTextNode(paragraph.text);
            paragraphEl.appendChild(node);
            this.$.storyContentArea.appendChild(paragraphEl);
          }
        };
        this._scrollToComments = function (event) {
          let commentsDiv = this.querySelector('#commentsButton');
          commentsDiv.scrollIntoView(true);
        };
        this._openLink = function(e) {
          let element = e.currentTarget;
          let twitterName = element.getAttribute('twitter-name');

        };
    }

    ready() {
    }

    handleResponse(data) {
      var myElement = this;
      var restResponse = JSON.parse(data.detail.Result);
      // Assign restResponse to data bound object story
      this.story = restResponse;
    }

    onRouteChanged(newValue, oldValue) {
      if (typeof oldValue !== 'undefined') {
        if (newValue.path.replace('/', '') === 'story-content') {
          let sliders = this.querySelectorAll('cranberry-slider');
          if (sliders.length > 0) {
            sliders.forEach(function(value, index) {
              value.endLoading(value, 0, "next");
            });
          }
        }
      }
    }

}
Polymer(cranberryStory);
