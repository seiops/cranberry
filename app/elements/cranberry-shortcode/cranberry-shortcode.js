class cranberryShortcode {
    beforeRegister() {
        this.is = 'cranberry-shortcode';
        this.properties = {
            storyObject: {
                type: Object
            },
            shortcodeObject: {
                type: Object
            },
            shortcodeRendered: {
              type: Boolean,
              value: false
            },
            baseUrl: {
                type: String
            },
            toutUid: {
                type: String,
                value: ''
            }
        };
    }

    // Attached function to handle all data passed to shortcode Element
    attached() {
      console.info('\<cranberry-shortcode\> attached');
      let foundObject = {};
      let story = this.get('storyObject');
      let shortcode = this.get('shortcodeObject');
      let shortcodeRendered = this.get('shortcodeRendered');

      this.async(() => {
        if (typeof story !== 'undefined' && typeof shortcode !== 'undefined' && !shortcodeRendered) {
          this._setupShortcode(story, shortcode);
        }
      });
      
    }

    detached() {
      console.info('\<cranberry-shortcode\> detached');
    }

    _setupShortcode(story, shortcode) {
      let baseUrl = this.get('baseUrl');
      let toutUid = this.get('toutUid');
      let survey = this.get('survey');

      this.async(() => {

        let { key: shortcodeType, value: shortcodeValue, unscrubbed: unscrubbedValue } = shortcode;
        let { mediaAssets: { images, videos }, attachments, relatedContent, latitude, longitude } = story;
        let lookForObject = false;
        let searchingIndex = '';

        switch(shortcodeType) {
          // Types that need no object finding
          case 'generator':
          case 'gmap':
          case 'googform':
          case 'mec':
          case 'tout':
          case 'toutembed':
          case 'twitterhash':
          case 'twitteruser':
          case 'quote':
          case 'facebookpost':
          case 'newsletter':
            break;
          // Types that do need object finding
          default:
            lookForObject = true
            searchingIndex = 'title';
        }
        let storyInfo = {
          latitude: latitude,
          longitude: longitude,
          zoom: 15,
          baseUrl: baseUrl,
          toutUid: toutUid,
          survey: survey
        };

        let shortcodeOptions = {
          type: shortcodeType,
          value: shortcodeValue,
          lookForObject: lookForObject,
          searchingIndex: searchingIndex,
          images: images,
          videos: videos,
          attachments: attachments,
          relatedContent: relatedContent,
          storyInfo: storyInfo,
          unscrubbedValue: unscrubbedValue
        };

        this._buildShortcode(shortcodeOptions);
      });
    }

    _buildShortcode({ type, lookForObject, searchingIndex, attachments, images, videos, relatedContent, storyInfo, unscrubbedValue, value: searchingValue } = opts) {
      let foundObject = {};
      if (lookForObject) {
        if (type.indexOf('image') >= 0) {
          foundObject = this._findAsset(images, searchingIndex, searchingValue);
        }
        if (type.indexOf('video') >= 0 || type.indexOf('youtube') >= 0) {
          foundObject = this._findAsset(videos, searchingIndex, searchingValue);
        }
        if (type.indexOf('livestream') >= 0) {
          foundObject = this._findAsset(videos, "delivery", "3");
        }
        if (type.indexOf('pdf') >= 0 || type.indexOf('audio') >= 0) {
          foundObject = this._findAsset(attachments, searchingIndex, searchingValue);
        }
        if (type === 'singlegallery') {
          foundObject = this._findAsset(relatedContent, searchingIndex, searchingValue);
        }
        if (type === 'gallery') {
          foundObject = relatedContent;
        }
        if (type.indexOf('revealer') >= 0) {
          foundObject = this._findAssets(images, searchingIndex, searchingValue);
        }
      } else {
        if (type.indexOf('map') >= 0) {
          if (searchingValue === '') {
            foundObject = storyInfo;
          } else {
            let valueArray = searchingValue.split(',');

            foundObject = {
              latitude: valueArray[0],
              longitude: valueArray[1],
              zoom: (typeof valueArray[2] !== 'undefined') ? valueArray[2] : 15,
            }
          }
        } else {
          foundObject = {
            value: searchingValue,
            unscrubbedValue: unscrubbedValue
          }
        }
      }

      let options = {
        type: type,
        value: searchingValue,
        content: foundObject,
        storyInfo: storyInfo
      };

      this._createShortcode(options);
    }

    _findAsset(content, searchingIndex, searchingValue) {
      let foundObject = {};
      content.forEach((value, index) => {
        if (value[searchingIndex].toLowerCase() === searchingValue) {
          foundObject = value;
        }
      });

      return foundObject;
    }

    _findAssets(content, searchingIndex, searchingValue) {
      let searchArray = searchingValue.split(',');
      let returnArray = [];

      content.forEach((value, index) => {
        if (value[searchingIndex].toLowerCase() === searchArray[0] || value[searchingIndex].toLowerCase() === searchArray[1]) {
          returnArray.push(value);
        }

        // Break out of loop early if all values found:: hardcoded to 2
        if (returnArray.length === 2) {
          return;
        }
      });

      return returnArray;
    }

    _createShortcode({ content, type, value, storyInfo } = options) {
      let shortcodeEl;
      let baseUrl = storyInfo.baseUrl;
      let toutUid = storyInfo.toutUid;
      let survey = storyInfo.survey;
      let story = document.querySelector('cranberry-story');

      switch(type) {
        case 'audio':
        case 'pdf':
          let url = baseUrl + content.url;
          if (type === 'pdf') {
            shortcodeEl = document.createElement('pdf-object');
            shortcodeEl.file = url;
            shortcodeEl.height = '600px';
            shortcodeEl.width = '80%';
          } else {
            shortcodeEl = document.createElement('paper-audio-player');
            shortcodeEl.src = url;
            // Remove base styles from paper-audio-player element for margins
            shortcodeEl.style = 'margin: 0 auto;';
            shortcodeEl.title = content.title;

            Polymer.dom(this.$.shortcode).classList.add('ut-smaller-width')
          }
          break;
        case 'gallery':
        case 'singlegallery':
          let slider = document.createElement('cranberry-slider');
          let wrapper = document.createElement('cranberry-slider-wrapper');
          let featured = {};
          let links = [];
          
          if (type === 'gallery') {
            content.forEach((value, index) => {
              if (type === 'gallery') {
                if (index === 0) {
                  featured = value;
                } else {
                  links.push(value);
                }
              }
            });
            wrapper.set('links', links);
            wrapper.set('featuredTitle', featured.title);
            slider.set('items', featured.mediaAssets.images);
            slider.set('gallery', featured);
            slider.set('galleryType', 'cranberry-story');
          } else {
            wrapper.set('featuredTitle', content.title);
            slider.set('items', content.mediaAssets.images);
            slider.set('gallery', content);
            slider.set('galleryType', 'cranberry-story');
          }

          slider.set('baseUrl', baseUrl);
          slider.set('hidden', false);
          slider.style.height = "500px";

          Polymer.dom(wrapper).appendChild(slider);

          shortcodeEl = wrapper;
          break;
        case 'gmap':
          let latitude = (typeof content.latitude === 'undefined') ? storyInfo.latitude : content.latitude;
          let longitude = (typeof content.longitude === 'undefined') ? storyInfo.longitude : content.longitude;
          let zoom = (typeof content.zoom === 'undefined') ? Number(storyInfo.zoom) : Number(content.zoom);
       
          shortcodeEl = this.create('cranberry-map', {latitude, longitude, zoom});
          break;
        case 'googform':
          shortcodeEl = document.createElement('google-form');
          shortcodeEl.url = content.unscrubbedValue;
          break;
        case 'image':
        case 'imageuncropped':
          let container = document.createElement('div');
          let image = document.createElement('iron-image');
          let caption = document.createElement('p');
          caption.classList.add('caption-text');
          image.src = baseUrl + (type === 'image' ? content.large : content.uncropped);
          caption.appendChild(document.createTextNode(content.caption));
          image.appendChild(caption);
          container.appendChild(image);
          container.appendChild(caption);
          shortcodeEl = container;
          break;
        case 'leadimage':
          shortcodeEl = '';
        case 'leadyoutube':
          shortcodeEl = '';
        case 'youtube':
          shortcodeEl = document.createElement('google-youtube');
          shortcodeEl.set('videoId', content.url);
          shortcodeEl.height = '100%';
          shortcodeEl.width = '100%';
          break;
        case 'livestream':
          shortcodeEl = document.createElement('iframe');
          shortcodeEl.src = content.url + '/player?width=640&amp;height=360&amp;autoPlay=false&amp;mute=false';
          shortcodeEl.setAttribute('frameborder', "0");
          shortcodeEl.setAttribute('scrolling', "no");
          shortcodeEl.setAttribute('width', "100%");
          shortcodeEl.setAttribute('height', "400px");
          break;
        case 'revealer':
          shortcodeEl = document.createElement('cranberry-revealer');

          let images = [];

          content.forEach((value, index) => {
            let obj = {};
            obj.url = baseUrl + value.exlarge;
            images.push(obj);
          });

          shortcodeEl.images = images;
          break;
        case 'tout':
          shortcodeEl = document.createElement('tout-element');

          shortcodeEl.set('placement', 'tout-mid-article');
          shortcodeEl.set('slot', 'mid-article');
          shortcodeEl.set('player', 'mid_article_player');
          shortcodeEl.set('toutUid', toutUid);
          shortcodeEl.set('storyId', story.get('routeData.id'));
          break;
        case 'toutembed':
          shortcodeEl = document.createElement('div');

          let tout = document.createElement('div');
          let toutScript = document.createElement('script');
          let toutId = 'tout-' + value + '-target';

          tout.id = toutId;
          toutScript.src = '//player.tout.com/embeds/' + value + '.js?content_brand_uid=' + toutUid + '&width=auto&height=auto&autoplay=false&element_id=' + toutId;

          shortcodeEl.appendChild(tout);
          shortcodeEl.appendChild(toutScript);
          break;
        case 'twitteruser':
        case 'twitterhash':
          let valueArray = value.split(',');
          let sourceType = document.createAttribute('source-type');

          shortcodeEl = document.createElement('twitter-timeline');

          if (type === 'twitteruser') {
            sourceType.value = 'profile';
            let screenName = document.createAttribute('screen-name');
            screenName.value = valueArray[0];
            shortcodeEl.setAttributeNode(screenName);
          } else {
            let sourceType = document.createAttribute('source-type');
            sourceType.value = 'widget';
            let widgetId = document.createAttribute('widget-id');
            widgetId.value = valueArray[1];
            shortcodeEl.setAttributeNode(widgetId);
          }
          shortcodeEl.setAttributeNode(sourceType);
          break;
        case 'quote':
          shortcodeEl = document.createElement('cranberry-quote');
          let quote = {};
          let lastIndex = value.lastIndexOf(',');
          let firstIndex = (value.indexOf(',')) + 1;
          let length = value.length;
          quote.direction = value.substr(0,1);
          quote.credit = content.unscrubbedValue.substr(lastIndex, length).replace(',', '').trim();
          quote.text = content.unscrubbedValue.substr(firstIndex, lastIndex - (firstIndex)).trim();
          shortcodeEl.quote = quote;
          break;
        case 'facebookpost':
          let facebookScript = document.querySelector('#facebook-jssdk');

          if (!facebookScript) {
            let app = Polymer.dom(document).querySelector('cranberry-base');
            let loader = Polymer.dom(app.root).querySelector('cranberry-script-loader');

            loader.loadScript('https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.5', 'facebook-jssdk');
          }

          shortcodeEl = document.createElement('div');
          shortcodeEl.className = 'fb-post';
          shortcodeEl.setAttribute('data-href', value);
          shortcodeEl.setAttribute('data-width', '350');
          shortcodeEl.setAttribute('data-show-text', 'true');
          shortcodeEl.setAttribute('data-allowfullscreen', 'true');
          break;
        case 'newsletter':
          shortcodeEl = document.createElement('cranberry-newsletter');
      }

      // Append shortcodeEl
      if (typeof shortcodeEl !== 'undefined') {
        if (type === 'leadimage') {
          story.set('hasLeadShortcode', true);
          story.set('leadShortcodeType', 'image');
          story.set('leadShortcodeContent', content);
        } else if (type === 'leadyoutube') {
          story.set('hasLeadShortcode', true);
          story.set('leadShortcodeType', 'youtube');
          story.set('leadShortcodeContent', content);
        } else {
          Polymer.dom(this.$.shortcode).appendChild(shortcodeEl);
        }
      }

      this.set('shortcodeRendered', true);
    }
}
Polymer(cranberryShortcode);
