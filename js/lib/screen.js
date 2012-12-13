define([ 'gl' ], function(gl) {

  return gl.Piece.extend(function(config) {
    this.offset = 2;
    this.game.timer.on('tick', this.tick, this);
    this.scroll = this.scroll.bind(this);
    this.draw();
  }, {

    draw: function() {
      this.ctx.beginPath();
      this.ctx.rect(0, 0, this.width, this.height * 80 / 100);
      this.ctx.fillStyle = '#ffffff';
      this.ctx.fill();
      this.ctx.beginPath();
      this.ctx.rect(0, this.height * 80 / 100, this.width, this.height - (this.height * 80 / 100));
      this.ctx.fillStyle = '#8b4513';
      this.ctx.fill();
    },
    
    tick: function(timer) {
      this.fire('tick', timer, this.scroll);
    },

    scroll: function(piece) {
      piece.position.x -= (this.offset * this.game.timer.coefficient);
    }
  });
});
