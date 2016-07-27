class cranberryShortcode {
    beforeRegister() {
        this.is = 'cranberry-shortcode';
        this.properties = {
          storyObject: {
            type: Object
          },
          shortcodeObject: {
            type: Object
          }
        };
    }

    // Attached function to handle all data passed to shortcode Element
    attached() {
      let foundObject = {};

      if (typeof this.storyObject !== 'undefined' && typeof this.shortcodeObject !== 'undefined') {
        // Establish found object from the return of findAssetObject
        foundObject = this._findAssetObject(this.storyObject, this.shortcodeObject);
      }
    }

    _findAssetObject(story, shortcode) {
      let searchIndex = '';
      let foundObject = {};

      // Switch on the shortcode key (type of shortcode)
      // If key is found in Switch
      //   a. Find the corrisponding object based on the passed data.
      //   b. Pass that to _createShortcode function for creation of the desired element.

      switch(shortcode.key) {
        case 'image':
        case 'leadimage':
        case 'imageuncropped':
          foundObject = this._findAsset(story.mediaAssets.images, 'title', shortcode.value);
          this._createShortcode(foundObject, 'image', shortcode);
          break;
        case 'video':
          foundObject = this._findAsset(story.mediaAssets.videos, 'title', shortcode.value);
          break;
        case 'pdf':
        case 'audio':
          foundObject =  this._findAsset(story.attachments, 'title', shortcode.value);
          this._createShortcode(foundObject, 'attachment', shortcode);
          break;
        case 'gmap':
          this._createShortcode(story, 'map', shortcode);
          break;
        case 'revealer':
          let myElement = this;
          let shortcodeArr = shortcode.value.split(',');
          let foundObjectArr = [];
          shortcodeArr.forEach(function(value) {
            foundObjectArr.push(myElement._findAsset(story.mediaAssets.images, 'title', value));
          });
          this._createShortcode(foundObjectArr, 'revealer', shortcode);
          break;
        case 'twitterhash':
        case 'twitteruser':
          this._createShortcode({}, 'twitter', shortcode);
          break;
        case 'youtube':
          foundObject = this._findAsset(story.mediaAssets.videos, 'title', shortcode.value);
          this._createShortcode(foundObject, 'youtube', shortcode);
          break;
        case 'quote':
          let quote = {};
          let lastIndex = shortcode.value.lastIndexOf(',');
          let firstIndex = (shortcode.value.indexOf(',')) + 1;
          let length = shortcode.value.length;
          quote.direction = shortcode.value.substr(0,1);
          quote.credit = shortcode.unscrubbed.substr(lastIndex, length).replace(',', '').trim();
          quote.text = shortcode.unscrubbed.substr(firstIndex, lastIndex - (firstIndex)).trim();

          this._createShortcode(quote, 'quote', shortcode);
          break;
        case 'googform':
          this._createShortcode(shortcode.unscrubbed, 'googform', shortcode);
          break;
        case 'gallery':
          this._createShortcode(story.relatedContent, 'gallery', shortcode);
          break;
        case 'singlegallery':
          foundObject = this._findAsset(story.relatedContent, 'title', shortcode.value);
          this._createShortcode(foundObject, 'singlegallery', shortcode);
          break;
        case 'mec':
          break;
        case 'generator':
          break;
      }
    }

    _createShortcode(foundObject, type, shortcode) {
      let shortcodeEl;

      // Create shortcode for images. Except for leadimages
      if (type === 'image' && shortcode.key !== 'leadimage') {
        shortcodeEl = document.createElement('iron-image');
        let caption = document.createElement('p');
        caption.classList.add('ut-text-small-dim');
        shortcodeEl.src = 'http://www.standard.net' + (shortcode.key === 'image' ? foundObject.exlarge : foundObject.url);
        caption.appendChild(document.createTextNode(foundObject.caption));
        shortcodeEl.appendChild(caption);
      }

      // Create shortcode for PDF's and Audio
      if (type === 'attachment') {
        let url = 'http://www.standard.net' + foundObject.url;
        if (shortcode.key === 'pdf') {
          shortcodeEl = document.createElement('pdf-object');
          shortcodeEl.file = url;
          shortcodeEl.height = '600px';
          shortcodeEl.width = '80%';
        } else {
          shortcodeEl = document.createElement('paper-audio-player');
          shortcodeEl.src = url;
          // Remove base styles from paper-audio-player element for margins
          shortcodeEl.style = 'margin: 0 auto;';
          shortcodeEl.title = foundObject.title;

          Polymer.dom(this.$.shortcode).classList.add('ut-smaller-width')
        }
      }

      // Create shortcode for maps
      if (type === 'map') {

        // Set Latitude, Longitude, and Zoom values
        let positionArr = [];
        if (shortcode.value !== '') {
          positionArr = shortcode.value.split(',');
        }

        let lat = (positionArr.length > 0 && positionArr[0] !== '' ? positionArr[0] : foundObject.latitude);
        let long = (positionArr.length > 1 && positionArr[1] !== '' ? positionArr[1] : foundObject.longitude);
        let zoom = (positionArr.length > 2 && positionArr[2] !== '' ? Number(positionArr[2]) : 15);

        // Create cranberry-map (without api-key attribute)
        shortcodeEl = this.create('cranberry-map', {latitude: lat, longitude: long, zoom: zoom});
      }

      // Create shortcode for revealer
      if (type === 'revealer') {
        shortcodeEl = document.createElement('cranberry-revealer');

        let myElement = this;
        let images = [];

        foundObject.forEach(function(value, index) {
          let obj = {};
          obj.url = 'http://www.standard.net' + value.exlarge;
          images.push(obj);
        });

        shortcodeEl.images = images;
      }

      // Create shortcode for Twitter hash and user
      if (type === 'twitter') {
        let valueArray = shortcode.value.split(',');
        shortcodeEl = document.createElement('twitter-timeline');
        if (shortcode.key === 'twitteruser') {
          let sourceType = document.createAttribute('source-type');
          sourceType.value = 'profile';
          let screenName = document.createAttribute('screen-name');
          screenName.value = valueArray[0];
          shortcodeEl.setAttributeNode(sourceType);
          shortcodeEl.setAttributeNode(screenName);
        } else {
          let sourceType = document.createAttribute('source-type');
          sourceType.value = 'widget';
          let widgetId = document.createAttribute('widget-id');
          widgetId.value = valueArray[1];
          shortcodeEl.setAttributeNode(sourceType);
          shortcodeEl.setAttributeNode(widgetId);
        }
      }

      // Create YouTube shortcode
      if (type === 'youtube') {
        shortcodeEl = document.createElement('google-youtube');
        let videoAttribute = document.createAttribute('video-id');
        videoAttribute.value = foundObject.url;
        shortcodeEl.setAttributeNode(videoAttribute);
        shortcodeEl.height = '400px';
        shortcodeEl.width = '100%';
      }

      // Create Quote shortcode
      if (type === 'quote') {
        shortcodeEl = document.createElement('cranberry-quote');
        shortcodeEl.quote = foundObject;
      }

      // Create Google Form shortcode
      if (type === 'googform') {
        shortcodeEl = document.createElement('google-form');
        shortcodeEl.url = foundObject;
      }

      // Create Gallery shortcode
      if (type === 'gallery') {
        let featured = {};
        let links = [];
        foundObject.forEach(function(value, index) {
          if (value.contentType === 'gallery') {
            if (index === 0) {
              featured = value;
            } else {
              links.push(value);
            }
          }
        });

        let slider = document.createElement('cranberry-slider');
        let wrapper = document.createElement('cranberry-slider-wrapper');

        wrapper.set('links', links);
        wrapper.set('featuredTitle', featured.title);

        slider.set('autostart', true);
        slider.set('arrows', true);
        slider.set('bullets', false);
        slider.set('info', true);
        slider.set('caption', true);
        slider.set('images', featured.mediaAssets.images);


        Polymer.dom(wrapper).appendChild(slider);

        shortcodeEl = wrapper;

      }

      // Create SingleGallery shortcode
      if (type === 'singlegallery') {
        let slider = document.createElement('cranberry-slider');
        let wrapper = document.createElement('cranberry-slider-wrapper');

        wrapper.set('featuredTitle', foundObject.title);

        slider.set('autostart', true);
        slider.set('arrows', true);
        slider.set('bullets', false);
        slider.set('info', true);
        slider.set('caption', true);

        slider.set('images', foundObject.mediaAssets.images);

        Polymer.dom(wrapper).appendChild(slider);

        shortcodeEl = wrapper;
      }

      // Append shortcodeEl
      if (shortcode.key === 'leadimage') {
        document.querySelector('#storyMedia').querySelector('iron-image').src = 'http://www.standard.net/' + foundObject.exlarge;
      } else {
        Polymer.dom(this.$.shortcode).appendChild(shortcodeEl);
      }
    }

    _findAsset(obj, matchIndex, matchText) {
      let returnObject = {};

      if (obj.length > 0 && obj.length !== undefined) {
        obj.forEach(function(value) {
          if (value[matchIndex].toLowerCase() === matchText.toLowerCase()) {
            returnObject = value;
            return false;
          }
        });
      } else {
        returnObject = obj;
      }
      return returnObject;
    }
}
Polymer(cranberryShortcode);
