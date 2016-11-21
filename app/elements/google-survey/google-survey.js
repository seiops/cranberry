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
    
    let ARTICLE_URL = 'window.location.href';
    let CONTENT_ID = 'everything';
    let url = 'http://survey.g.doubleclick.net/async_survey?site=' + gcsSurveyId + (CONTENT_ID ? '&amp;cid=' + encodeURIComponent(CONTENT_ID) : '') + '&amp;random=' + (new Date).getTime();

    let loader = document.querySelector('cranberry-script-loader');

    loader.loadScript(url, 'googleSurveyScript');

    try { _402_Show(); } catch(e) {};
  }
}
Polymer(googleSurvey);
