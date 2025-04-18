(function() {
  var Cloud, Entity, Scene, Ship, Star,
    splice = [].splice;

  Scene = (function() {
    class Scene {
      constructor(container) {
        this.tick = this.tick.bind(this);
        this.container = container;
        this.entities = [];
        this.h = $(this.container).height();
        this.w = $(this.container).width();
        this.target = {
          x: 100,
          y: 200
        };
      }

      setup() {}

      run() {
        return setInterval(this.tick, 30);
      }

      update() {
        var entity, j, len, radius, ref, results, star, that, x, y, yellow;
        that = this;
        if (Math.random() > .005) {
          x = this.w + (100 * Math.random());
          y = this.h * Math.random();
          radius = 2 * Math.random();
          yellow = 255 * Math.random();
          star = new Star(that, x, y, radius, radius, 'star', yellow);
        }
        if (this.entities.length > 0) {
          ref = this.entities;
          results = [];
          for (j = 0, len = ref.length; j < len; j++) {
            entity = ref[j];
            if (entity) {
              results.push(entity.update());
            } else {
              results.push(void 0);
            }
          }
          return results;
        }
      }

      tick() {
        return this.update();
      }

    };

    Scene.prototype.scrollTop = 0;

    return Scene;

  }).call(this);

  Entity = (function() {
    class Entity {
      constructor(scene1, x1, y1, w1 = 0, h1 = 0, classname1 = 'entity') {
        var entity;
        this.scene = scene1;
        this.x = x1;
        this.y = y1;
        this.w = w1;
        this.h = h1;
        this.classname = classname1;
        entity = document.createElement('div');
        entity.className += this.classname;
        this.entity = entity;
        this.scene.container.appendChild(entity);
        this.scene.entities.push(this);
        if (this.scene.debug) {
          console.log('added ' + this.classname);
        }
      }

      update() {
        this.dx = this.x + this.vx * this.dirX;
        this.dy = this.y + this.vy * this.dirY;
        this.x = this.dx;
        this.y = this.dy + this.scene.scrollTop;
        return $(this.entity).css({
          'width': this.w + 'px',
          'height': this.h + 'px',
          'top': this.y + 'px',
          'left': this.x + 'px'
        });
      }

      draw() {}

      changeDir(direction = x) {
        if (direction === 'x') {
          return this.dirX = -this.dirX;
        } else if (direction === 'y') {
          return this.dirY = -this.dirY;
        } else {
          return console.log(direction + ' is not a valid direction');
        }
      }

    };

    Entity.prototype.vx = 0;

    Entity.prototype.vy = 0;

    Entity.prototype.dirY = 1;

    Entity.prototype.dirX = 1;

    Entity.prototype.scrollTop = 0;

    return Entity;

  }).call(this);

  Ship = (function() {
    class Ship extends Entity {
      update() {
        var cloudPoss, i, j;
        this.fly();
        super.update();
        cloudPoss = Math.random();
        if (cloudPoss > .3) {
          for (i = j = 0; j <= 3; i = ++j) {
            this.createCloud();
          }
        }
        if (cloudPoss > .7) {
          this.createCloud();
        }
        if (cloudPoss > .9) {
          return this.createCloud();
        }
      }

      fly() {
        if (this.x < this.scene.target.x - 10) {
          this.vx = this.speedX;
        } else if (this.x > this.scene.target.x + 10) {
          this.vx = -this.speedX;
        } else if (this.x >= this.scene.target.x - 10 || this.x <= this.scene.target.x + 10) {
          this.vx = 0;
        }
        if (this.y < this.scene.target.y - 5) {
          return this.vy = this.speedY;
        } else if (this.y > this.scene.target.y + 5) {
          return this.vy = -this.speedY;
        } else if (this.y <= this.scene.target.y + 5 || this.y >= this.scene.target.y - 5) {
          return this.vy = 0;
        }
      }

      chanceOfChangeX(x) {
        var chance;
        chance = 0.001;
        if (x > this.scene.w * .7 || x < this.scene.w * .1) {
          chance = .1;
        }
        if (Math.random() < chance) {
          return true;
        }
        return false;
      }

      chanceOfChangeY(y) {
        var chance;
        chance = 0.05;
        if (y > this.scene.h * .8 || y < this.scene.h * .2) {
          chance = 0.3;
        }
        if (Math.random() < chance) {
          return true;
        }
        return false;
      }

      createCloud() {
        var cloud, opac, radius, y;
        opac = Math.random();
        if (Math.random() > .6) {
          radius = 60 * Math.random();
        } else {
          radius = 40 * Math.random();
        }
        y = this.y + this.h / 4;
        y += 20 * Math.random();
        if (Math.random() > .5) {
          y *= -1;
        }
        return cloud = new Cloud(this.scene, this.x, y, radius, radius, opac);
      }

    };

    Ship.prototype.speedX = 3;

    Ship.prototype.speedY = 3;

    return Ship;

  }).call(this);

  Cloud = (function() {
    class Cloud extends Entity {
      constructor(scene, x, y, w, h, opacity) {
        super(scene, x, y, w, h, 'cloud');
        this.opacity = opacity;
        $(this.entity).css('opacity', this.opacity);
        this.vx = this.vx * Math.random() - 3;
      }

      
        //keep tabs on how many we're creating ...
      //console.log @scene.entities.length
      update() {
        super.update();
        this.opacity -= .004;
        $(this.entity).css('opacity', this.opacity);
        if (this.opacity <= 0) {
          return this.kill();
        }
      }

      kill() {
        var ref, t, that;
        that = this;
        if ((t = this.scene.entities.indexOf(that))) {
          splice.apply(this.scene.entities, [t, t - t + 1].concat(ref = [])), ref;
        }
        return $(this.entity).remove();
      }

    };

    Cloud.prototype.vx = -5;

    return Cloud;

  }).call(this);

  Star = (function() {
    class Star extends Entity {
      constructor(scene, x, y, w, h, classname, yellowBy = 0) {
        var blue;
        super(scene, x, y, w, h, 'star');
        this.yellowBy = yellowBy;
        blue = this.yellowBy;
        $(this.entity).css('background', 'rgb(255,255,' + blue + ')');
      }

      update() {
        super.update();
        if (this.x < 0) {
          return this.kill();
        }
      }

      kill() {
        var ref, t, that;
        that = this;
        if ((t = this.scene.entities.indexOf(that))) {
          splice.apply(this.scene.entities, [t, t - t + 1].concat(ref = [])), ref;
        }
        return $(this.entity).remove();
      }

    };

    Star.prototype.vx = -10;

    return Star;

  }).call(this);

  $(function() {
    var cont, dScroll, i, j, radius, scene, scenes, scroll_amt, ship, star, title, titleTop, vh, x, y, yellow;
    scenes = [];
    title = $('h1');
    titleTop = title.css('margin-top').split('px')[0];
    vh = $(window).height();
    vh = vh > 500 ? vh : 500;
    if (vh > 700) {
      vh = 800;
    }
    $('#banner').css('height', vh);
    scroll_amt = 0;
    dScroll = 0;
    $('#banner').mousemove(function(e) {
      var mouseX, mouseY;
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (scenes[0]) {
        return scenes[0].target = {
          x: mouseX - 130,
          y: mouseY - 120
        };
      }
    });
    $('#banner').mouseleave(function() {
      if (scenes[0]) {
        return scenes[0].target = {
          x: 200,
          y: 200
        };
      }
    });
    $(window).on('scroll', function() {
      var entity, j, len, opac, ref, results, scrollBy, scrollT;
      scrollT = $(this).scrollTop();
      dScroll = scrollT - scroll_amt;
      scroll_amt = scrollT;
      scrollBy = (scrollT * 1.5) + parseInt(titleTop);
      opac = 1.2 - (scrollBy / (title.parent().parent().outerHeight() - 50));
      title.css({
        'margin-top': scrollBy,
        'opacity': opac
      });
      if (scenes[0]) {
        ref = scenes[0].entities;
        results = [];
        for (j = 0, len = ref.length; j < len; j++) {
          entity = ref[j];
          if (entity.classname === 'star') {
            results.push(entity.y -= dScroll * (.5 * entity.w));
          } else {
            results.push(void 0);
          }
        }
        return results;
      }
    });
    cont = document.getElementById('banner');
    scene = new Scene(cont);
    scenes.push(scene);
    scene.run();
    scene.target = {
      x: 400,
      y: 180
    };
    for (i = j = 1; j <= 200; i = ++j) {
      x = Math.random() * scene.w;
      y = Math.random() * scene.h;
      radius = 2 * Math.random();
      yellow = 255 * Math.random();
      star = new Star(scene, x, y, radius, radius, 'star', yellow);
    }
    ship = new Ship(scene, 150, 100, 220, 80, 'shippy');
    return setTimeout(function() {
      return scene.target.y = 90;
    }, 1000);
  });

}).call(this);

function loadPDF(filename) {
  const viewer = document.getElementById("pdfViewer");
  viewer.innerHTML = `
    <iframe src="${filename}#toolbar=0" title="${filename}"></iframe>
  `;
}
