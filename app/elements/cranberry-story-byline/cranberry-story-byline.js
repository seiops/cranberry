class cranberryStoryByline {
  beforeRegister() {
    this.is = 'cranberry-story-byline';
    this.properties = {
      baseDomain: String,
      byline: {
        type: Object,
        value: {}
      },
      displayByline: {
        type: Object,
        value: {},
        notify: true
      },
      hasByline: {
        type: Boolean,
        value: false
      }
    }
    this.observers = ['_setupByline(byline)']
  }

  // Lifycyle Methods
  attached() {
    console.info('\<cranberry-story-byline\> attached');
  }

  detached() {
    console.info('\<cranberry-story-byline\> detached');
  }

  // Private Methods
  _computeBylineImageURL(url) {
    console.log('Computing on ' + url);
    let baseDomain = this.get('baseDomain');

    if (typeof url === 'undefined' || url === '') {
      return '../images/story/unavail.png';
    } else {
      return baseDomain + url;
    }
  }
  
  _computeBylineURL(byline) {
    if (typeof byline.bylineid !== 'undefined' && byline.bylineid !== '') {
      return byline.bylineid;
    } else {
      return byline.first + '/' + byline.last;
    }
  }
  
  _setupByline(byline) {
    if (typeof byline !== 'undefined' && Object.keys(byline).length > 0) {
      let tempObject = {};

      this.async(function()  {
        tempObject.image = byline.image;

        if (typeof byline.bylineid !== 'undefined') {
          tempObject.bylineid = byline.bylineid;
          tempObject.title = (byline.title !== '') ? byline.title : byline.first + ' ' + byline.last;
          tempObject.inputByline = byline.inputByline;
          tempObject.location = byline.location;
          tempObject.profileUrl = '/profile/' + byline.bylineid;

          this.set('hasProfile', true);
        } else {
          this.set('hasProfile', false);
          tempObject.profileUrl = '';
          if (typeof byline.line1 !== 'undefined' && typeof byline.line2 !== 'undefined') {
            if (byline.line1 !== '') {
              tempObject.title = byline.line1;
            }
            if (byline.line2 !== '') {
              tempObject.location = byline.line2;
            }
          } else {
            tempObject.title = byline.inputByline;
          }
        }

        this.set('displayByline', tempObject);
      });
    } else {
      this.set('hasProfile', false);
      this.set('displayByline', {});
    }
    
  }
}
Polymer(cranberryStoryByline);
