define([ 'gl', 'lib/package' ], function(gl, Package) {

  return gl.Piece.extend(function(config) {
    this.velocity = new gl.Vector(1, 0);
    this.position = new gl.Vector(0, 0);
    this.game.screen.on('tick', this.tick.bind(this));
    this.img_src = 'img/plane.jpg';
    this.img = new Image();
    this.img.src = this.img_src;
    this.width = 60;
    this.height = 39;
  }, {

    drop: function() {
      return new Package({ plane: this, ctx: this.ctx, width: 10, height: 10 });
    },

    tick: function(timer, move) {
      this.erase();
      move(this);
      this.move(timer);
      this.draw();
    },

    erase: function() {
      this.ctx.clearRect(this.position.x - 2, this.position.y - 2, this.width + 4, this.height + 4);
    },

    draw: function() {
      this.ctx.drawImage(this.img, this.position.x, this.position.y)
    },

    move: function(timer) {
      this.position.add(this.velocity.clone().scale(timer.coefficient));
      if (this.position.x < 0) {
        this.position.x = 0;
      } else if (this.position.x > this.game.screen.width - this.width) {
        this.position.x = this.game.screen.width - this.width;
      }
    }
  });
});
