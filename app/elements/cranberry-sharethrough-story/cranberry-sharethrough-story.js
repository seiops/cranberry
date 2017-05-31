class cranberrySharethroughStory {
  beforeRegister() {
    this.is = 'cranberry-sharethrough-story';
    this.properties = {
      hidden: {
        type: Boolean,
        value: true,
        reflectToAttribute: true
      }
    }
  }

  attached() {
    console.info('\<cranberry-sharethrough-story\> attached');
    
    let app = Polymer.dom(document).querySelector('cranberry-base');

    this.dispatchEvent(
      new CustomEvent(
        'load-script',
        {
          bubbles: true,
          composed: true,
          detail: {
            url: '//native.sharethrough.com/assets/sfp-sponsored-page.js',
            id: 'sharethrough-script',
            attributes: [
              {
                name: 'data-str-publisher-key',
                value: '6505a16f'
              }
            ]
          }
        }
      )
    );
  }

  detached() {
    console.info('\<cranberry-sharethrough-story\> detached');
  }
}
Polymer(cranberrySharethroughStory);
