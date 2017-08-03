class cxenseRecommendationWidget {
  beforeRegister() {
    this.is = 'cxense-recommendation-widget';
    this.properties = {
      hasItems: {
        type: Boolean,
        value: false
      }
    };
  }

  ready() {
    window._renderCxenseRecommendationWidget = this._render.bind(this);
  }

  attached() {
    window.cX = window.cX || {};
    cX.callQueue = cX.callQueue || [];

    cX.callQueue.push(['insertWidget', {
      widgetId: 'ba89a4c4bc3c9153bfd93b78f4b6b43dfb837a15',
      renderFunction: window._renderCxenseRecommendationWidget
    }]);
  }

  _render(data, context) {
    if (typeof data.response !== 'undefined' && data.response.items.length > 0) {
      console.dir(data.response.items);

      this.set('hasItems', true);
      this.set('items', data.response.items);
    } else {
      this.set('hasItems', false);
    }
  }

  _renderDescription(description) {
    let paragraph = document.createElement('p');
    paragraph.innerHTML = description;
    description = Polymer.dom(paragraph).innerHTML;

    return description;
  }
}
Polymer(cxenseRecommendationWidget);
