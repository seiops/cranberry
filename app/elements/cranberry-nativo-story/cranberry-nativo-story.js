class CranberryNativoStory {
    beforeRegister() {
      this.is = 'cranberry-nativo-story';
      this.properties = {
        hidden: {
          type: Boolean,
          value: true,
          reflectToAttribute: true,
          observer: 'hiddenChanged'
        }
      }
    }

    attached() {
      console.info('\<cranberry-nativo-story\> attached');
    }

    hiddenChanged(hidden, oldHidden) {
      console.info('\<cranberry-nativo-story\> hiddenChanged');

      this.async(() => {
        if (typeof hidden !== 'undefined' && typeof PostRelease !== 'undefined' && typeof PostRelease.Start === 'function' && !hidden) {
          console.info('\<cranberry-nativo-story\> firing PostRelease.Start');
          PostRelease.Start();
        } else if ((typeof PostRelease === 'undefined' || PostRelease.Start !== 'function') && !hidden) {
          let PostReleaseDefined= new Promise(
            function(resolve, reject) {
              function timeoutFunction() {
                console.info('\<cranberry-nativo-story\> PostRelease Not Defined');
                setTimeout(function() {
                  if (typeof PostRelease !== 'undefined' && typeof PostRelease.Start === 'function') {
                    resolve(true);
                    return;
                  } else {
                    timeoutFunction();
                  }
                }, 50);
              }
              timeoutFunction();
            }
          );

          PostReleaseDefined.then(function(val) {
            console.info('\<cranberry-nativo-story\> firing PostRelease.Start');
            PostRelease.Start();
          });
        }
      });
    }
}
Polymer(CranberryNativoStory);
