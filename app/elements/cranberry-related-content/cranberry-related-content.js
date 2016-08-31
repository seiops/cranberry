class cranberryRelatedContent {
  beforeRegister() {
    this.is = 'cranberry-related-content';
    this.properties = {
      items: {
        type: Array
      },
      relatedItems: {
        type: Array,
        observer: '_establishItems'
      },
      noItems: {
        type: Boolean,
        value: true
      },
      story: {
        type: Boolean,
        value: false
      },
      gallery: {
        type: Boolean,
        value: false
      }
    }
  }

  isGallery(item) {
    if (item.contentType === 'gallery') {
      return true;
    } else {
      return false;
    }
  }

  isStory(item) {
    if (item.contentType === 'story') {
      return true;
    } else {
      return false;
    }
  }

  _establishItems(related) {
    // Remove previous items and reset noItems
    this.set('items', []);
    this.set('noItems', true);

    let gallery = this.get('gallery');
    let story = this.get('story');

    this.async(function() {
      if (related.length > 0 && typeof related !== 'undefined') {
        if (gallery) {
          this._setupArray(related, 'gallery');
        } else {
          this._setupArray(related, 'story');
        }
      }
    });
  }

  _setupArray(related, type) {
    let items = [];
    related.forEach(function(value, index) {
      if (value.contentType === type) {
        items.push(value);
      }
    });

    if (items.length !== 0) {
      this.set('noItems', false);
    }

    this.set('items', items);
  }

  _isLast(index) {
    let items = this.get('items');
    let count = items.length;

    if (index === count - 1) {
      return true;
    }
  }

}
Polymer(cranberryRelatedContent);
