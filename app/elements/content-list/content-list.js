/*
@license
Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

/* Gigya Socialize JS library integration */

class ContentList {

  handleResponse (data) {
    var restResponse = JSON.parse(data.detail.Result);

    this.items = restResponse;

    // var responseMessage = '';

    // if (typeof restResponse !== undefined && restResponse.errorCode === 0) {

    //   var params = {
    //       provider:restResponse.loginProvider,
    //       callback: this._onlogin(data),
    //       UID: restResponse.UID,
    //       UIDSignature: restResponse.UIDSignature,
    //       signatureTimestamp: restResponse.signatureTimestamp
    //   };

    //   restResponse.callback = this._onlogin(data);


    //   gigya.socialize.getUserInfo(params);

    //   responseMessage = 'User: ' + restResponse.profile.nickname + '<br />UID: ' + restResponse.UID + '<br />Signature: ' + restResponse.UIDSignature + '<br />Provider: ' + restResponse.loginProvider;
    // } else {
    //   responseMessage = restResponse.errorDetails;
    // }


    // form.querySelector('.output').innerHTML = responseMessage;
  }

  beforeRegister() {
    this.is = 'content-list';
    this.properties = {
      rest: {
        type: String,
        value: "http://sedev.libercus.net/rest.json",
        notify: true
      },
      params: {
        type: Object,
        value: [],
        observer: '_changeParams',
        notify: true
      },
      items: {
        type: Object,
        value: [],
        notify: true
      },
      type: {
        type: String,
        value: "default",
        observer: '_changeType'
      },
      sections: {
        type: String,
        value: "News",
        observer: '_changeSections'
      },
      count: {
        type: Number,
        value: 10,
        observer: '_changeCount'
      },
      start: {
        type: Number,
        value: 1,
        observer: '_changeStart'
      }
    };
  }

  // Public methods.
  attached() {
    app.logger('\<content-list\> attached');

    this._updateParams();
  }

  ready() {
    app.logger('\<content-list\> ready');
  }


  // Private methods
  _checkItem(item,index) {
    let modulus = index % 2;

    if (index > 0 && modulus === 0) {
      return true;
    } else {
      return false;
    }
  }

  _changeCount() {
    console.log('Changed count:', this.count);
  }

  _changeParams() {
    let params = this.get('params');

    if (params.length !== 0 && params.desiredCount) {
      this.$.request.url = this.rest;

      this.$.request.params = params;

      this.$.request.generateRequest();
    }
  }

  _changeStart() {

  }

  _changeSections() {

  }

  _changeType() {

  }

  _hasImage(image) {
    console.log(image);
    if(typeof image !== 'undefined' && image.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  _hasPreview(preview) {
    console.log('_hasPreview', preview);
    if(typeof preview !== 'undefined' && preview.length > 0) {
      console.log('true');
      return true;
    } else {
      console.log('false');
      return;
    }
  }

  _isStory(item) {
    if(item === 'Story') {
      return true;
    } else {
      return false;
    }
  }

  _trimText(text) {
    let trunc = text;

    if (trunc.length > 125) {
      trunc = trunc.substring(0, 125);
      trunc = trunc.replace(/\w+$/, '');
      trunc += '...';
    }

    return trunc;
  }

  _updateParams() {
    let jsonp = {};

    jsonp.request = "content-list";
    jsonp.desiredSection = this.get('sections');
    jsonp.desiredContent = this.get('type');
    jsonp.desiredCount = this.get('count');

    this.set('params', jsonp);
  }

}

Polymer(ContentList);
