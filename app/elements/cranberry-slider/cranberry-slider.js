class cranberrySlider {
  beforeRegister() {
    this.is = 'cranberry-slider';
    this.properties = {
      featured: {
        type: Object,
        notify: true,
        observer: 'featuredChanged'
      },
      links: {
        type: Array
      }
    };
    this.computeShowTitle = function (index) {
      if (index === 0) {
        return true;
      } else {
        return false;
      }
    }
  }

  attached() {
    let awesomeSlider = this.$.slider;
    let items = awesomeSlider.content.getDistributedNodes();
    let oldNext = awesomeSlider.next;
    let myElement = this;

    // New event for next function on awesome slider to add caption text
    this.addEventListener('newnext', function(e) {
      // Add the caption text
      let text = this.featured.mediaAssets.images[awesomeSlider.index + 1].caption;
      myElement.$.caption.textContent = text;
    });

    awesomeSlider.next = function() {
      myElement.fire('newnext', {});
      let result = oldNext.apply(this, arguments);
      return result;
    }

    // Remove the previous and next buttons from the info portion of awesome slider
    let buttons = awesomeSlider.shadow.querySelector('.info').querySelectorAll('button');
    buttons.forEach(function(value) {
      value.style.display = 'none';
    });
  }

  featuredChanged() {
    let myElement = this;
    let awesomeSlider = this.$.slider;

    this.featured.mediaAssets.images.forEach(function(value, index) {
      if (index === 0) {
        myElement.$.slider.removeChild(myElement.$.placehold);
      }
      let item = document.createElement('item');
      item.setAttribute('source', 'http://www.standard.net' + value.url.toLowerCase());
      Polymer.dom(awesomeSlider).appendChild(item);
    });

    awesomeSlider.createdCallback();
  }
}
Polymer(cranberrySlider);
