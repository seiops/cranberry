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
      cachedStory: {
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
      },
      baseUrl: {
        type: String
      },
      user: {
        type: Object
      },
      /*
          * This is needed to ensure that the hidden attribute is being observed properly.
          * Without this property the hidden value in the observer is always undefined or null.
          * This is directly linked the reflectToAttribute boolean as well as the default value being set to true.
            Although I cannot give a good explaination as to why this occurs this is the only way I could get this to work
            comment this out to see the behavior I am describing above; with a console.info(hidden); within the
            _hiddenChanged function below.
          * Without the default value of true a story will not load on direct link. Without the property being set with reflectToAttribute
            the story will not load period.
      */
      hidden: {
          type: Boolean,
          reflectToAttribute: true,
          value: true
      },
      hasLeadShortcode: {
        type: Boolean,
        value: false
      },
      toutUid: {
          type: String
      }
    };
    this.observers = ['_checkParams(routeData.id)', '_hiddenChanged(hidden)'];
  }

  _hiddenChanged(hidden) {
    this.async(function() {
      let storyId = this.get('storyId');
      let routeId = this.get('routeData.id');
      let cachedStory = this.get('cachedStory');

      if (hidden) {
        this._destroyContent();
        this._closeShare();
      } else {
        if (routeId === cachedStory.itemId) {
          // Destroy current story to flag observer change for cachedStory
          this.set('story', {});
          // Set story to cachedStory
          this.set('story', cachedStory);
        }
      }
    });
  }

  attached() {
    app.logger('\<cranberry-story\> attached');
  }

  _changeParams() {
    let params = this.get('params');
    let storyId = this.get('storyId');

    this.set('story', {});
    this._destroyContent();

    if (params.length !== 0 && storyId !== 0) {
      this.$.request.url = this.rest;
      this.$.request.params = params;
      this.$.request.generateRequest();
    }
  }

  _destroyContent() {
    let contentArea = this.$.storyContentArea;
    let leadMediaArea = this.$.leadShortcode;
    let image = this.$.mainImage;

    // Remove all children of the content area to prevent old paragraphs showing
    while(contentArea.firstChild) {
      contentArea.removeChild(contentArea.firstChild);
    }

    // Remove all children of the media area to prevent old media items from showing
    while(leadMediaArea.firstChild) {
      leadMediaArea.removeChild(leadMediaArea.firstChild);
    }

    // Remove source on main image
    mainImage.src = '';

    // Set lead shortcode back to false
    this.set('hasLeadShortcode', false);
  }

  _closeShare() {
    let shareBar = this.querySelector('gigya-sharebar');
    shareBar.close();
  }

  _checkMedia(mediaItems) {
    if (typeof mediaItems !== 'undefined') {
      let hasShortcode = this.get('hasLeadShortcode');
      if (Object.keys(mediaItems).length === 0 && !hasShortcode) {
        return true;
      }
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
        let el = this;

        if (typeof paragraphs !== 'undefined') {
          // Create a document fragment to append all elements to
          let fragment = document.createDocumentFragment();

          paragraphs.forEach(function(value, index) {
            if (value.shortcode) {
              let shortcodeEl = document.createElement('cranberry-shortcode');

              shortcodeEl.set('shortcodeObject', value);
              if (value.key == 'toutembed') {
                  shortcodeEl.set('toutUid', el.toutUid);
              }
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

    // Set cached story for redisplay
    this.set('cachedStory', result);

    this.set('story', result);
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
Polymer(CranberryStory);
