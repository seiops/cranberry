class cranberryStoryParagraphs {
  beforeRegister() {
    this.is = 'cranberry-story-paragraphs';
    this.properties = {
      baseDomain: String,
      paragraphs: {
        type: Array,
        value: []
      },
      paragraphsRendered: {
        type: Boolean,
        value: false,
        notify: true
      }
    }
    this.observers = ['_setupParagraphs(paragraphs)']
  }

  // Private Methods
  _setupParagraphs(paragraphs) {
    if (typeof paragraphs !== 'undefined' && paragraphs.length > 0) {
      this.set('paragraphsRendered', false);
      
      let data = {};
      let baseDomain = this.get('baseDomain');
      let contentArea = this.$.paragraphs;
      // TODO
      // let toutUid = this.get('toutUid');
      // let surveyOff = story.surveysOff;
      let surveyOff = false;
      // let toutOff = story.toutOff;
      // let surveyIndex = (story.surveyIndex === "0" || typeof story.surveyIndex === 'undefined') ? 3 : Number(story.surveyIndex);
      // let gcsSurveyId = this.get('gcsSurveyId');
      // let surveyParagraphs = [];
      // let paragraphs = story.paragraphs;
      let distributeToSurveys = false;
      // let mobile = this.get('mobile');

      // TODO
      // if (typeof story !=='undefined' && (story.sectionInformation.section === 'Obituary' || story.sectionInformation.section === 'Death_Notice')) {
      //   toutOff = true;
      // }

      let elementsArray = [];

      paragraphs.forEach((value, index) => {
        // UNCOMMENT FOR DEV ENVIRONMENT SURVEYS
        // if (index === surveyIndex && mobile) {
        //   distributeToSurveys = true;
        // }

        if (!distributeToSurveys) {
          if (value.shortcode) {
            if (value.key === 'tout' && !toutOff) {
              this.set('toutShortcode', true);
            }

            let shortcodeEl = document.createElement('cranberry-shortcode');

            shortcodeEl.set('shortcodeObject', value);
            // shortcodeEl.set('storyObject', story);
            shortcodeEl.set('baseUrl', baseDomain);
            // shortcodeEl.set('toutUid', toutUid);

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
              
      this._renderParagraphs(elementsArray);

      // TODO: SHOULD BE IN STORY PAGE ON EVENT LISTENER FOR PARAGRAPHS RENDERED.
      // this._sendPageview(story);

      // Fire nativo
      // if (typeof window.PostRelease !== 'undefined' && typeof window.PostRelease.Start === 'function') {
      //   PostRelease.Start();
      // }     
    }
  }

  _renderParagraphs(elementsArray) {
    // Append Fragment
    let docFragment = document.createDocumentFragment();

    elementsArray.forEach((value, index) => {
      docFragment.appendChild(value);
    });

    let contentArea = this.$.paragraphs;

    contentArea.appendChild(docFragment);

    this.set('paragraphsRendered', true);
  }

}
Polymer(cranberryStoryParagraphs);
