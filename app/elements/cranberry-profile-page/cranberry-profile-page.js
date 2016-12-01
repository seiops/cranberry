class cranberryProfilePage {
  beforeRegister() {
    this.is = 'cranberry-profile-page';
    this.properties = {
      route: {
        type: Object,
        observer: '_routeChanged'
      },
      userId: {
        type: Number
      },
      fname: {
        type: String
      },
      lname: {
        type: String
      },
      profile: {
        type: Object,
        observer: '_profileChanged'
      },
      content: {
        type: Object,
        observer: '_contentChanged'
      },
      featuredContent: {
        type: Object
      },
      rest: String,
      baseUrl: String,
      hideContent: {
        type: Boolean,
        value: true
      }
    }
    this.observers = [
      '_fetchProfile(userId)',
      '_fetchProfileWithName(fname, lname)',
      '_fetchContentWithName(fname, lname)'
    ]
  }

  ready() {
  }

  _routeChanged(newRoute, oldRoute) {
    let pathArray = newRoute.path.split('/');
    
    if (pathArray.length > 2) {
      this.set('fname', pathArray[1]);
      this.set('lname', pathArray[2]);
    } else {
      this.set('userId', pathArray[1]);
    }
  }

  _fetchProfile(userId) {
    // Fetch profile with just userId
    if (typeof userId !== 'undefined') {
      console.log('FETCH WITH ' + userId);
      this._setupProfileRequest(true);
      // http://srdevcore.libercus.net/rest.json?request=congero&desiredContent=staffMember&userid=24644
    }
  }

  _fetchProfileWithName(fname, lname) {
    let userId = this.get('userId');
    // Fetch profile with the first and last names setting userid to 999
    if (typeof fname !== 'undefined' && typeof lname !== 'undefined' && (typeof userId === 'undefined' || userId === '')) {
      console.log('FETCH WITH NAME ' + fname + ' ' + lname);
      this._setupProfileRequest(false);
      // http://srdevcore.libercus.net/rest.json?request=congero&desiredContent=staffMember&userid=999&fname=fname&lname=lname
    }
  }

  _fetchContentWithName(fname, lname) {
    console.log('Fetching content');
    // Fetch content with the first and last names
    if (typeof fname !== 'undefined' && typeof lname !== 'undefined') {
      let requester = this.$.profileListRequest;

      requester.url = this.rest;
      requester.setAttribute('callback-value', 'profileListCallback');

      let params = {};

      params.request = 'content-list';
      params.desiredContent = 'story_gallery';
      params.desiredStart = '1';
      params.desiredFeaturedCount = '1';
      params.desiredStoryByline = fname + ' ' + lname;

      requester.set('params', params);
      requester.generateRequest();
    }
  }

  _setupProfileRequest(useUserId) {
    let requester = this.$.profileRequest;

    requester.url = this.rest;
    requester.setAttribute('callback-value', 'profileCallback');

    let params = {};

    params.request = 'congero';
    params.desiredContent = 'staffMember';

    if (useUserId) {
      let userId = this.get('userId');

      params.userId = userId;
    } else {
      let fname = this.get('fname');
      let lname = this.get('lname');

      params.fname = fname;
      params.lname = lname;
      params.userId = 999;
    }

    requester.set('params', params);
    requester.generateRequest();
  }

  _handleResponse(json) {
    console.info('\<cranberry-profile-page\> json response received');

    let result = JSON.parse(json.detail.Result);

    this.set('profile', result);
    if (typeof result.first !== 'undefined' && typeof result.last !== 'undefined' && result.first !== '' && result.last !== '') {
      this.set('fname', result.first);
      this.set('lname', result.last);
    }
  }

  _handleListResponse(json) {
    console.info('\<cranberry-profile-page\> json content response received');

    let result = JSON.parse(json.detail.Result);

    this.set('featuredContent', result.featured[0]);
    this.set('content', result.content);
  }

  _profileChanged(newValue, oldValue) {
    console.dir(newValue);
  }

  _contentChanged(newValue, oldValue) {
    if (typeof newValue !== 'undefined' && newValue.length > 0) {
      this.set('hideContent', false);
    } else {
      this.set('hideContent', true);
    }
  }

}
Polymer(cranberryProfilePage);
