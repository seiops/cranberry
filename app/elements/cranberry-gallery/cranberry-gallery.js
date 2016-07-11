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
      tags: {
        type: Array
      }
    };
    this.listeners = {
      'buyButton.tap': '_buyImage',
      'images.tap': '_goToSlide',
      'modalOpen.tap': '_openModal',
      'modalClose.tap': '_closeModal'
    };
  }

  _goToSlide(e) {
    let mainSlider = this.querySelector('#mainSlider');
    let imageIndex = Number(e.target.parentElement.dataset.index);

    mainSlider.goTo(mainSlider, imageIndex);
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

  _openModal() {
    this.sliderMove('open');
  }

  _closeModal() {
    this.sliderMove('close');
  }

  sliderMove(type) {
    let modal = this.$.modal;
    let modalSlider = modal.querySelector('#modalSlider');
    let mainSlider = this.querySelector('#mainSlider');
    let mainIndex = mainSlider.index;
    let modalIndex = modalSlider.index;

    // Move slider for main or modal depending on event
    if (mainIndex !== modalIndex) {
      if (type === 'close') {
        mainSlider.goTo(mainSlider, modalIndex);
      } else {
        modalSlider.goTo(modalSlider, mainIndex);
      }
    }

    // Toggle the open/close event
    modal.toggle();

  }

  handleResponse(data) {
    var restResponse = JSON.parse(data.detail.Result);
    // Assign restResponse to data bound object gallery
    this.set('gallery', restResponse);
    // Set tags variable to the tags response
    this.set('tags', restResponse.tags.split(','));
  }

  onRouteChanged(newValue, oldValue) {
    if (typeof oldValue !== 'undefined') {
      if (newValue.path.replace('/', '') === 'gallery-content') {
        let mainSlider = this.querySelector('#mainSlider');
        mainSlider.endLoading(slider, 0, "next");
      }
    }
  }
}
Polymer(cranberryGallery);
