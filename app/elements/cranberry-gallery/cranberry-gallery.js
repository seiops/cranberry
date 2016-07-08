class cranberryGallery {
  beforeRegister() {
    this.is = 'cranberry-gallery';
    this.properties = {
      gallery: {
        type: Object
      },
      route: {
        type: Object,
        observer: 'onRouteChanged'
      },
      loaded: {
        type: Boolean,
        value: false
      }
    };
    this.listeners = {
      'buyButton.tap': '_buyImage',
      'images.tap': '_goToSlide'
    };
  }

  _goToSlide(e) {
    let slider = this.querySelector('cranberry-slider');
    let imageIndex = Number(e.target.parentElement.dataset.index);

    slider.goTo(slider, imageIndex, "next");
  }
  _buyImage() {
    let slider = this.querySelector('cranberry-slider');
    let images = slider.items;
    let currentIndex = slider.index;
    let currentImage = images[currentIndex].src;

    let capture = {
        sDomain: "http://standard.mycapture.com/mycapture/remoteimage.asp",
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

  handleResponse(data) {
    var restResponse = JSON.parse(data.detail.Result);
    // Assign restResponse to data bound object gallery
    this.set('gallery', restResponse);
  }

  onRouteChanged(newValue, oldValue) {
    console.info(newValue);
    console.info(oldValue);
    if (typeof oldValue !== 'undefined') {
      if (newValue.path.replace('/', '') === 'gallery-content') {
        let slider = this.$$('cranberry-slider');
        let loader = slider.get('loader');
        let animationEvent = slider.get('animationEvent');
        console.info('doing route change stuff!');
        console.info(loader);
        // loader.removeEventListener(animationEvent, slider.loadingEnd);
        slider.endLoading(slider, 0, "next");
      }
    }
  }
}
Polymer(cranberryGallery);
