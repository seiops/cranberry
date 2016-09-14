class cranberrySliderNew {

  // get behaviors() {
  //   return [Polymer.NeonAnimationRunnerBehavior];
  // }

  beforeRegister() {
    this.is = 'cranberry-slider-new';
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
      currentImage: {
        type: Object
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

}
Polymer(cranberrySliderNew);
