require.config({
  baseUrl: 'js',
  shim: {
    marker: {
      exports: 'Marker'
    },
    underscore: {
      exports: '_'
    }
  },
  paths: {
    underscore: 'vendor/underscore',
    marker: 'vendor/marker',
    gl: 'vendor/gameling'
  }
});
