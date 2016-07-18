class cranberrySlider {
  beforeRegister() {
    this.is = 'cranberry-slider';
    this.properties = {
      isMobile: {
        type: Boolean,
        value: /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
      },
      isiPhone: {
        type: Boolean,
        value: /iPhone/i.test(navigator.userAgent)
      },
      animationEvent: {
        value: function() {
          return this.whichEvent('animation');
        }
      },
      transitionEvent: {
        value: function() {
          return this.whichEvent('transition');
        }
      },
      infoEl: {
        type: Object
      },
      autostart: {
        type: Boolean
      },
      arrows: {
        type: Boolean
      },
      bullets: {
        type: Boolean
      },
      info: {
        type: Boolean
      },
      caption: {
        type: Boolean
      },
      modal: {
        type: Boolean
      },
      images: {
        type: Array,
        observer: 'onImagesChanged'
      },
      loader: {
        type: Object
      },
      current: {
        type: Object
      },
      figure: {
        type: Object
      },
      container: {
        type: Object
      },
      nav: {
        type: Object
      },
      items: {
        type: Array
      },
      index: {
        type: Number,
        value: 0
      },
      transitioning: {
        type: Boolean
      }
    }
  }

  onImagesChanged(newValue, oldValue) {
    this.Loader.prototype.end = function(success){
      if (this.ended) return;
      this.ended = true;
      if (this.callback) {
        this.callback(this.im);
      }
    }
    this.Loader.prototype.run = function(url, back){
      var self = this;
      this.loading = true;
      this.ended = false;
      this.callback = back || null;
      if (url.match(/\.(mp4|webm)/i)) {
        this.vid.setAttribute('src', url);
        setTimeout(function () {
          self.end(true);
        }, 2000);
      } else {
        this.im.src = url;
        if (this.im.width > 0) {
          this.end(true, this.callback);
        }
      }
    }

    this.init(this);
  }

  whichEvent(name) {
    var t,
      el = document.createElement('fakeelement');
    var animations = {
      'animation': name + 'end',
      'WebkitAnimation': 'webkit' + (name.charAt(0).toUpperCase() + name.slice(1)) + 'End'
    }
    for (t in animations) {
      if (el.style[t] !== undefined) {
        return animations[t];
      }
    }
  }

  Loader() {
    var self = this;
    this.im = new Image(),
    this.loading = false,
    this.callback = null,
    this.ended = false,
    this.vid = document.createElement('video');
    this.vid.addEventListener('loadeddata', function () {
      self.end(true);
    });
    this.vid.addEventListener('error', function () {
      self.end(false);
    });
    this.im.onload = function () {
      self.end(true);
    };
    this.im.onerror = function () {
      self.end(false);
    };
  }

  updateItems(el) {
    let items = [];

    el.images.forEach(function(value, index) {
      items.push({
        src: 'http://www.standard.net' + value.exlarge,
        html: '',
        loaded: false
      });
    });
    this.set('items', items);
  }

  // clearSiblings(el, index) {
  //   var siblings = [].slice.call(el.bullets.children).filter(function (v) {
  //       return v !== el.bullets.children[index]
  //     }),
  //     i, l;
  //   for (i = 0, l = siblings.length; i < l; i++) {
  //     siblings[i].className = '';
  //   }
  //   Polymer.dom(el.bullets).children[index].classList.add('active');
  // }

  checkSrc(el, index) {
    let items = this.get('items');
    var src = items[index].src,
      video,
      type;
    let loader = this.get('loader');
    if (src.match(/\.(jpg|jpeg|png|gif)$/)) {
      el.video = null;
      loader.style.backgroundImage = 'url(' + src + ')';
      return loader;
    }
    if (src.match(/\.(mp4|webm)$/)) {
      loader.style.backgroundImage = 'none';
      video = document.createElement('video');

      if (video.canPlayType && video.canPlayType('video/webm').replace(/no/, '')) {
        src = src.replace(/\.(mp4|webm)$/i, '.webm');
      } else {
        if (video.canPlayType && video.canPlayType('video/mp4').replace(/no/, '')) {
          src = src.replace(/\.(mp4|webm)$/i, '.mp4');
        } else {
          return false;
        }
      }

      video.setAttribute('src', src);
      video.setAttribute('type', 'video/' + src.replace(/(.*)\.(mp4|webm)$/i, '$2'));

      loader.addEventListener('click', function () {
        video.paused || video.ended ? video.play() : video.pause();
      });
      video.addEventListener('play', function () {
        if (!this.parentNode) return;
        restartTimer(this.parentNode);
        Polymer.dom(this.parentNode).classList.add('playing');
        Polymer.dom(this.parentNode).classList.remove('paused');
      });
      video.addEventListener('pause', function () {
        if (!this.parentNode) return;
        clearTimer(this.parentNode);
        Polymer.dom(this.parentNode).classList.remove('playing');
        Polymer.dom(this.parentNode).classList.add('paused');
      });
      video.addEventListener('error', function () {
        var type = src.match(/\.mp4$/i) ? '.webm' : '.mp4';
        video.setAttribute('type', 'video/' + type.replace('.', ''));
        video.setAttribute('src', src.replace(/\.(mp4|webm)$/i, type));
      });
      el.video = video;
      loader.appendChild(video);
      return video;
    }
  }

  clearTimer(el) {
    if (el.timer) clearTimeout(el.timer);
    Polymer.dom(el).classList.remove('hidden');
  }

  restartTimer(el) {
    if (!this.isMobile) {
      clearTimer(el);
      el.timer = setTimeout(function () {
        Polymer.dom(el).classList.add('hidden');
      }, 1250);
    }
  }

  move() {
    this.restartTimer(this);
  }

  leave() {
    this.clearTimer(this);
  }

  videoEvents(el, status) {
    if (!this.isMobile) {
      let current = this.get('current');
      let loader = this.get('loader');
      if (status) {
        loader.addEventListener('mousemove', this.move);
        loader.addEventListener('mouseleave', this.leave);
      } else {
        loader.removeEventListener('mousemove', this.move);
        loader.removeEventListener('mouseleave', this.leave);
        current.removeEventListener('mousemove', this.move);
        current.removeEventListener('mouseleave', this.leave);
      }
    }
  }

  removeAndAddClasses(el, addClasses) {
    let currentClassArr = el.classList;
    let classString = '';

    currentClassArr.forEach(function(value, index) {
      if (value !== 'style-scope' && value !== 'cranberry-slider') {
        classString += value + ' ';
      }
    });

    el.classList.remove(classString);

    addClasses.forEach(function(value, index) {
      el.classList.add(value);
    });

    return el;
  }

  loadingEnd(el, index) {
    let self = this;
    let loader = this.get('loader');
    let nav = this.get('nav');
    let items = this.get('items');
    let current = this.get('current');
    let toggle = {};
    loader.removeEventListener(this.animationEvent, this.loadingEnd);

    window.requestAnimationFrame(function () {
      loader.className = "current ready cranberry-slider";
      current.className = "loader cranberry-slider";
      if (nav) {
        Polymer.dom(nav.next).classList.remove('active');
        Polymer.dom(nav.prev).classList.remove('active');
      }
      if (items[index].portrait) {
        loader.classList.add('portrait');
      }
      if (self.video) {
        loader.classList.add('controls');
        loader.classList.add('video');
        if (self.isMobile) {
          loader.classList.add('paused');
        } else {
          self.video.play();
        }
        self.videoEvents(el, true);
      } else {
        self.videoEvents(el, false);
      }
      toggle = loader;
      self.set('loader', current);
      self.set('current', toggle);
      self.set('index', index);
      self.set('transitioning', false);
    });
  }

  endLoading(el, index, dir) {
    let self = this;
    let loader = this.get('loader');
    let items = this.get('items');
    let current = this.get('current');
    let info = this.get('infoEl');

    let infoOn = this.get('info');
    let bullets = this.get('bullets');
    let caption = this.get('caption');

    loader.innerHTML = items[index].html;
    this.checkSrc(el, index);
    loader.addEventListener(this.animationEvent, this.loadingEnd(this, index));
    window.requestAnimationFrame(function () {
      loader.classList.add(dir + '-in');
      current.classList.add(dir + '-out');
    });

    if (bullets && typeof bullets !== 'undefined') {
      this.clearSiblings(el, index);
    }
    if (infoOn && typeof infoOn !== 'undefined') {
      info.querySelector('.text').innerHTML = (index + 1) + ' / ' + items.length;
    }
    if (caption && typeof caption !== 'undefined') {
      info.querySelector('.caption').innerHTML = '<iron-icon icon="image:panorama"></iron-icon>' + this.images[index].caption;
    }
    if (items[index].portrait) {
      loader.classList.add('portrait');
    }
  }

  endGoTo(el, index, dir) {
    let current = this.get('current');
    current.removeEventListener(this.get('transitionEvent'), this.endGoTo);
    this.endLoading(this, index, dir);
  }

  goTo(el, index, dir) {
    var self = this;
    let current = this.get('current');
    let items = this.get('items');
    let transitioning = this.get('transitioning');

    var ldr = document.createElement('div');
    var loader = new this.Loader();
    ldr.classList.add('ldr');
    current.appendChild(ldr);

    dir = dir || 'next';
    if (transitioning === true) return;
    if (index < 0) {
      this.set('index', items.length - 1);
    }
    if (index >= items.length) this.set('index', 0);
    this.set('transitioning', true);
    if (items[index].loaded !== true) {
      current.classList.remove('ready');
      current.offsetHeight;
      window.requestAnimationFrame(function () {
        current.classList.add('loading');
        loader.run(items[index].src, function (img) {
          if (img.height > img.width) {
            items[index].portrait = true;
          }

          items[index].loaded = true;
          current.offsetHeight;
          current.addEventListener(self.get('transitionEvent'), self.endGoTo(self, index, dir));
          window.requestAnimationFrame(function () {
            setTimeout(function () {
              current.classList.add('unload');
            }, 100);

          });
        });
      });
    } else {
      setTimeout(function () {
        window.requestAnimationFrame(function () {
          self.endLoading(el, index, dir);
        });
      }, 100);
    }
  }

  events(el) {
    el.position = {};
    el.addEventListener('keydown', function (event) {
      var key = event.which;
      if (key == 37 || key == 39) {
        event.preventDefault();
        if (key == 37) {
          el.prev();
          return;
        }
        el.next();
      }
    });
  }

  applyBullets(el) {
    let items = this.get('items');
    if (el.bullets) return;
    el.bullets = document.createElement('div');
    Polymer.dom(el.bullets).classList.add('bullets');
    var span = document.createElement('button'),
      child;
    for (var i = 0, l = items.length; i < l; i++) {
      child = span.cloneNode(true);
      child.setAttribute('data-index', i);
      child.addEventListener('click', function () {
        var index = this.getAttribute('data-index');
        let sliderIndex = this.get('index');
        this.goTo(el, index, index > sliderIndex ? 'next' : 'prev');
      });
      el.bullets.appendChild(child);
    }
    let container = this.get('container');
    container.appendChild(el.bullets);
  }

  applyInfo(el) {
    this.set('info', true);
    let info = document.createElement('div');
    Polymer.dom(info).classList.add('info');
    let text = document.createElement('span');
    text.classList.add('text');
    if (Boolean(el.getAttribute('shownextprev'))) {
      let next = document.createElement('button');
      let prev = document.createElement('button');

      next.textContent = 'next';
      prev.textConent = 'prev';

      next.addEventListener('click', function () {
        el.next();
      });

      next.addEventListener('click', function () {
        el.prev();
      });
      info.appendChild(next);
      info.appendChild(prev);
    }
    text.textContent = '';
    info.appendChild(text);

    if (this.get('caption')) {
      let caption = document.createElement('p');
      Polymer.dom(caption).classList.add('caption');
      if (this.get('modal')) {
        Polymer.dom(caption).classList.add('white-text');
        Polymer.dom(info).classList.add('white-text');
      }
      caption.textContent = '';
      info.appendChild(caption);
    }
    let container = this.get('container');

    el.appendChild(info);
    this.set('infoEl', info);
  }

  applyArrows(el) {
    let container = this.get('container');
    this.set('nav', document.createElement('div'));
    let nav = this.get('nav');

    nav.innerHTML = '<button class="next active"><em class="a-right"></em></button><button class="prev active"><em class="a-left"></em></button>';
    nav.next = nav.querySelector('.next');
    nav.prev = nav.querySelector('.prev');
    nav.next.addEventListener('click', function (event) {
      el.next();
    });
    nav.prev.addEventListener('click', function (event) {
      el.prev();
    });
    container.addEventListener('touchstart', function (event) {
      el.position.x = event.touches[0].clientX;
      el.position.y = event.touches[0].clientY;
    });
    container.addEventListener('touchmove', function (event) {
      if (!el.position.x || !el.position.y) {
        return;
      }
      var current = {},
        dif = {}
      current.x = event.touches[0].clientX;
      current.y = event.touches[0].clientY;
      dif.x = el.position.x - current.x;
      dif.y = el.position.y - current.y;
      if (Math.abs(dif.x) < 75 && Math.abs(dif.y) < 75) {
        return;
      }
      if (Math.abs(dif.x) > Math.abs(dif.y)) {
        if (dif.x > 0) {
          el.next();
        } else {
          el.prev();
        }
      }
      el.position.x = null;
      el.position.y = null;
    });
    let figure = this.get('figure');
    figure.appendChild(nav);
  }

  checkStart(el) {
    let start = this.get('autostart');
    if (start) {
      this.goTo(el, 0, 'next');
    }
  }

  checkInfo(el) {
    let info = this.get('info');

    if (info) {
      this.applyInfo(el);
    }
  }

  checkArrows(el) {
    let arrows = this.get('arrows');
    let items = this.get('items');

    if (arrows && items.length > 1) {
      this.applyArrows(el);
    }
  }

  checkBullets(el) {
    let bullets = this.get('bullets');
    console.info(bullets);
    let container = this.get('container');
    if (bullets) {
      this.applyBullets(el);
      Polymer.dom(container).classList.add('with-bullets');
    } else {
      Polymer.dom(container).classList.remove('with-bullets');
    }
  }

  checkHeight(el) {
    var height = el.getAttribute('height');
    let container = this.get('container');

    if (typeof height === 'string') {
      if (height.match(/^x([0-9]{1,3})%$/)) {
        Polymer.dom(container).classList.add('proportional');
        container.style.paddingBottom = height.replace('x', '');
      } else {
        container.style.height = height;
      }
    } else {
      Polymer.dom(container).classList.add('proportional');
    }
  }

  checkColor(el) {
    var color = el.getAttribute('color');
    let container = this.get('container');

    if (typeof color === 'string' && color.match(/^(teal|red|blue|pink|purple|grey|orange)$/)) {
      container.className = container.className.replace(/c\-[a-z]/, '').trim();
      Polymer.dom(container).classList.add('c-' + color);
    } else {
      container.className = container.className.replace(/c\-[a-z]/, '').trim();
    }
  }

  checkPreImg(el) {
    var image = el.getAttribute('pre-image');
    let current = this.get('current');

    if (typeof image === 'string') {
      current.style.backgroundImage = 'url(' + image + ')';
      current.classList.add('first');
    }
  }

  checkMobile(el) {
    let container = this.get('container');

    if (this.isMobile) {
      Polymer.dom(container).classList.add('mobile');
    }
    if (this.isiPhone) {
      Polymer.dom(container).classList.add('iphone');
    }
  }

  getContent(nodes) {
    var text = []
    for (var i in nodes) {
      if (nodes[i].nodeType == 1) {
        text.push(nodes[i].outerHTML);
        continue;
      }
      if (nodes[i].nodeType == 3) {
        text.push(nodes[i].textContent);
        continue;
      }
    }
    return text.join(' ');
  }

  init(el) {
    this.set('figure', this.querySelector('figure'));
    this.set('current', this.querySelector('.current'));
    this.set('loader', this.querySelector('.loader'));
    this.set('container', this.querySelector('.slider'));
    el.class = 'slider';

    // Run the remainder of funtions
    this.updateItems(el);
    this.checkArrows(el);
    this.checkBullets(el);
    this.checkInfo(el);
    this.checkHeight(el);
    this.checkPreImg(el);
    this.events(el);
    this.checkStart(el);
    this.checkColor(el);
    this.checkMobile(el);
  }

  firstRun() {
    this.goTo(this, 0, 'next');
  }

  nextEnd(el) {
    let nav = this.get('nav');
    let index = this.get('index');
    var button = nav.next;

    button.removeEventListener(el.transitionEvent, el.nextEnd);
    el.goTo(el, index + 1, 'next');
  }

  next() {
    var el = this.nav.next,
      self = this;

    el.addEventListener(self.transitionEvent, this.nextEnd(this));
    Polymer.dom(el).classList.add('active');
  }

  prevEnd(el) {
    let nav = this.get('nav');
    let index = this.get('index');
    var button = nav.prev;

    button.removeEventListener(el.transitionEvent, el.prevEnd);
    el.goTo(el, index - 1, 'prev');
  }

  prev() {
    var el = this.nav.prev,
      self = this;

    el.addEventListener(self.transitionEvent, this.prevEnd(this));
    Polymer.dom(el).classList.add('active');
  }

  color(color) {
    this.setAttribute('color', color);
  }

}
Polymer(cranberrySlider);
