define [ 'lib/plane', 'mocks', 'gl' ], (Plane, mocks, gl) ->

  describe 'Plane', ->

    plane = {}
    beforeEach ->
      plane = mocks.plane()
      screen = mocks.screen()

    describe "movement", ->

      it "should sit still if velocity is 0", ->
        plane.velocity.x = 0
        plane.position.x = 10
        plane.move(plane.game.timer)
        expect(plane.position.x).toBe(10)

      it "should move right when velocity is positive", ->
        plane.velocity.x = 1
        plane.position.x = 10
        plane.move(plane.game.timer)
        expect(plane.position.x).toBeGreaterThan(10)

      it "should move left when velocity is negative", ->
        plane.velocity.x = -1
        plane.position.x = 10
        plane.move(plane.game.timer)
        expect(plane.position.x).toBeLessThan(10)

      it "should not move off screen left", ->
        screen = plane.game.screen
        plane.velocity.x = -5
        plane.position.x = 0
        plane.tick(plane.game.timer, screen.scroll)
        expect(plane.position.x).toBe(0)

      it "should not move off screen right", ->
        screen = plane.game.screen
        plane.velocity.x = 10
        plane.position.x = screen.width - plane.width
        plane.tick(plane.game.timer, screen.scroll)
        expect(plane.position.x).toBe(screen.width - plane.width)

    describe "dropping", ->

      it "should drop something", ->
        expect(plane.drop()).toBeDefined()
