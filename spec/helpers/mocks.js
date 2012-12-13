define([ 
  'gl',
  'lib/game',
  'lib/plane',
  'lib/screen',
  'lib/target',
  'lib/shooter'
], function(gl, Game, Plane, Screen, Target, Shooter) {

  var ctx = document.createElement('canvas').getContext('2d');

  return {

    game: function() {
      var game = new Game;
      game.screen = this.screen(game);
      game.plane = this.plane(game);
      return game;
    },

    screen: function(game) {
      return new Screen({
        game: game || this.game(),
        ctx: ctx,
        width: 100,
        height: 100
      });
    },

    plane: function(game) {
      return new Plane({ game: game || this.game(), ctx: ctx, width: 10, height: 10 });
    },

    target: function() {
      return new Target({ ctx: ctx, game: this.game(), width: 10, height: 10, position: new gl.Vector(100, 90) });
    },

    shooter: function() {
      return new Shooter({ ctx: ctx, game: this.game(), width: 10, height: 10, position: new gl.Vector(100, 90) });
    }
  }
});
