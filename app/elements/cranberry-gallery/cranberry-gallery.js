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
    console.info(e);
    console.info('Tapped');
    let slider = this.querySelector('awesome-slider');
    let imageIndex = e.target.parentElement.dataset.index;

    console.info(imageIndex);

    // SETUP GOTO FUNCTIONALITY!

  }
  _buyImage() {
    let slider = this.querySelector('awesome-slider');
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
    this.gallery = restResponse;

    let slider = document.createElement('cranberry-slider');
    slider.featured = this.gallery;
    Polymer.dom(this.$.galleryContainer).appendChild(slider);
  }

  onRouteChanged(newValue, oldValue) {
    console.info('The route has changed');
    let slider = this.$$('cranberry-slider');

    console.info(slider);
  }
}
Polymer(cranberryGallery);
