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
      console.info('\<cranberry-syncronex\> session information changed');

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

      this.$.syncronexAuthRequest.url = 'https://syncaccess-sng-og.syncronex.com/sng/og/api/svcs/meter/standard';
      this.$.syncronexAuthRequest.params = params;
      this.$.syncronexAuthRequest.generateRequest();
    });
  }

  _onContentChanged(content) {
    console.info('\<cranberry-syncronex\> content changed');

    this.async(function() {
      if (typeof content !== 'undefined' && typeof content.storyExclusive !== 'undefined'){
        if (content.storyExclusive === true) {
          this.set('exclusive', true);
        } else {
          this.set('exclusive', false);
        }
      }
    });
  }

  // syncronexSubscriberLookup: function () {
  //   console.log('⚪ [USER] Subscriber lookup request sent.');
  //   var $lookupButton = $('#lookupMember'),
  //   $memberInformation = $('#memberInformation'),
  //   firstName = $('#memberFirstName').val(),
  //   lastName = $('#memberLastName').val(),
  //   phoneNumber = $('#memberPhoneNumber').val(),
  //   data = {
  //     'firstName': firstName,
  //     'lastName': lastName,
  //     'phoneNumber': phoneNumber
  //   };
  //   $.ajax({
  //     cache: false,
  //     data: data,
  //     type: 'POST',
  //     url: 'https://syncaccess-sng-og.syncronex.com/sng/og/api/svcs/subscriber/lookup?format=json',
  //     success: function (response) {
  //       console.log('✅ [USER] Subscriber lookup successful.');
  //       var message = '',
  //       alert = '';
  //       if (typeof response.hostSubscriber !== 'undefined') {
  //         if (response.hostSubscriber.isActive !== 'true') {
  //           message = 'Active subscriber found.<br /></div><div class="text-center"><a id="linkMember" class="button small radius">Link Account</a>';
  //           alert = 'success';
  //         } else {
  //           message = 'An account with matching information was found but there is no active subscription.';
  //           alert = 'alert';
  //         }
  //       }
  //       user.syncronexLookupStatus(alert, message, function () {
  //         var $linkButton = $("#linkMember");
  //         if (typeof $linkButton !== 'undefined') {
  //           $linkButton.unbind('click').on('click', Foundation.utils.debounce(function (e) {
  //             user.syncronexLookupStatus();
  //             user.sycnronexLinkAccount(response.hostSubscriber);
  //           }, 1500, true));
  //         }
  //         if ($lookupButton.hasClass('disabled')) {
  //           $lookupButton.removeClass('disabled');
  //         }
  //       });
  //     },
  //     error: function (response) {
  //       console.error('🔴 [USER] Subscriber lookup failed.');
  //       console.error(response);
  //       var responseStatus = response.status,
  //       errorMessage = '';
  //       if ($lookupButton.hasClass('disabled')) {
  //         $lookupButton.removeClass('disabled');
  //       }
  //       switch (responseStatus) {
  //         case 400, 404:
  //         errorMessage = 'Subscriber not found in circulation system.';
  //         break;
  //         default:
  //         errorMessage = response.responseJSON.responseStatus.message;
  //         break;
  //       };
  //       user.syncronexLookupStatus('alert', errorMessage);
  //     }
  //   });
  // },
  // sycnronexLinkAccount: function (syncronexUser) {
  //   console.log('⚪ [USER] Subscriber link account request sent.');
  //   var $memberInformation = $('#memberInformation'),
  //   data = {
  //     'userName': user.gigyaUser.UID,
  //     'hostKey': syncronexUser.hostKey,
  //     'firstName': syncronexUser.firstName,
  //     'lastName': syncronexUser.lastName,
  //     'address1': syncronexUser.address1,
  //     'city': syncronexUser.city,
  //     'state': syncronexUser.state,
  //     'zipCode': syncronexUser.zipCode,
  //     'email': user.gigyaUser.profile.email,
  //     'phoneNumber': syncronexUser.phoneNumber,
  //     'password': '24/BE;>}698x[%9$;qu37A>4&8'
  //   };
  //   $.ajax({
  //     cache: false,
  //     data: data,
  //     type: 'POST',
  //     url: 'https://syncaccess-sng-og.syncronex.com/sng/og/api/svcs/registerhostsubscriber?format=json',
  //     success: function (response) {
  //       if (typeof response.completionStatus !== 'undefined' && response.completionStatus !== 'Completed') {
  //         console.error('🔴 [USER] Linking account failed.');
  //         console.error(response);
  //         user.syncronexLookupStatus('error', 'There was an error linking your account.');
  //         return;
  //       }
  //       user.updateLibercusUser(response.userID, user.gigyaUser.profile.email);
  //       user.syncronexLogon(user.gigyaUser.UID);
  //       user.syncronexLookupStatus('success', 'Account linked successfully.', function () {
  //         var redirectTo = utilities.getUrlParamValue('returnUrl');
  //         if (typeof redirectTo === 'undefined') {
  //           redirectTo = 'http://' + window.location.hostname + '/member-linked';
  //         }
  //         setTimeout(function () {
  //           window.location = decodeURIComponent(redirectTo);
  //         }, 2000);
  //       });
  //     },
  //     error: function (response) {
  //       console.error('🔴 [USER] Syncronex registration failed.');
  //       var responseStatus = response.status,
  //       errorMessage = '',
  //       customerService = '</div><div class="panel text-center">Please call our Member Services department at 801.625.4400 for further assistance.';
  //       switch (responseStatus) {
  //         case 400:
  //         errorMessage = 'A print account has already been linked with this website login.' + customerService;
  //         break;
  //         default:
  //         errorMessage = response.responseJSON.responseStatus.message;
  //         break;
  //       };
  //       user.syncronexLookupStatus('alert', errorMessage);
  //     }
  //   });
  // },
  // syncronexLookupStatus: function (alertClass, message, callback) {
  //   var $memberInformation = $('#memberInformation');
  //   if (typeof alertClass !== 'undefined' && typeof message !== 'undefined') {
  //     html = '<p><div data-alert class="alert-box ' + alertClass + ' radius text-center">' + message + '</div></p>';
  //   } else {
  //     html = '<p class="text-center prepend-line"><i class="fa fa-spinner fa-spin fa-2x"></i></p>';
  //   }
  //   $memberInformation.fadeOut('fast', function () {
  //     $(this).html(html);
  //     $(this).fadeIn('fast');
  //     if (typeof callback === 'function') {
  //       callback();
  //     }
  //   });
  // },
  // syncronexLogon: function (syncronexUserName) {
  //   console.log('⚪ [USER] Syncronex logon request sent.');
  //   var syncUrl = 'https://syncaccess-sng-og.syncronex.com/sng/og/api/svcs/simplelogon?format=json',
  //   data = {
  //     'userName': syncronexUserName,
  //     'password': '24/BE;>}698x[%9$;qu37A>4&8'
  //   };
  //   $.ajax({
  //     cache: false,
  //     data: data,
  //     type: 'POST',
  //     url: syncUrl,
  //     success: function () {
  //       console.log('✅ [USER] Syncronex logon successful.');
  //     },
  //     error: function (response) {
  //       console.error('🔴 [USER] Syncronex logon failed.');
  //       console.error(response);
  //     }
  //   });
  // },
  // updateLibercusUser: function (syncronexUserId, gigyaEmail) {
  //   console.log('⚪ [User] Updating account information...');
  //   var data = {
  //     'syncronexAccount': syncronexUserId,
  //     'emailAddress': gigyaEmail
  //   };
  //   $.ajax({
  //     cache: false,
  //     data: data,
  //     dataType: 'jsonp',
  //     jsonp: 'callback',
  //     type: 'POST',
  //     url: 'https://' + window.location.hostname + '/user-api',
  //     success: function () {
  //       console.log('✅ [User] Account updated successfully.');
  //     },
  //     error: function (response) {
  //       console.error('🔴 [User] Update failed.');
  //       console.error(response);
  //     }
  //   });
  // }
}
Polymer(CranberrySyncronex);
