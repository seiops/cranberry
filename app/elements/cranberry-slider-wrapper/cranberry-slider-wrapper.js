class cranberrySliderWrapper {
  beforeRegister() {
    this.is = 'cranberry-slider-wrapper';
    this.properties = {
      featuredTitle: {
        type: String
      },
      links: {
        type: Array
      },
      route: {
        type: Object,
        observer: 'routeChanged'
      },
      isShortcode: {
        type: Boolean
      }
    };
    this.computeShowTitle = function (index) {
      if (index === 0) {
        return true;
      } else {
        return false;
      }
    };
    this.computeIfShortcode = function (isShortcode) {
      if (isShortcode === true) {
        return true;
      }
    };
  }

  // attached() {
  //
  //   let awesomeSlider = this.$.slider;
  //   let myElement = this;
  //
  //   this.async(function() {
  //     let items = awesomeSlider.content.getDistributedNodes();
  //     let oldNext = awesomeSlider.next;
  //
  //     myElement.featured.mediaAssets.images.forEach(function(value, index) {
  //       if (index === 0) {
  //         myElement.$.slider.removeChild(myElement.$.placehold);
  //       }
  //       let item = document.createElement('item');
  //       item.setAttribute('source', 'http://www.standard.net' + value.url.toLowerCase());
  //       Polymer.dom(awesomeSlider).appendChild(item);
  //     });
  //
  //     awesomeSlider.next = function() {
  //       // Call the next function as normal
  //       oldNext.apply(this, arguments);
  //       // Add new caption to caption area
  //       let text = myElement.featured.mediaAssets.images[awesomeSlider.index + 1].caption;
  //       myElement.$.caption.textContent = text;
  //     }
  //
  //     // Rebuild awesome-slider element with new items
  //     awesomeSlider.createdCallback();
  //
  //     // Remove the previous and next buttons from the info portion of awesome slider
  //     let buttons = awesomeSlider.shadow.querySelector('.info').querySelectorAll('button');
  //     buttons.forEach(function(value) {
  //       value.style.display = 'none';
  //     });
  //
  //     // Add a float style to the index/count span
  //     let counterEl = awesomeSlider.shadow.querySelector('.info').querySelector('span');
  //     counterEl.style.float = 'right';
  //     counterEl.style.padding = '0 5px 0 0';
  //   });
  // }
}
Polymer(cranberrySliderWrapper);
