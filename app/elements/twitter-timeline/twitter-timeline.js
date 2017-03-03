class twitterTimeline {
  beforeRegister() {
    this.is = 'twitter-timeline';
    this.properties = {
      sourceType: {
        type: String
      },
      screenName: {
        type: String
      },
      widgetId: {
        type: String
      }
    };
  }

  attached() {
    this.async(() => {
      this._checkTwttr();
    });
  }
  
  _buildWidget() {
    this.async(() => {
      let config = {};

      config.sourceType = this.sourceType;
      if (this.sourceType === 'widget') {
        config.widgetId = this.widgetId;
      }

      if (this.sourceType === 'profile') {
        config.screenName = this.screenName;
      }
      twttr.widgets.createTimeline(config,
      this.$.timeline,
      {
        width: '450',
        height: '700'
      }).then(function(el) {
        // Do stuff after embed
      });
    });
  }

  _checkTwttr() {
    setTimeout(() => {
      if (typeof twttr !== 'undefined' && typeof twttr.widgets !== 'undefined' && typeof twttr.widgets.createTimeline === 'function') {
        this._buildWidget();
      } else {
        this._checkTwttr();
      }
    }, 50);
  }
}
Polymer(twitterTimeline);
