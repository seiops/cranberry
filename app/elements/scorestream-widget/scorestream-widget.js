class scorestreamWidget {
  beforeRegister() {
    this.is = 'scorestream-widget';
    this.properties = {
      widgetId: {
        type: Number,
        observer: '_updateUrl'
      },
      widgetUrl: {
        type: String
      },
      scoreStreamUrl: {
        type: String,
        value: 'https://scorestream.com/widgets/scoreboards/horz?userWidgetId='
      },
      isOff: {
        type: Boolean,
        value: true,
        oberver: '_changeVisibility'
      },
      route: {
        type: Object
      },
      section: {
        type: String,
        observer: '_onSectionChanged'
      },
      rest: {
          type: String
      },
      response: {
          type: Object,
          observer: '_parseResponse'
      },
      masterSwitch: {
        type: Boolean,
        value: false
      },
      scoreboardSwitch: {
        type: Boolean,
        value: false
      },
      hidden: {
        type: Boolean,
        value: true
      }
    }
    this.observers = ['_turnOnOff(masterSwitch, scoreboardSwitch)'];
  }

  _computeShow(widgetUrl, isOff) {
    if (widgetUrl.length > 0 && !isOff) {
      return true;
    } else {
      return false;
    }
  }

  _handleLoad() {
      console.info('<\scorestream-widget\> load received');
  }

  _handleResponse() {
      console.info('<\scorestream-widget\> response received');
  }

  _parseResponse(response) {
    if (typeof response !== 'undefined') {
      var result = JSON.parse(response.Result);

      // If the response is not empty and it has scoreboards set values
      if (Object.keys(result).length > 0 && typeof result.scoreboards !== 'undefined') {
        let masterSwitch = (result.masterSwitchOn === 'true');
        let scoreboardSwitch = (result.scoreboards[0].scoreboardOn === 'true');

        this.set('masterSwitch', masterSwitch);
        this.set('scoreboardSwitch', scoreboardSwitch);

        if (masterSwitch && scoreboardSwitch) {
          this.set('widgetId', result.scoreboards[0].horizontalId);
        }
      } else {
        // Otherwise turn the whole thing off
        this.set('isOff', true);
      }
    }
  }

  _turnOnOff(masterSwitch, scoreboardSwitch) {
    // Function to set individual board on or off depending on response
    if(!masterSwitch) {
      this.set('isOff', true);
    } else {
      if (scoreboardSwitch) {
        this.set('isOff', false);
      } else {
        this.set('isOff', true);
      }
    }
  }

  _changeVisibility(off) {
    // Function to hide board if off
    if (off) {
      this.hidden = true;
    } else {
      this.hidden = false;
    }
  }

  _onSectionChanged(section, oldSection) {
    this.async(() => {
      console.log('The section has changed in scorestream!');
      console.log(`Section: ${section}`);
      if (typeof section !== 'undefined') {
        let request = this.$.request;
        let params = {};

        // Wipe current setup
        this.set('widgetId', '');
        this.set('widgetUrl', '');

        params.request = 'congero';
        params.desiredContent = 'scorestream';
        request.setAttribute('url', this.get('rest'));

        // If homepage
        if (section === 'homepage') {
          params.desiredTeam = 'Home Scoreboard';
        } else {
          params.desiredTeam = section.replace(/-/g, ' ');
        }

        request.params = params;
        request.generateRequest();
      }
    });
  }

  _updateUrl(newValue) {
    // Update the URL if the widgetId isn't blank
    if (newValue !== '') {
      let scoreStreamUrl = this.get('scoreStreamUrl');

      this.set('widgetUrl', scoreStreamUrl + newValue);
    }
  }



}
Polymer(scorestreamWidget);
