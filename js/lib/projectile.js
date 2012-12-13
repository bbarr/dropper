define([ 'gl' ], function(gl) {

  return gl.Piece.extend(function(config) {
    this.velocity = config.velocity;
    this.target = this.game.plane;
    this.height = 10;
    this.width = 10;
    this.tick = this.tick.bind(this);
    this.game.screen.on('tick', this.tick);
  }, {

    tick: function(timer, move_with_screen) {
      this.erase();
      if (this.position.y > 0) {
        this.detect_hit();
        this.move(timer);
        this.draw();
      } else {
        this.game.screen.off('tick', this.tick)
        this.destroy();
      }
    },

    erase: function() {
      this.ctx.clearRect(this.position.x - 1, this.position.y - 1, 12, 12);
    },

    move: function(timer) {
      this.position.add(this.velocity.clone().scale(timer.coefficient));
    },

    draw: function() {
      this.ctx.beginPath()
      this.ctx.rect(this.position.x, this.position.y, 10, 10);
      this.ctx.fill();
    },

    detect_hit: function() {
      if (this.y < 100) return;

      var target = this.target;

      if (
          target.position.x < this.position.x + this.width 
          && target.position.x + target.width > this.position.x
          && target.position.y + target.height > this.position.y
        ) {
        this.hit(target);
      }
    },

    hit: function(target) {
      alert('you lose, try again');
      window.location.reload()
    }
  });
});
