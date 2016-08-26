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
      response: {
        type: Object
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

  _handleLoad() {
      app.logger('<\scorestream-widget\> load received');
  }

  _handleResponse() {
      app.logger('<\scorestream-widget\> response received');
  }

  _parseResponse(response) {
    var result = JSON.parse(response.Result);

    // If the response is not empty and it has scoreboards set values
    if (Object.keys(result).length > 0 && typeof result.scoreboards !== 'undefined') {
      this.set('masterSwitch', result.masterSwitch);
      this.set('scoreboardSwitch', result.scoreboards[0].scoreboardOn);
      this.set('widgetId', result.scoreboards[0].horizontalId);
    } else {
      // Otherwise turn the whole thing off
      this.set('isOff', true);
    }
  }

  _turnOnOff(masterSwitch, scoreboardSwitch) {
    // Function to set individual board on or off depending on response
    if(masterSwitch) {
      this.set('isOff', true);
    } else {
      if (scoreboardSwitch) {
        this.set('isOff', true);
      } else {
        this.set('isOff', false);
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

  _onSectionChanged() {
    let route = this.get('route');
    this.async(function() {
      let hidden = this.get('hidden');

      if (!hidden) {
        if (typeof route.section !== 'undefined') {
          let section = route.section;
          let path = route.path;

          let request = this.$.request;
          let params = {};

          // Wipe current setup
          this.set('widgetId', '');
          this.set('widgetUrl', '');

          params.request = 'congero';
          params.desiredContent = 'scorestream';
          request.setAttribute('url', this.get('rest'));

          // If homepage
          if (section === '') {
            params.desiredTeam = 'Home Scoreboard';
          } else {
            params.desiredTeam = section.replace(/-/g, ' ');
          }

          request.params = params;
          request.generateRequest();
        }
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
