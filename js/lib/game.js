define([ 'gl' ], function(gl) {

  return gl.Game.extend(function(config) {
    this.targets = new gl.Collection;
  }, {

    m_to_px: function(m) {
      return m;
    }
  });
});
