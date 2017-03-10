class googleSurvey {
  beforeRegister() {
    this.is = 'google-survey';
    this.properties = {
      gcsSurveyId: {
        type: String
      },
      paragraphs: Array,
      paragraphsEstablished: {
        type: Boolean,
        value: false
      },
      scriptAppended: {
        type: Boolean,
        value: false
      }
    };
    this.observers = ['_distributeElement(paragraphs)']
  }

  // Lifecycle methods
  attached() {
    console.info('\<google-survey\> attached');
    let paragraphsEstablished = this.get('paragraphsEstablished');
    let scriptAppended = this.get('scriptAppended');

    this._checkSetup();
  }

  detached() {
    console.info('\<google-survey\> detached');
    let script = Polymer.dom(document).querySelector('#googleSurveyScript');
    if (typeof script !== 'undefined' && script !== null) {
      let parent = script.parentNode;

      parent.removeChild(script);
    }
  }

  // Private functions
  _checkSetup() {
    setTimeout(() => {
      let paragraphsEstablished = this.get('paragraphsEstablished');
      let scriptAppended = this.get('scriptAppended');

      if (paragraphsEstablished && !scriptAppended) {
        this._setupSurveyScript();
      } else {
        this._checkSetup();
      }
    }, 50);
  }

  _distributeElement(paragraphs) {
    console.info('\<google-survey\> establishing paragraphs');
    let docFragment = document.createDocumentFragment();

    paragraphs.forEach((value, index) => {
      let wrapper = document.createElement('div');
      wrapper.classList.add('p402_hide');

      wrapper.appendChild(value);

      docFragment.appendChild(wrapper);
    });
    
    

    let staticWrapper = this.querySelector('.p402_premium');
    staticWrapper.appendChild(docFragment);

    this.set('paragraphsEstablished', true);
  }

  _setupSurveyScript() {
    this.set('scriptAppended', true);

    let gcsSurveyId = this.get('gcsSurveyId');
    
    let ARTICLE_URL = window.location.href;
    let CONTENT_ID = 'everything';

    // window.TriggerPrompt(ARTICLE_URL, CONTENT_ID);

    let url = 'http://survey.g.doubleclick.net/survey?site=' + gcsSurveyId + '&url=' + encodeURIComponent(ARTICLE_URL) + (CONTENT_ID ? '&cid=' + encodeURIComponent(CONTENT_ID) : '') + '&random=' + (new Date).getTime() + '&after=1';
      
    let loader = document.querySelector('cranberry-script-loader');

    loader.loadScript(url, 'googleSurveyScript', undefined, true);
  }
}
Polymer(googleSurvey);
