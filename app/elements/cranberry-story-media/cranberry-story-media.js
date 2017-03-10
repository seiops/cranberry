class cranberryStoryMedia {
  beforeRegister() {
    this.is = 'cranberry-story-media';
    this.properties = {
      attachments: Array,
      baseDomain: String,
      content: Object,
      displaySlider: {
        type: Boolean,
        value: false
      },
      firstTag: {
        type: String,
        value: ''
      },
      hasContentToDisplay: {
        type: Boolean,
        value: false
      },
      hasShortcode: Boolean,
      hidden: {
        type: Boolean,
        value: true
      },
      hideContent: {
        type: Boolean,
        value: false
      },
      leadShortcodeType: String,
      leadShortcodeContent: Object,
      media: Array,
      myCaptureUrl: String,
      route: Object,
      videos: Array
    };
    this.observers = [
      '_checkMediaLength(media)',
      '_contentChanged(content)',
      '_checkShortcodeType(hasShortcode)',
      '_hideContent(hideContent)'
    ];
  }

  _checkMediaLength(media) {
    if (typeof media !== 'undefined') {
      if (media.length > 1) {
        this.set('displaySlider', true);
      } else {
        this.set('displaySlider', false);
      }
    } else {
      this.set('displaySlider', false);
    }
  }

  _checkTags(tags) {
    if (typeof tags !== 'undefined' && tags.length > 0) {
      return false;
    } else {
      return true;
    }
  }

  _computeImageUrl(image) {
    if (typeof image !== 'undefined' && typeof image.exlarge !== 'undefined') {
      let baseDomain = this.get('baseDomain');

      return baseDomain + image.exlarge;
    }
  }

  _contentChanged(content, oldContent) {
    if (typeof content !== 'undefined') {
      if (typeof content.tags !== 'undefined') {
        let tagsArray = content.tags.split(',');
        this.set('firstTag', tagsArray[0]);
      }
      if (typeof content.mediaAssets !== 'undefined' && typeof content.mediaAssets.images !== 'undefined' && content.mediaAssets.images.length > 0) {
        this.set('hasContentToDisplay', true);
      } else {
        this.set('hasContentToDisplay', false);
      }
      
    }
  }

  _displayCaption(image) {
    if (typeof image !== 'undefined' && ( (typeof image.caption !== 'undefined' && image.caption !== '') || (typeof image.credit !== 'undefined' && image.credit !== '') )) {
      return false;
    } else {
      return true;
    }
  }

  _buyImage() {
    let slider = Polymer.dom(this.root).querySelector('#mainSlider');
    let currentImage = Polymer.dom(slider.root).querySelector('iron-image').src;
    let myCapture = this.get('myCaptureUrl');

    let capture = {
        sDomain: myCapture,
        setImgParams: function () {
            var sImg = currentImage;
            capture.sImage = "?image=" + encodeURIComponent(sImg); // formatted sImg for preview
            capture.sNotes = "&notes=" + encodeURIComponent(sImg.replace(sImg.split('/')[7] + "/", "")); // full res image for auto image retrieval
            capture.sBackURL = "&backurl=" + encodeURIComponent(window.location.origin + window.location.pathname + window.location.hash);
            var sMyCapURL = capture.sDomain + capture.sImage + capture.sNotes + capture.sBackText + capture.sBackURL;
            window.open(sMyCapURL, '_blank');
        }
    };
    capture.setImgParams();
  }

  _openModal () {
    let baseUrl = this.get('baseDomain');
    let slider = document.createElement('cranberry-slider');
    let gallery = this.get('content');

    this.async(() => {
      slider.set('items', gallery.mediaAssets.images);
      slider.set('baseUrl', baseUrl);
      slider.set('whiteText', true);
      slider.set('gallery', gallery);
      slider.set('hidden', false);

      let modal = Polymer.dom(document).querySelector('cranberry-base').querySelector('#globalModal');

      let modalContent = Polymer.dom(modal).querySelector('paper-dialog-scrollable').querySelector('#scrollable').querySelector('.content-area');

      modalContent.appendChild(slider);

      modal.open();
      modal.refit();
    });
  }

  _checkShortcodeType(hasShortcode) {
    this.async(() => {
      if (typeof hasShortcode !== 'undefined' && hasShortcode) {
        let shortcodeType = this.get('leadShortcodeType');

        if (shortcodeType === 'image') {
          this.set('imageShortcode', true);
        } else {
          this.set('imageShortcode', false);
        }

        if (shortcodeType === 'youtube') {
          this.set('youtubeShortcode', true);
        } else {
          this.set('youtubeShortcode', false);
        }
      }
    });
  }

  _hideContent(hideContent) {
    this.async(() => {
      if (typeof hideContent !== 'undefined' && hideContent) {
        this.set('hasContentToDisplay', false);
      }
    });
  }

  // Lifycyle Methods
  attached() {
    console.info('\<cranberry-story-media\> attached');
  }

  detached() {
    console.info('\<cranberry-story-media\> detached');
  }

  // Private Methods
  _scrollToComments() {
    this.fire('iron-signal', {name: 'scroll-to-comments'});
  }
}
Polymer(cranberryStoryMedia);
