class cranberryStory {
    beforeRegister() {
        this.is = 'cranberry-story';
    }

    ready() {
    }

    handleResponse(data) {
      var myElement = this;
      var restResponse = JSON.parse(data.detail.Result);

      if (restResponse.paragraphs.length > 0) {
        restResponse.paragraphs.forEach(function(arrayValue) {

          if (arrayValue.shortcode === false) {
            let paragraphEl = document.createElement('p');
            let textNode = document.createTextNode(arrayValue.text);

            paragraphEl.appendChild(textNode);

            myElement.$.storyContentArea.appendChild(paragraphEl);
          } else {

          }

        });
      }

      if (restResponse.mediaAssets.images.length > 1) {
        myElement.$.storyMedia.querySelector('iron-image').src = "http://www.standard.net/" + restResponse.mediaAssets.images[0].url;
      }

      if (restResponse.title !== '') {
        myElement.$.storyTitle.innerHTML = restResponse.title;
      }
    }
}
Polymer(cranberryStory);
