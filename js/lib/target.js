define([ 'gl' ], function(gl) {
  
  return gl.Piece.extend(function(config) {
    this.game.targets.add(this);
    this.tick = this.tick.bind(this);
    this.game.screen.on('tick', this.tick);
  }, {
    
    tick: function(timer, move_with_screen) {
      this.erase();
      move_with_screen(this);
      if (this.position.x < this.width * -1) {
        this.game.screen.off('tick', this.tick);
        this.destroy();
      }
      this.draw();
    },

    erase: function() {
      this.ctx.clearRect(this.position.x - 2, this.position.y - 2, this.width + 4, this.height + 4);
    },

    draw: function() {
      this.ctx.beginPath()
      this.ctx.rect(this.position.x, this.position.y, this.width, this.height);
      this.ctx.stroke();
    }
  });
});
