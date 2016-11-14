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
      hidden: {
          type: Boolean,
          reflectToAttribute: true,
          value: true
      },
      hasLeadShortcode: {
        type: Boolean,
        value: false
      },
      hasToutTap: {
        type: Boolean,
        value: false
      },
      toutUid: {
          type: String
      },
      toutShortcode: {
        type: Boolean,
        value: false,
        observer: '_toutShortcodeFlagged'
      },
      active: {
        type: Boolean
      },
      distroId: {
        type: String
      }
    };
    this.observers = ['_checkParams(routeData.id)', '_hiddenChanged(hidden, routeData.id)'];
  }

  attached() {
    this.async(function() {
      app.logger('\<cranberry-story\> attached');
    });
  }

  _checkStory() {
    let storyId = this.get('storyId');
    let routeId = this.get('routeData.id');
    let story = this.get('story');
    let cachedStory = this.get('cachedStory');

    this.async(function() {
      if (routeId === cachedStory.itemId) {
        // Destroy current story to flag observer change for cachedStory
        this.set('story', {});
        // Set story to cachedStory
        this.set('story', cachedStory);
        // Refresh tout
        this._refreshTout();
      }
    }); 
  }

  detached() {
    app.logger('\<cranberry-story\> detached');

    this._destroyContent();
    this._closeShare();
  }

  _changeParams() {
    let params = this.get('params');
    let storyId = this.get('storyId');

    this.set('story', {});

    params.preview = 1;

    if (params.length !== 0 && storyId !== 0) {
      this.$.storyRequest.url = this.rest;
      this.$.storyRequest.setAttribute('callback-value', 'storycallback');
      this.$.storyRequest.params = params;
      this.$.storyRequest.generateRequest();
    }
  }

  _destroyContent() {
    let contentArea = this.$.storyContentArea;
    let leadMediaArea = this.$.leadShortcode;
    let image = this.$.mainImage;

    this.set('route', {});

    // Remove all children of the content area to prevent old paragraphs showing
    while(contentArea.firstChild) {
      contentArea.removeChild(contentArea.firstChild);
    }

    // Remove all children of the media area to prevent old media items from showing
    while(leadMediaArea.firstChild) {
      leadMediaArea.removeChild(leadMediaArea.firstChild);
    }

    // Remove source on main image
    if (typeof image !== 'undefined') {
      image.src = '';
    }

    // Set lead shortcode back to false
    this.set('hasLeadShortcode', false);
  }

  _closeShare() {
    let shareBar = Polymer.dom(this.root).querySelector('gigya-sharebar');
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
    this.async(function() {
      let hidden = this.get('hidden');
      if (!hidden) {
        let storyId = this.get('routeData.id');
        let currentId = this.get('storyId');

        if (typeof storyId !== 'undefined' && currentId !== storyId) {
          app.logger('\<cranberry-story\> setting new story id -\> ' + storyId);
          this.set('storyId', storyId);
          this._destroyContent();
        }
      }
    });
  }

  _hiddenChanged(hidden, routeId) {
    this.async(function() {
      let storyId = this.get('storyId');

      if (hidden) {
        // Destroy the content
        this._destroyContent();
      } else {
        if (routeId === storyId) {
          this._checkStory();
        }
      }
    });
    
  }

  _computeBylineURL(url) {
    let baseUrl = this.get('baseUrl');

    if (typeof url === 'undefined') {
      return 'http://imgsrc.me/250x400/9c9c9c/000000/Image Unavailable?showDimensions=0&font=arial';
    } else {
      return baseUrl + url;
    }
  }

  _displayContent() {
    if (this.hidden === false) {
      let storyId = this.get('storyId');

      if (typeof storyId !== 'undefined' && storyId !== 0) {
        let story = this.get('story');
        if (typeof story.published !== 'undefined'){
          let data = {};
          let baseUrl = this.get('baseUrl');
          let paragraphs = story.paragraphs;
          let contentArea = this.$.storyContentArea;
          let el = this;

          // TOUT TAP BUILD
          // let tapTout = document.createElement('tout-element');
          // let topToutDiv = this.$.toutTap;

          // tapTout.set('placement', 'tout-tap-article');
          // tapTout.set('slot', 'tap-article');
          // tapTout.set('player', 'top_article_embed');
          // tapTout.set('storyId', this.get('routeData.id'));

          // topToutDiv.appendChild(tapTout);

          if (typeof paragraphs !== 'undefined') {
            // Create a document fragment to append all elements to
            let fragment = document.createDocumentFragment();

            paragraphs.forEach(function(value, index) {
              if (value.shortcode) {
                if (value.key === 'tout') {
                  el.set('toutShortcode', true);
                }

                let shortcodeEl = document.createElement('cranberry-shortcode');

                shortcodeEl.set('shortcodeObject', value);
                if (value.key == 'toutembed') {
                    shortcodeEl.set('toutUid', el.toutUid);
                }
                shortcodeEl.set('storyObject', story);
                shortcodeEl.set('baseUrl', baseUrl);
                fragment.appendChild(shortcodeEl);
              } else {
                let hasTout = el.get('toutShortcode');

                if (index === 4 && !hasTout) {
                  let tempDiv = document.createElement('div');
                  tempDiv.setAttribute('id', 'tempToutDiv');

                  fragment.appendChild(tempDiv);
                }
                let paragraphEl = document.createElement('p');
                paragraphEl.innerHTML = value.text;

                fragment.appendChild(paragraphEl);
              }
            });
            contentArea.appendChild(fragment);
            this._checkTout();
          }

          // Data settings for pageview
          data.dimension6 = 'Story';

          if (typeof story.byline.inputByline !== 'undefined') {
            data.dimension1 = story.byline.inputByline;
          }

          if (typeof story.published !== 'undefined') {
            data.dimension3 = story.published;
          }

          if (typeof story.tags !== 'undefined') {
            data.dimension8 = story.tags;
          }

          // Send pageview event with iron-signals
          this.fire('iron-signal', {name: 'track-page', data: { path: '/story/' + storyId, data } });

          this._setupDistro();
        }
      }
    }
  }

  _setupDistro() {
    let useragent = navigator.userAgent;
    if(useragent.indexOf('Mobile') == -1) {
      let distroId = this.get('distroId');
      let loader = document.querySelector('cranberry-script-loader');

      loader.loadScript('http://c.jsrdn.com/s/cs.js?p=' + distroId);
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
    let commentsDiv = Polymer.dom(this.root).querySelector('#commentsButton');

    commentsDiv.scrollIntoView(true);
  }

  _storyIdChanged() {
    this.async(function() {

      let storyId = this.get('storyId');

      if (typeof storyId !== 'undefined' && storyId !== 0) {
        app.logger('\<cranberry-story\> storyId set to ' + storyId);

        this._updateStoryId(storyId);
      }
      
    });
  }

  _updateStoryId(storyid) {
    this.set('jsonp.desiredItemID', storyid);

    let request = this.get('jsonp');

    this.set('params', request);
    this._changeParams();
  }

  _toutShortcodeFlagged(tout) {
    this.async(function() {
      if (tout) {
        let contentArea = this.$.storyContentArea;
        let toutDiv = contentArea.querySelector('#tempToutDiv');

        if (typeof toutDiv !== 'undefined' && toutDiv !== null) {
          contentArea.removeChild(toutDiv);
        }
      }
    });
  }

  _checkTout() {
    let contentArea = this.$.storyContentArea;
    let toutDiv = contentArea.querySelector('#tempToutDiv');
    let toutUid = this.get('toutUid');

    if (toutDiv !== null) {
      let tout = document.createElement('tout-element');

      tout.set('placement', 'tout-mid-article');
      tout.set('slot', 'mid-article');
      tout.set('player', 'mid_article_player');
      tout.set('toutUid', toutUid);
      tout.set('storyId', this.get('routeData.id'));

      toutDiv.appendChild(tout);
    }
  }

  _refreshTout() {
    let touts = Polymer.dom(this.root).querySelectorAll('tout-element');

    touts.forEach(function(value, index) {
      value.refresh();
    });
  }
}
Polymer(CranberryStory);
