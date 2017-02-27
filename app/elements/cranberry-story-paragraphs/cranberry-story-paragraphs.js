class cranberryStoryParagraphs {
  beforeRegister() {
    this.is = 'cranberry-story-paragraphs';
    this.properties = {
      baseDomain: String,
      gcsSurveyId: String,
      mobile: Boolean,
      paragraphs: {
        type: Array,
        value: [],
        observer: '_setupParagraphs'
      },
      paragraphsLoading: {
        type: Boolean,
        notify: true,
        readOnly: true,
        reflectToAttribute: true,
        value: true
      },
      sectionInformation: Object,
      staticPage: {
        type: Boolean,
        value: false
      },
      surveysOff: Boolean,
      toutOff: Boolean,
      toutShortcode: {
        type: Boolean,
        value: false
      },
      toutUid: String
    }
  }

  // Lifycyle Methods
  attached() {
    console.info('\<cranberry-story-paragraphs\> attached');
  }

  detached() {
    console.info('\<cranberry-story-paragraphs\> detached');
  }

  // Private Methods
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

  _renderParagraphs(elementsArray) {
    // Append Fragment
    let docFragment = document.createDocumentFragment();

    elementsArray.forEach((value, index) => {
      docFragment.appendChild(value);
    });

    let contentArea = this.$.paragraphs;

    // Destroy Old Content
    contentArea.innerHTML = '';

    contentArea.appendChild(docFragment);
    this._setupDistro();

    console.info('\<cranberry-story-paragraphs\> rendered');

    this._setParagraphsLoading(false);
  }

  _setupParagraphs(paragraphs) {
    this.async(() => {
      if (typeof paragraphs !== 'undefined' && paragraphs.length > 0) {

        // Variables for Display
        let story = this.get('story');
        let staticPage = this.get('staticPage');
        let baseDomain = this.get('baseDomain');
        let toutUid = this.get('toutUid');
        let surveysOff = this.get('surveysOff');
        let toutOff = this.get('toutOff');
        let surveyIndex = this.get('surveyIndex');
        let gcsSurveyId = this.get('gcsSurveyId');
        let mobile = this.get('mobile');
        let surveyParagraphs = [];
        let elementsArray = [];
        let distributeToSurveys = false;
        let hasTout = false;

        this._setParagraphsLoading(true);

        // Turn surveys and Tout off
        if (staticPage) {
          surveysOff = true;
          toutOff = true;
        }

        // Turn Surveys off for anything but mobile
        if (!mobile) {
          surveysOff = true;
        }

        // Setup Survey Index
        if (typeof surveysOff !== 'undefined' && !surveysOff) {
          if (typeof surveyIndex === 'undefined' || surveyIndex === '0') {
            surveyIndex = 3;
          } else {
            surveyIndex = Number(surveyIndex);
          }
        }

        // Turn Off Tout for specific sections
        if (typeof story !=='undefined' && (story.sectionInformation.section === 'Obituary' || story.sectionInformation.section === 'Death_Notice')) {
          toutOff = true;
        }

        paragraphs.forEach((value, index) => {
          // UNCOMMENT FOR DEV ENVIRONMENT SURVEYS
          if (index === surveyIndex && !surveysOff) {
            distributeToSurveys = true;
          }

          if (!distributeToSurveys) {
            if (value.shortcode) {
              // Paragraph is shortcode
              if (value.key === 'tout' && !toutOff) {
                hasTout = true;
                this._toutShortcodeFlagged();
              }

              let shortcodeEl = document.createElement('cranberry-shortcode');

              shortcodeEl.set('shortcodeObject', value);
              shortcodeEl.set('storyObject', story);
              shortcodeEl.set('baseUrl', baseDomain);
              shortcodeEl.set('toutUid', toutUid);

              elementsArray.push(shortcodeEl);
            } else {
              // Paragraph is just text
              // Establish temp div for Tout placement
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

        if (!surveysOff && distributeToSurveys) {
          let surveyElement = document.createElement('google-survey');
          surveyElement.set('storyObject', story);
          surveyElement.set('baseUrl', baseDomain);
          surveyElement.set('toutUid', toutUid);
          surveyElement.set('paragraphs', surveyParagraphs);
          surveyElement.set('gcsSurveyId', gcsSurveyId);

          elementsArray.push(surveyElement);
        }
                
        this._renderParagraphs(elementsArray);
      }
    });
  }

  _setupDistro() {
    let useragent = navigator.userAgent;
    if(useragent.indexOf('Mobile') == -1) {
      let distroDiv = document.createElement('div');
      let contentArea = this.$.paragraphs;

      distroDiv.setAttribute('id', 'ds_default_anchor');

      contentArea.appendChild(distroDiv);

      let distroId = this.get('distroId');
      let loader = document.querySelector('cranberry-script-loader');

      loader.loadScript('http://c.jsrdn.com/s/cs.js?p=' + distroId, 'distroScript');
    }
  }

    _toutShortcodeFlagged() {
      this.async(function() {
        let contentArea = this.$.paragraphs;
        let toutDiv = contentArea.querySelector('#tempToutDiv');

        if (typeof toutDiv !== 'undefined' && toutDiv !== null) {
          contentArea.removeChild(toutDiv);
        }
      });
    }

}
Polymer(cranberryStoryParagraphs);
