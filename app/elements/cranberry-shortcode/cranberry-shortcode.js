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
        this.computeRatio = function(url, ratio) {
          let ratioString = 'a' + ratio;
          return url.replace('p1', ratioString + '_p1');
        };
    }

    attached() {
      let foundObject = {};
      if (typeof this.storyObject !== 'undefined' && typeof this.shortcodeObject !== 'undefined') {
        foundObject = this._findAssetObject(this.storyObject, this.shortcodeObject);
      }
    }

    _findAssetObject(story, shortcode) {
      let searchIndex = '';
      let foundObject = {};

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
        case 'gallery':
          //foundObject = this._findAsset(story.relatedContent, '', shortcode.value);
          break;
        case 'gmap':
          this._createShortcode(story, 'map', shortcode);
          break;
        case 'revealer':
          // foundObject = this._findAsset(story.mediaAssets.images, 'title', shortcode.value);
          // this._createShortcode(foundObject, 'revealer', shortcode);
          break;
        case 'twitterhash':
        case 'twitteruser':
          this._createShortcode({}, 'twitter', shortcode);
          break;
        case 'youtube':
          foundObject = this._findAsset(story.mediaAssets.videos, 'title', shortcode.value);
          this._createShortcode(foundObject, 'youtube', shortcode);
          break;
      }
    }

    _createShortcode(foundObject, type, shortcode) {
      let shortcodeEl;

      // Create shortcode for images. Except for leadimages
      if (type === 'image' && shortcode.key !== 'leadimage') {
        shortcodeEl = document.createElement('iron-image');
        shortcodeEl.src = 'http://www.standard.net' + (shortcode.key === 'image' ? this.computeRatio(foundObject.url, '16-9') : foundObject.url);
      }

      // Create shortcode for PDF's and Audio
      if (type === 'attachment') {
        let url = 'http://www.standard.net' + foundObject.url;
        if (shortcode.key === 'pdf') {
          shortcodeEl = document.createElement('pdf-object');
          shortcodeEl.file = url;
        } else {
          shortcodeEl = document.createElement('paper-audio-player');
          shortcodeEl.src = url;
          // Remove base styles from paper-audio-player element for margins
          shortcodeEl.style = 'margin: 0 auto;';
          shortcodeEl.title = foundObject.title;
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

        let apiAttribute = document.createAttribute('api-key');
        apiAttribute.value = getMapAPI();
        // Create google-map (with api-key attribute) and marker elements
        shortcodeEl = document.createElement('google-map', {'api-key' : getMapAPI()});
        //shortcodeEl.setAttributeNode(apiAttribute);
        let mapMarker = document.createElement('google-map-marker');


        // Set all attributes for map
        shortcodeEl.disableZoom = true;
        shortcodeEl.latitude = lat;
        shortcodeEl.longitude = long;
        shortcodeEl.zoom = zoom;

        // Set map marker attributes
        mapMarker.latitude = lat;
        mapMarker.longitude = long;

        // Append map marker to shortcodeel within light dom
        Polymer.dom(shortcodeEl).appendChild(mapMarker);
      }

      // Create shortcode for revealer
      // if (type === 'revealer') {
        // shortcodeEl = document.createElement('onion-skin');
        //
        // let image1 = document.createElement('img');
        // let image2 = document.createElement('img');
        //
        // image1.src = 'http://www.placehold.it600x600&text=1';
        // image2.src = 'http://www.placehold.it600x600&text=2';
        //
        // Polymer.dom(shortcodeEl).appendChild(image1);
        // Polymer.dom(shortcodeEl).appendChild(image2);
      // }

      // Create shortcode for Twitter hash and user
      if (type === 'twitter') {
        let valueArray = shortcode.value.split(',');
        shortcodeEl = document.createElement('twitter-timeline');
        console.info(shortcode);
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
        console.info(shortcode.key);
        console.info(foundObject);
        shortcodeEl = document.createElement('google-youtube');
        let videoAttribute = document.createAttribute('video-id');
        videoAttribute.value = foundObject.url;
        shortcodeEl.setAttributeNode(videoAttribute);
        shortcodeEl.height = '400px';
        shortcodeEl.width = '100%';
      }

      // Append shortcodeEl
      if (shortcode.key === 'leadimage') {
        document.querySelector('#storyMedia').querySelector('iron-image').src = 'http://www.standard.net/' + this.computeRatio(foundObject.url, '16-9');
      } else {
        this.$.shortcode.appendChild(shortcodeEl);
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
