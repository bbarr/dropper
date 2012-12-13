define([

  'backbone'

], function(Backbone) {

  var fetch = Backbone.Collection.prototype.fetch;

  Backbone.Collection.prototype.fetch = function(ignore_cache) {

    var now = new Date().getTime();

    if (ignore_cache || !this.last_fetched || this.last_fetched < now - 60000) {
      this.last_fetched = now;
      this.trigger('loading');
      fetch.apply(this, arguments);
    }
  };
});
