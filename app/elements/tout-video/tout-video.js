/* Tout Video JS library integration */

class ToutVideo {
  beforeRegister() {
    this.is = 'tout-video',
    this.properties = {
      selected: {
        type: String,
        notify: true,
        observer: '_pageChanged'
      }
    }
  }
  ready() {
    app.logger("Finished loading Tout Video.");
  }

  _pageChanged(newValue, oldValue) {
    console.info('The page changed');

    //Grab new section touts and section elements
    let newSection = document.querySelector('section[data-route="' + newValue + '"]');
    let newSectionTouts = [];
    let oldSection = document.querySelector('section[data-route="' + oldValue + '"]');
    let oldSectionTouts = [];

    if (newSection !== null) {
      newSectionTouts = newSection.querySelectorAll('div[mediaType="tout"]');
    }

    if (oldSection !== null) {
      oldSectionTouts = oldSection.querySelectorAll('div[mediaType="tout"]');
    }

    this._setId(newSectionTouts, oldSectionTouts);

    //Timout function to see if TOUT object is ready.
    let checkTout = function () {
      setTimeout(function () {
        if (typeof TOUT !== 'undefined') {
          console.info('Tout is ready');
          //Fetch new Tout content
          TOUT.fetch();
        } else {
          console.info('waiting for tout');
          checkTout();
        }
      }, 100)
    }

    //prevent running if newSection has no Touts
    if (newSection !== null) {
      checkTout();
    }

  }

  //Define _setID function
  _setId(newArray, oldArray) {
    //if old array has length remove old classes
    if (oldArray.length > 0) {
      for (let i = 0; i < oldArray.length; i++) {
        //Erase old section Tout slot Classes
        oldArray[i].classList.remove('tout-sdk');
        oldArray[i].classList.remove(newArray[i].getAttribute('position'));
        //Erase old section Tout inner content
        oldArray[i].innerHTML = '';
      }
    }
    //if new array has length add new classes
    if (newArray.length > 0) {
      for (let i = 0; i < newArray.length; i++) {
        //Set current section Tout slots to have proper classes
        newArray[i].classList.add('tout-sdk');
        newArray[i].classList.add(newArray[i].getAttribute('position'));
      }
    }
  }
}

Polymer(ToutVideo);
