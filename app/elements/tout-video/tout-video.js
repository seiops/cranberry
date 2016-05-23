/* Tout Video JS library integration */

class ToutVideo {
  beforeRegister() {
    this.is = 'tout-video',
    this.properties = {
      selected: {
        type: String,
        notify: true,
        observer: '_pageChanged'
      },
      position: {
        type: String
      }
    }
  }
  ready() {
    app.logger("Finished loading Tout Video.");
  }

  _pageChanged(newValue, oldValue) {
    let currentSection = document.querySelector('section.iron-selected');
    let thisTout = this.firstChild.nextElementSibling;
    // Check if the route contains a valid section
    if (currentSection !== null) {
      if (currentSection.contains(this)) {
        // Add this elements position to the class list for Tout
        thisTout.classList.add(this.position);
        // Timeout function for TOUT.fetch
        let checkDocumentTouts = function (thisElement) {
          setTimeout(function() {
            let toutArray = document.querySelectorAll('.' + thisElement.position);

            if (toutArray.length === 1) {
              console.info('Fetching');
              TOUT.fetch();
            } else {
              console.info('Waiting');
              checkDocumentTouts();
            }
          }, 100);
        };
        checkDocumentTouts(this);
      } else {
        // Ensure that Div doesn't have class associated with it
        if (thisTout.childNodes.length > 0) {
          // The div has a Tout in it. Clear it.
          thisTout.innerHTML = '';
        }
        thisTout.classList.remove(this.position);
      }
    }
  }
}

Polymer(ToutVideo);
