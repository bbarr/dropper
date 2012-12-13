// Generated by CoffeeScript 1.4.0
(function() {

  define(['lib/screen', 'mocks', 'gl'], function(Screen, mocks, gl) {
    return describe('Screen', function() {
      var screen;
      screen = {};
      beforeEach(function() {
        return screen = mocks.screen();
      });
      return describe("movement", function() {
        return it("should offer its movement to other pieces listening to its tick event", function() {
          spyOn(screen, 'scroll');
          screen.on('tick', function(timer, shift) {});
          return screen.tick();
        });
      });
    });
  });

}).call(this);