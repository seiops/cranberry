class CranberryStory {
  beforeRegister() {
    this.is = 'cranberry-story';
    this.properties = {
      baseUrl: String,
      byline: {
        type: Object,
        value: {}
      },
      cachedStory: {
        type: Object,
        value: {}
      },
      distroId: String,
      error: {
        type: Object,
        value: {}
      },
      firstTime: {
        type: Boolean,
        value: true
      },
      gcsSurveyId: String,
      hasLeadShortcode: {
        type: Boolean,
        value: false
      },
      hasProfile: {
        type: Boolean,
        value: false
      },
      hasToutTap: {
        type: Boolean,
        value: false
      },
      hidden: {
        type: Boolean,
        reflectToAttribute: true,
        value: true
      },
      jsonp: {
        type: Object,
        value: {
          request: 'story'
        }
      },
      loading: {
        type: Boolean,
        value: true
      },
      params: {
        type: Object,
        value: {}
      },
      response: Object,
      rest: {
          type: String
      },
      routeData: Object,
      staticPage: {
        type: Boolean,
        value: false
      },
      story: {
        type: Object,
        value: {},
        observer: '_displayContent'
      },
      storyContent: {
        type: Array,
        value: [],
        observer: '_render'
      },
      storyId: {
        type: Number,
        value: 0,
        observer: '_storyIdChanged'
      },
      survey: {
        type: Boolean,
        value: true
      },
      surveyIndex: {
        type: Number,
        value: 5
      },
      toutShortcode: {
        type: Boolean,
        value: false,
        observer: '_toutShortcodeFlagged'
      },
      toutUid: String,
      user: Object
    };
    this.observers = ['_checkParams(routeData.id)', '_hiddenChanged(hidden, routeData.id)'];
  }

  attached() {
    console.info('\<cranberry-story\> attached');
  }

  _checkStory() {
    let storyId = this.get('storyId');
    let routeId = this.get('routeData.id');
    let story = this.get('story');
    let cachedStory = this.get('cachedStory');

    this.async(function() {
      if (typeof cachedStory !== 'undefined' && typeof cachedStory.itemId !== 'undefined' && typeof routeId !== 'undefined') {
        if (routeId === cachedStory.itemId) {
          // Destroy current story to flag observer change for cachedStory
          this.set('story', {});
          // Set story to cachedStory
          this.set('story', cachedStory);
          // Refresh tout
          this._refreshTout();
        }
      }
    }); 
  }

  detached() {
    console.info('\<cranberry-story\> detached');

    this._destroyContent();
  }

  _changeParams() {
    this.async(function()  {
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
    });
  }

  _destroyContent() {
    let contentArea = this.$.storyContentArea;
    // let leadMediaArea = this.$.leadShortcode;
    let image = this.$.mainImage;

    this.set('route', {});

    // Destroy content in shortcode and content areas
    contentArea.innerHTML = '';
    // leadMediaArea.innerHTML = '';

    // Remove source on main image
    if (typeof image !== 'undefined') {
      image.src = '';
    }

    // Set lead shortcode back to false
    this.set('hasLeadShortcode', false);

    // Destroy distroScript
    let script = Polymer.dom(document).querySelector('#distroScript');
    if (typeof script !== 'undefined' && script !== null) {
      let parent = script.parentNode;

      parent.removeChild(script);
    }

    this.set('hasProfile', false);
  }

  _destroyNativo() {
    let nativoAds = Polymer.dom(this).querySelectorAll('.ntv-ad-div');

    if (nativoAds.length > 0) {
      nativoAds.forEach((value, index) => {
        value.innerHTML = '';
      });
    }
  }

  _checkMedia(mediaItems) {
    if (typeof mediaItems !== 'undefined') {
      let hasShortcode = this.get('hasLeadShortcode');
      if (Object.keys(mediaItems).length === 0 && !hasShortcode) {
        return true;
      } else {
        return false;
      }
    }
  }

  _checkParams(routeId) {
    this.async(function() {
      if (typeof routeId !== 'undefined') {
        let hidden = this.get('hidden');
        if (typeof hidden !== 'undefined' && !hidden) {
          let storyId = routeId;
          let currentId = this.get('storyId');
          let firstTime = this.get('firstTime');

          if (typeof storyId !== 'undefined' && typeof currentId !== 'undefined' && currentId !== storyId) {
            console.info('\<cranberry-story\> setting new story id -\> ' + storyId);
            this.set('storyId', storyId);
            if (!firstTime) {
              this._destroyContent();
            }
          }
        }
      }
    });
  }

  _hiddenChanged(hidden, routeId) {
    this.debounce('_hiddenChanged', ()  => {
      let storyId = this.get('storyId');

      if (typeof hidden !== 'undefined' && hidden && typeof storyId !== 'undefined' && storyId !== 0) {
        // Destroy the content
        this._destroyContent();
        this._destroyNativo();
      } else {
        if (routeId === storyId) {
          this._checkStory();
        }
      }
    });
  }

  _displayContent(story, oldStory) {
    this.async(function()  {
      let hidden = this.get('hidden');
      if (!hidden && Object.keys(story).length > 0) {
        let storyId = this.get('storyId');
        if (typeof storyId !== 'undefined' && storyId !== 0) {
          if (typeof story.published !== 'undefined') {
            let data = {};
            let baseUrl = this.get('baseUrl');
            let toutUid = this.get('toutUid');
            let surveyOff = story.surveysOff;
            let toutOff = story.toutOff;
            let surveyIndex = (story.surveyIndex === "0" || typeof story.surveyIndex === 'undefined') ? 3 : Number(story.surveyIndex);
            let gcsSurveyId = this.get('gcsSurveyId');
            let surveyParagraphs = [];
            let paragraphs = story.paragraphs;
            let contentArea = this.$.storyContentArea;
            let distributeToSurveys = false;
            let mobile = this.get('mobile');

            if (story.sectionInformation.section === 'Obituary' || story.sectionInformation.section === 'Death_Notice') {
              toutOff = true;
            }

            if (typeof paragraphs !== 'undefined') {
              let elementsArray = [];

              paragraphs.forEach((value, index) => {
                // UNCOMMENT FOR DEV ENVIRONMENT SURVEYS
                if (index === surveyIndex && mobile) {
                  distributeToSurveys = true;
                }

                if (!distributeToSurveys) {
                  if (value.shortcode) {
                    if (value.key === 'tout' && !toutOff) {
                      this.set('toutShortcode', true);
                    }

                    let shortcodeEl = document.createElement('cranberry-shortcode');

                    shortcodeEl.set('shortcodeObject', value);
                    shortcodeEl.set('storyObject', story);
                    shortcodeEl.set('baseUrl', baseUrl);
                    shortcodeEl.set('toutUid', toutUid);

                    elementsArray.push(shortcodeEl);
                  } else {
                    let hasTout = this.get('toutShortcode');

                    if (index === 4 && !hasTout && !toutOff) {
                      let tempDiv = document.createElement('div');
                      tempDiv.setAttribute('id', 'tempToutDiv');

                      elementsArray.push(tempDiv);
                    }

                    let paragraphEl = document.createElement('p');
                    paragraphEl.innerHTML = value.text;

                    elementsArray.push(paragraphEl);
                  }
                } else {
                  surveyParagraphs.push(value);
                }
                
              });
              
              // UNCOMMENT FOR DEV ENVIRONMENT SURVEYS
              if (!surveyOff && distributeToSurveys) {
                let surveyElement = document.createElement('google-survey');
                surveyElement.set('storyObject', story);
                surveyElement.set('baseUrl', baseUrl);
                surveyElement.set('toutUid', toutUid);
                surveyElement.set('paragraphs', surveyParagraphs);
                surveyElement.set('gcsSurveyId', gcsSurveyId);

                elementsArray.push(surveyElement);
              }
              
              this.set('storyContent', elementsArray);
            }

            this._sendPageview(story);

            // Fire nativo
            if (typeof window.PostRelease !== 'undefined' && typeof window.PostRelease.Start === 'function') {
              PostRelease.Start();
            }            
          }
        }
      }
    });
  }

  _render(newValue) {
    if (newValue.length > 0) {
      let docFragment = document.createDocumentFragment();

      newValue.forEach((value, index) => {
        docFragment.appendChild(value);
      });

      let contentArea = this.$.storyContentArea;

      contentArea.appendChild(docFragment);

      // Check Tout location function
      this._checkTout();
      // DISTRO SETUP FUNCTION
      // this._setupDistro();
    }
  }

  _setupDistro() {
    let useragent = navigator.userAgent;
    if(useragent.indexOf('Mobile') == -1) {
      let distroDiv = document.createElement('div');
      let contentArea = this.$.storyContentArea;

      distroDiv.setAttribute('id', 'ds_default_anchor');

      contentArea.appendChild(distroDiv);

      let distroId = this.get('distroId');
      let loader = document.querySelector('cranberry-script-loader');

      loader.loadScript('http://c.jsrdn.com/s/cs.js?p=' + distroId, 'distroScript');
    }
  }

  _sendPageview(story) {
    var { byline: { inputByline: byline }, sectionInformation: { section }, published: published, tags: tags, itemId: storyId } = story;

    if (typeof story.byline !== 'undefined') {
      if (typeof story.byline.title !== 'undefined') {
        byline = story.byline.title;
      }
    }

    if (section === '') {
      section = story.sectionInformation.sectionParentName;
    }

    let data = {
      dimension1: (typeof byline !== 'undefined') ? byline : '',
      dimension3: (typeof published !== 'undefined') ? published : '',
      dimension6: 'Story',
      dimension8: (typeof tags !== 'undefined') ? tags : ''
    };
  
    // Send pageview event with iron-signals
    this.fire('iron-signal', {name: 'track-page', data: { path: '/story/' + storyId, data } });

    // Send Chartbeat
    this.fire('iron-signal', {name: 'chartbeat-track-page', data: { path: '/story/' + storyId, data: {'sections': section, 'authors': byline } } });

    // Fire Youneeq Page Hit Request
    this.fire('iron-signal', {name: 'page-hit'});
    this.fire('iron-signal', {name: 'observe', data: {content: story}});
  }

  _handleResponse(json) {
    console.info('\<cranberry-story\> json response received');

    let result = JSON.parse(json.detail.Result);

    // Set cached story for redisplay
    this.set('cachedStory', result);

    this.set('story', result);
  }

  _storyIdChanged(storyId, oldId) {
    if (typeof oldId !== 'undefined' && oldId !== 0) {
      this.set('firstTime', false);
    }

    this.async(function() {
      if (typeof storyId !== 'undefined' && storyId !== 0 && storyId !== oldId) {
        console.info('\<cranberry-story\> storyId set to ' + storyId);
        this._updateStoryId(storyId);
      }
      
    });
  }

  _updateStoryId(storyid) {
    this._destroyContent();
    
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
    this.async(function()  {
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
    });
    
  }

  _refreshTout() {
    this.async(function()  {
      let touts = Polymer.dom(this.root).querySelectorAll('tout-element');

      touts.forEach(function(value, index) {
        value.refresh();
      });
    });
  }

  _checkNumberImages(images) {
    if (images.length > 1) {
      return true;
    } else {
      return false;
    }
  }
}
Polymer(CranberryStory);
