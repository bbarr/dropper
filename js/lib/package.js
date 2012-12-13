define([ 'gl' ], function(gl) {

  return gl.Piece.extend(function(config) {
    this.plane = config.plane;
    this.position = this.plane.position.clone();
    this.position.x += this.plane.width / 2;
    this.position.y += this.plane.height;
    this.velocity = new gl.Vector(this.plane.velocity.x, 1);
    this.gravity = 1.01;
    this.air = 0.99;
    this.tick = this.tick.bind(this);
    this.plane.game.screen.on('tick', this.tick);
    this.Constructor.count++;
  }, {
    
    tick: function(timer, move_with_screen) {
      this.erase();
      if (!this.landed) {
        this.detect_hit();
        this.move(timer);
      }
      move_with_screen(this);
      this.draw();
    },

    erase: function() {
      this.ctx.clearRect(this.position.x - 1, this.position.y - 1, 12, 12);
    },

    draw: function() {
      this.ctx.beginPath()
      this.ctx.rect(this.position.x, this.position.y, 10, 10);
      this.ctx.fill();
    },

    detect_hit: function() {
      if (this.y < 100) return;

      this.plane.game.targets.each(function(target) {
        if (
            target.position.x < this.position.x + this.width 
            && target.position.x + target.width > this.position.x
            && target.position.y < this.position.y + this.height
          ) {
          this.land_on(target);
        }
      }, this);
    },

    land_on: function(target) {
      this.landed = true;
      this.velocity.zero();
      this.score(target);
    },

    score: function(target) {
      var diff = Math.abs((this.position.x + (this.width / 2)) - (target.position.x + (target.width / 2)));
      var score = 1 - (diff / ((this.width / 2) + (target.width / 2)))
      this.plane.game.fire('score:update', Math.round(score * 100) / 100)
    },

    move: function(timer) {
      this.velocity.y *= this.gravity;
      this.velocity.x *= this.air;
      this.position.add(this.velocity.clone().scale(timer.coefficient));
      if (this.position.y > this.plane.game.screen.height || this.position.x < (this.width * -1)) {
        this.destroy();
        this.plane.game.screen.off('tick', this.tick);
      }
    }
  }, {

    count: 0 
  });
});
