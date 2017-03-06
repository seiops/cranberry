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
    let loader = Polymer.dom(app.root).querySelector('cranberry-script-loader');

    loader.loadScript('//native.sharethrough.com/assets/sfp-sponsored-page.js', 'sharethrough-script', {attributeName: 'data-str-publisher-key', attributeValue: '6505a16f'});
  }

  detached() {
    console.info('\<cranberry-sharethrough-story\> detached');
  }
}
Polymer(cranberrySharethroughStory);
