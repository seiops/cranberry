class CranberrySyncronex {
  beforeRegister() {
    this.is = 'cranberry-syncronex';
    this.properties = {
      exclusive: {
        type: Boolean,
        notify: true
      },
      syncronex: {
        type: Boolean,
        value: false,
        notify: true
      },
      user: {
        type: Object
      }
    };
    this.observers = [
      '_onAccountChanged(user.sessionaccount)'
    ];
  }

  attached() {
    this.async(function() {
      console.info('\<cranberry-syncronex\> attached');
    });
  }

  _onAccountChanged(account) {
    if (typeof account !== 'undefined' && account !== '') {
      console.info('\<cranberry-syncronex\> account changed');

      let session = this.get('user.sessionid');

      this.async(function(){
        this._syncronexMeterAuth(account, session);
      });
    } else {
      this.set('syncronex', false);
    }
  }

  _handleSyncronexResponse(response) {
    console.info('\<cranberry-syncronex\> meter response received');

    let result = response.detail;

    switch(result.authorized) {
      case 'true':
        console.info('\<cranberry-syncronex\> user authorized');
        this.set('syncronex', true);
        break;
      case 'false':
        console.info('\<cranberry-syncronex\> user not authorized');
        this.set('syncronex', true);
        break;
      default:
        this.set('syncronex', false)
        break;
    }
  }

  _syncronexMeterAuth(account, session) {
    console.info('\<cranberry-syncronex\> authenticating with meter');
    let user = this.get('user');

    this.async(function() {
      let params = {
        format: 'jsonp',
        userid: account,
        contentid: 'exclusive',
        sessionId: session,
        clientInfo: 'desktop'
      };

      console.dir(params);

      this.$.syncronexAuthRequest.url = 'https://syncaccess-sng-og.syncronex.com/sng/og/api/svcs/meter/standard';
      this.$.syncronexAuthRequest.params = params;
      this.$.syncronexAuthRequest.generateRequest();
    });
  }

  // _onContentChanged(newValue) {
  //   this.async(function() {
  //     console.info('\<cranberry-syncronex\> (development) content changed');
  //
  //     let el = this.get('content');
  //
  //     if (typeof el !== 'undefined' && typeof el.storyExclusive !== 'undefined') {
  //       console.dir(el);
  //
  //       if (typeof el !== 'undefined' && typeof el.storyExclusive !== 'undefined' && el.storyExclusive === false) {
  //         console.info('\<cranberry-syncronex\> (development) content conditional 1');
  //       } else {
  //         console.info('\<cranberry-syncronex\> (development) content conditional 2');
  //       }
  //     }
  //   });
  // }

}
Polymer(CranberrySyncronex);
