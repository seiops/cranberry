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
      staticPage: Boolean,
      story: {
        type: Object,
        value: {}
      },
      surveysOff: {
        type: Boolean,
        computed: '_computeSurveysOff(story.surveyOff, mobile, staticPage)'
      },
      surveyIndex: {
        type: Number,
        computed: '_computeSurveyIndex(story.surveyIndex)'
      },
      toutOff: {
        type: Boolean,
        computed: '_computeToutOff(story.toutOff, staticPage, story.sectionInformation.section)'
      },
      toutShortcode: {
        type: Boolean,
        value: false
      },
      toutUid: String
    };
  }

  // Lifycyle Methods
  attached() {
    console.info('\<cranberry-story-paragraphs\> attached');
  }

  detached() {
    console.info('\<cranberry-story-paragraphs\> detached');
    this._setParagraphsLoading(true);
  }

  // Private Methods
  _checkTout() {
    this.async(function()  {
      let contentArea = this.$.paragraphs;
      let toutDiv = contentArea.querySelector('#tempToutDiv');
      if (toutDiv === null) {
        let surveyDiv = contentArea.querySelector('google-survey');

        if (surveyDiv !== null) {
          toutDiv = surveyDiv.querySelector('#tempToutDiv');
        }
      }

      let toutUid = this.get('toutUid');

      if (toutDiv !== null) {
        let tout = document.createElement('tout-element');

        tout.set('placement', 'tout-mid-article');
        tout.set('slot', 'mid-article');
        tout.set('playerName', 'mid_article_player');
        tout.set('toutUid', toutUid);
        tout.set('storyId', this.get('routeData.id'));
        tout.set('story', this.get('story'));

        toutDiv.appendChild(tout);
      }
    });
  }

  _computeSurveysOff(surveyOff, mobile, staticPage, section) {
    // Shut surveys off for anything but mobile.
    if (!mobile || staticPage || (section === 'Obituary' ||  section === 'Death_Notice')) {
      return true;
    }

    if (surveyOff) {
      return true;
    } else {
      return false;
    }
  }

  _computeSurveyIndex(surveyIndex) {
    if (typeof surveyIndex !== 'undefined') {
      return parseInt(surveyIndex);
    }
  }

  _computeToutOff(toutOff, staticPage, section) {
    if (toutOff || staticPage || (section === 'Obituary' ||  section === 'Death_Notice')) {
      return true;
    } else {
      return false;
    }
  }

  _refreshTout() {
    this.async(function()  {
      let touts = Polymer.dom(this.root).querySelectorAll('tout-element');

      touts.forEach((value, index) => {
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
    this._checkTout();
    
    console.info('\<cranberry-story-paragraphs\> rendered');

    this._setParagraphsLoading(false);
  }

  _establishParagraph(value, index, array) {
    let toutOff = this.get('toutOff');

    if (value.shortcode) {
      let story = this.get('story');
      let baseDomain = this.get('baseDomain');
      let toutUid = this.get('toutUid');

      // Paragraph is shortcode
      if (value.key === 'tout' && !toutOff) {
        if (index < 4) {
          toutOff = true;
        }
        this._toutShortcodeFlagged();
      }

      let shortcodeEl = document.createElement('cranberry-shortcode');

      shortcodeEl.set('shortcodeObject', value);
      shortcodeEl.set('storyObject', story);
      shortcodeEl.set('baseUrl', baseDomain);
      shortcodeEl.set('toutUid', toutUid);

      array.push(shortcodeEl);
    } else {
      // Paragraph is just text
      // Establish temp div for Tout placement
      if (index === 4 && !toutOff) {
        let tempDiv = document.createElement('div');
        tempDiv.setAttribute('id', 'tempToutDiv');

        array.push(tempDiv);
      }

      let paragraphEl = document.createElement('p');
      paragraphEl.innerHTML = value.text;

      array.push(paragraphEl);
    }

    return array;
  }

  _setupParagraphs(paragraphs) {
    this.async(() => {
      if (typeof paragraphs !== 'undefined' && paragraphs.length > 0) {
        // Variables for Display
        let story = this.get('story');
        let baseDomain = this.get('baseDomain');
        let toutUid = this.get('toutUid');
        let surveysOff = this.get('surveysOff');
        let surveyIndex = this.get('surveyIndex');
        let gcsSurveyId = this.get('gcsSurveyId');
        let distributeToSurveys = false;
        let surveyParagraphs = [];
        let elementsArray = [];

        this._setParagraphsLoading(true);
        
        paragraphs.forEach((value, index) => {

          // Survey Logical Switch
          if (index === surveyIndex && !surveysOff) {
            distributeToSurveys = true;
          }

          if (!distributeToSurveys) {
            elementsArray = this._establishParagraph(value, index, elementsArray);
          } else {
            surveyParagraphs = this._establishParagraph(value, index, surveyParagraphs);
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
