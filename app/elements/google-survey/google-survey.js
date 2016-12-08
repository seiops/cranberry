class googleSurvey {
  beforeRegister() {
    this.is = 'google-survey';
    this.properties = {
      gcsSurveyId: {
        type: String
      }
    }
  }

  // Registration functions
  ready() {

  }

  attached() {

  }

  detached() {
    let script = Polymer.dom(document).querySelector('#googleSurveyScript');
    if (typeof script !== 'undefined' && script !== null) {
      let parent = script.parentNode;

      parent.removeChild(script);
    }
  }

  // Private functions
  _checkSetup(index) {
    let paragraphs = this.get('paragraphs');
    let length = paragraphs.length;

    if (index + 1 === length) {
      this._setupSurveyScript();
    }
  }
  _createTextNode(text, index) {
    let elementsArray = this.querySelectorAll('.p402_hide');
    let appendElement = elementsArray[index];
    let paragraph = document.createElement('p');

    paragraph.innerHTML = text;
    
    appendElement.appendChild(paragraph);
    this._checkSetup(index);
  }

  _setupSurveyScript() {
    let gcsSurveyId = this.get('gcsSurveyId');
    
    let ARTICLE_URL = window.location.href;
    let CONTENT_ID = 'everything';

    window.TriggerPrompt(ARTICLE_URL, CONTENT_ID);

    // let url = 'http://survey.g.doubleclick.net/survey?site=' + gcsSurveyId + '&url=' + encodeURIComponent(ARTICLE_URL) + (CONTENT_ID ? '&cid=' + encodeURIComponent(CONTENT_ID) : '') + '&random=' + (new Date).getTime() + '&after=1';
      
    // let loader = document.querySelector('cranberry-script-loader');

    // loader.loadScript(url, 'googleSurveyScript', undefined, true);
  }
}
Polymer(googleSurvey);
