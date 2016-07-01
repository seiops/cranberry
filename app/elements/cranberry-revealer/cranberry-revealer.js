class cranberryRevealer {
  beforeRegister() {
    this.is = 'cranberry-revealer';
    this.properties = {
      currentOpacity: {
        type: Number,
        value: 0,
        observer: 'opacityChanged'
      },
      maxOpacity: {
        type: Number,
        value: 0
      },
      frames: {
        type: Array,
        value: function() {
          return [];
        }
      },
      images: {
        type: Array,
        observer: 'imagesChanged'
      }
    };
  }

  imagesChanged(newValue, oldValue) {
    let myElement = this;

    this.images.forEach(function(value) {
      let imageEl = document.createElement('img');
      imageEl.src = value.url;
      Polymer.dom(myElement.$.images).appendChild(imageEl);
    });

    let imageNodes = Polymer.dom(this.$.images).childNodes;
    this.frames = Array.prototype.slice.call(imageNodes);
    this.maxOpacity = (this.frames.length - 1) * 100;
  }

  opacityChanged(newValue, oldValue) {

    if (typeof this.frames !== 'undefined') {
      if (!this.frames.length){
        return
      }

      var value = parseInt(newValue, 10),
          i, len, opacity;

      for (i = 0, len = this.frames.length; i < len; i++) {
        opacity = (value + 100 - i * 100) / 100;

        // fade back out if crossfade attribute is set; useful for imgs with transparency to avoid visible stacking
        if (this.crossfade !== null && opacity > 1){
          opacity = (2 - opacity)
        }

        // clamp opacity value to 0..1
        opacity = Math.min(1, Math.max(0, opacity));

        // TODO: store style state in JS and avoid updating DOM with duplicate values #webperf
        this.frames[i].style.opacity = opacity;
      }
    }
  }
}
Polymer(cranberryRevealer);
