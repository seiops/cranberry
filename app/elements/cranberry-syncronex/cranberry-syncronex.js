class CranberrySyncronex {
  beforeRegister() {
    this.is = 'cranberry-syncronex';
    this.properties = {
      content: {
        type: Object,
        observer: '_onContentChanged'
      },
      exclusive: {
        type: Boolean,
        notify: true
      },
      sessionId: {
        type: String
      },
      sessionLabel: {
        type: String
      },
      user: {
        type: Object,
        observer: '_onUserChanged'
      }
    }
  }

  attached() {
    this.async(function() {
      console.info('\<cranberry-syncronex\> (development) attached');

      this._getSessionData();
    });
  }

  _buildUser(user) {
    this.async(function() {
      console.info('\<cranberry-syncronex\> (development) login Libercus');

      // Check for a valid profile object.
      if (typeof user !== 'undefined' && typeof user.statusCode !== 'undefined' && user.statusCode === 200) {
          console.info('\<cranberry-syncronex\> (development) user found');
          console.dir(user);

          // Initialize empty data object.
          let data = {};

          // Check profile.username value, use nickname if no username.
          if (typeof user.nickname !== 'undefined') {
              data.nickName = user.nickname;
          } else if (typeof profile.nickname !== 'undefined') {
              data.nickName = user.email;
          }

          // Check for profile.firstName, use e-mail if no firstName.
          if (typeof user.firstName !== 'undefined') {
              data.firstName = user.firstName;
          } else {
              data.firstName = user.email;
          }

          // Check for profile.lastName, use e-mail if no firstName.
          if (typeof user.lastName !== 'undefined') {
              data.lastName = user.lastName;
          } else {
              data.lastName = user.email;
          }

          // Set Gigya UID and email for Libercus data object.
          data.UID = user.UID;
          data.email = user.email;

          let label = this.get('sessionLabel');
          // Set session label for Libercus.
          data[label] = this.get('sessionId');

          console.info('\<cranberry-syncronex\> (development) user data object built');
          console.dir(data);

          this._loginLibercus(data);
          console.log('should be logging in here.');
        } else {
          console.info('\<cranberry-syncronex\> (development) no user data');
        }
    });
  }

  _getSessionData() {
    let sessionCheck = this.get('sessionId');

    if (typeof sessionCheck === 'undefined' || sessionCheck.length === 0) {
      console.info('\<cranberry-syncronex\> (development) retrieving session data');

      this.$.sessionRequest.url = 'http://srdevcore.libercus.net/ajaxquery/userinfo';
      this.$.sessionRequest.params = '';
      this.$.sessionRequest.generateRequest();
    }
  }

  _handleSessionResponse(response) {
    console.info('\<cranberry-syncronex\> (development) session response received');

    let result = JSON.parse(response.detail.Result);

    this.set('sessionLabel', result.sessionLabel);
    this.set('sessionId', result.sessionId);
  }

  _handleLibercusResponse(response) {
    console.info('\<cranberry-syncronex\> (development) Libercus response received');
    console.dir(response);
  }

  _loginLibercus(params) {
    console.info('\<cranberry-syncronex\> (development) Logging in to Libercus');

    this.$.libercusRequest.url = 'http://srdevcore.libercus.net/.auth';
    this.$.libercusRequest.params = params;
    this.$.libercusRequest.generateRequest();
  }

  _onUserChanged(user) {
    console.info('\<cranberry-syncronex\> (development) user changed');

    this.async(function() {
      this._buildUser(user);
    });
  }

  _onContentChanged(newValue) {
    this.async(function() {
      console.info('\<cranberry-syncronex\> (development) content changed');

      let el = this.get('content');
      let user = this.get('user');

      if (typeof el !== 'undefined' && typeof el.storyExclusive !== 'undefined') {
        console.dir(el);

        if (typeof el !== 'undefined' && typeof el.storyExclusive !== 'undefined' && el.storyExclusive === false) {
          console.info('\<cranberry-syncronex\> (development) content conditional 1');
        } else {
          console.info('\<cranberry-syncronex\> (development) content conditional 2');
        }
      }
    });
  }

}
Polymer(CranberrySyncronex);
