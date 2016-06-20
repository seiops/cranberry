class cranberryStory {
    beforeRegister() {
        this.is = 'cranberry-story';
        this.properties = {
          story: {
            type: Object
          }
        };
        this.listeners = {
          'commentButton.tap': '_scrollToComments'
        };
        this.getImage = function (arr, index) {
          return arr[index].url;
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
        }
    }

    ready() {
    }

    handleResponse(data) {
      var myElement = this;
      var restResponse = JSON.parse(data.detail.Result);
      // Assign restResponse to data bound object story
      this.story = restResponse;
    }
    // Scroll to comments area function
    _scrollToComments(event) {
      this.$.comments.scrollIntoView(false);
    }
}
Polymer(cranberryStory);
