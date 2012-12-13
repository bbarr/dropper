define([ 'gl', 'lib/projectile' ], function(gl, Projectile) {

  return gl.Piece.extend(function(config) {
    this.shoot = this.shoot.bind(this);
    this.shooting_timer = this.game.timer.every('4..5').seconds(this.shoot);
    this.tick = this.tick.bind(this);
    this.game.screen.on('tick', this.tick);
  }, {
    
    shoot: function() {
      var vel = this.position.get_difference(this.game.plane.position).normalize().scale(1.2)
      new Projectile({ ctx: this.ctx, velocity: vel, position: this.position.clone(), game: this.game }) 
    },

    tick: function(timer, move_with_screen) {
      this.erase();
      move_with_screen(this);
      if (this.position.x < -12) {
        this.game.screen.off('tick', this.tick);
        this.destroy();
        this.shooting_timer.cancel();
      }
      this.draw();
    },

    erase: function() {
      this.ctx.clearRect(this.position.x - 2, this.position.y - 2, 14, 14);
    },

    draw: function() {
      this.ctx.beginPath()
      this.ctx.rect(this.position.x, this.position.y, 10, 10);
      this.ctx.stroke();
    }
  });
})
