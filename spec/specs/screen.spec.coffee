define [ 'lib/screen', 'mocks', 'gl' ], (Screen, mocks, gl) ->

  describe 'Screen', ->

    screen = {}
    beforeEach ->
      screen = mocks.screen()

    describe "movement", ->

      it "should offer its movement to other pieces listening to its tick event", ->
        spyOn(screen, 'scroll')
        screen.on 'tick', (timer, shift) ->
        screen.tick()

