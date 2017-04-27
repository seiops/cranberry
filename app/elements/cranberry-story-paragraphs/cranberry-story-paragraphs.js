class cranberryStoryParagraphs {
  beforeRegister() {
    this.is = 'cranberry-story-paragraphs';
    this.properties = {
      baseDomain: String,
      desktop: Boolean,
      dfpObject: Object,
      distroScaleOff: {
        type: Boolean,
        compute: '_computeDistroScaleOff(desktop)'
      },
      gcsSurveyId: String,
      hidden: {
        type: Boolean,
        value: true,
        reflectToAttribute: true
      },
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
        computed: '_computeToutOff(story.toutOff, staticPage, story.sectionInformation.section, desktop)',
        notify: true
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

  _computeDistroScaleOff(desktop) {
    if (!desktop) {
      return true;
    } else {
      return false;
    }
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

  _computeToutOff(toutOff, staticPage, section, desktop) {
    if (toutOff || staticPage || (section === 'Obituary' ||  section === 'Death_Notice') || desktop) {
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
    this._checkTout();
    
    console.info('\<cranberry-story-paragraphs\> rendered');

    this._setParagraphsLoading(false);
  }

  _establishParagraph(value, index, array) {
    let toutOff = this.get('toutOff');
    let distroScaleOff = this.get('distroScaleOff');

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

      if (!distroScaleOff && index === 5) {
        let dfpObject = this.get('dfpObject');
        let story = this.get('story');
        let hidden = this.get('hidden');
        let distroAd = document.createElement('google-dfp');
        let adSize = [[1, 1]];

        distroAd.setAttribute('id', 'distroAd');
        distroAd.set('adPos', 'MidArticlePlayer');
        distroAd.set('adSize', adSize);
        distroAd.set('dfpObject', dfpObject);
        distroAd.set('hidden', hidden);

        // Commenting out Distroscale for testing.
        array.push(distroAd);
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
