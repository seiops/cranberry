class cranberrySlider {

  // get behaviors() {
  //   return [Polymer.NeonAnimationRunnerBehavior];
  // }

  beforeRegister() {
    this.is = 'cranberry-slider';
    this.properties = {
      items: {
        type: Array,
        value: []
      },
      baseUrl: {
        type: String,
        value: ''
      },
      count: {
        type: Number,
        value: 0
      },
      currentIndex: {
        type: Number,
        value: 0
      },
      requestIndex: {
        type: Number,
        value: 0
      },
      displayIndex: {
        type: Number,
        value: 1
      },
      currentImage: {
        type: Object
      },
      startX : {
        type: Number,
        value: 0
      },
      isDraggable: {
        type: Boolean,
        value: true
      },
      height: {
        observer: '_heightChanged',
        type: Number,
        value: null
      },
      whiteText: {
        type: Boolean,
        value: false
      },
      // animationConfig: {
      //   value: function() {
      //     return {
      //       'entry': {
      //         name: 'slide-left-animation',
      //         node: this.$.mover,
      //         timig: {duration: 1000}
      //       },
      //       'exit': {
      //         name: 'slide-left-animation',
      //         node: this.$.mover,
      //         timig: {duration: 1500}
      //       }
      //     }
      //   }
      // }
    };
    this.observers = ['_itemsLoaded(items)'];
  }

  attached() {
    let image = this.$.mover;
    let self = this;

    image.addEventListener('touchstart', function (event) {
      let eventObj = event.changedTouches[0];

      self.set('isDraggable', true);
      self.set('startX', eventObj.pageX);
    });

    image.addEventListener('touchmove', function (event) {
      let startX = self.get('startX');
      let isDraggable = self.get('isDraggable');
      let eventObj = event.changedTouches[0];
      let thisX = eventObj.pageX;
      let change = Math.abs(startX - thisX);

      if (change >= 150 && isDraggable) {
        if (thisX < startX) {
          // Move Forward
          self.set('startX', 0);
          self.set('isDraggable', false);
          self._showNext();
        } else {
          // Move Backward
          self.set('startX', 0);
          self.set('isDraggable', false);
          self._showPrevious();
        }
      }
    });
  }

  _itemsLoaded(items) {
    if (typeof items !== 'undefined' && items.length > 0) {
      this.set('count', items.length);
    }

    this.set('requestIndex', 0);
  }

  _computeShow(item) {
    let index = this.items.indexOf(item);
    let requestIndex = this.get('requestIndex');

    if (index === requestIndex) {
      this.set('currentImage', item);
      this.set('displayIndex', index + 1);
      return true;
    } else {
      return false;
    }
  }

  _showNext() {
    let move = 1;
    let requestIndex = this.get('requestIndex');
    let count = this.get('count');

    let newNumber = requestIndex + move;

    if (newNumber > count - 1) {
      newNumber = 0;
    }

    this.set('requestIndex', newNumber);
    // this.playAnimation('exit');

    let template = this.$.sliderRepeat;
    template.render();
  }

  _showPrevious() {
    let move = -1;
    let requestIndex = this.get('requestIndex');
    let count = this.get('count');

    let newNumber = requestIndex + move;

    if (newNumber < 0) {
      newNumber = count - 1;
    }

    this.set('requestIndex', newNumber);
    // this.playAnimation('exit');

    let template = this.$.sliderRepeat;
    template.render();
  }

  _heightChanged() {
    this.style.height = isNaN(this.height) ? this.height : this.height + 'px';
  }

  goTo(imageIndex) {
    let count = this.get('count');
    if (typeof imageIndex !== 'undefined' && imageIndex < count) {
      this.set('requestIndex', imageIndex);
      let template = this.$.sliderRepeat;
      template.render();
    }
  }

}
Polymer(cranberrySlider);
