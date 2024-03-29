/**
 *  Lightweight gaming framework.
 *
 *  @author Brendan Barr brendanbarr.web@gmail.com
 */

define(function() {

var gl = {};
var win = this.window || {};

gl.util = {
	
	generate_id: function() {
		var id = 0;
		return function() {
			return (id++).toString();
		}
	}(),
	
	extend: function(to, from) {
		for (var key in from) to[key] = from[key];
	}
};

gl.Events = function() {
  this.queues = {}; 
};

gl.Events.prototype = {

	on: function(name, cb, scope) {
		cb.scope = scope || this;
		(this.queues[name] || (this.queues[name] = [])).push(cb);
	},
	
	off: function(name, cb) {
	  
		var queue = this.queues[name];
		if (!queue) return;
		
		if (cb) {
		  var index = queue.indexOf(cb);
  		if (index > -1) {
        queue.splice(index, 1); 
        if (queue.length === 0) {
          delete this.queues[name];
        }
      }
		} else {
		  delete this.queues[name];
		}
	},
	
	fire: function(name) {
		
		var queue = this.queues[name];
		if (!queue) return;
		
    // dont cache this, in case something unbinds itself
		for (var i = 0; i < queue.length; i++) {
			queue[i].apply(queue[i].scope, [].slice.call(arguments, 1));
		}
	}

};

// Simple inheritance helper
gl.Constructor = function() {};
gl.Constructor.include = function(obj) { gl.util.extend(this.prototype, obj); };
gl.Constructor.mixin = gl.Constructor.prototype.mixin = function(obj) { gl.util.extend(this, obj); };
gl.Constructor.extend = function(Constructor, proto, props) {
 
  var self = this;

  var NewConstructor = function() {
    self.apply(this, arguments);
    if (Constructor) Constructor.apply(this, arguments);
  };
  
  gl.util.extend(NewConstructor, self);
  gl.util.extend(NewConstructor, Constructor);
  if (props) gl.util.extend(NewConstructor, props);
  NewConstructor.Parent = self;

  NewConstructor.prototype = Object.create(this.prototype);
  gl.util.extend(NewConstructor.prototype, proto || Constructor.prototype);
  NewConstructor.prototype.Constructor = NewConstructor;

  return NewConstructor;
}

gl.Collection = function(array) {
  gl.Events.call(this);
	this.array = array || [];
}

gl.Collection.prototype = {

	add: function(item) {
    item.id || (item.id = gl.util.generate_id());
		this.array.push(item);
    item.collection = this;
		this.fire('added', item);
	},

	remove: function(item) {
    var index = this.array.indexOf(item);
		this.array.splice(index, 1);
    delete item.collection;
		this.fire('removed', item);
	},

  find: function(id) {
    for (var i = 0, len = this.array.length; i < len; i++) {
      if (this.array[i].id === id) return this.array[i];
    }
  },

	each: function(iterator, scope) {
    scope = scope || this;
		for (var i = 0, len = this.array.length; i < len; i++) {
			if (iterator.call(scope, this.array[i], i, this.array) === false) {
        break;
      }
		}
	},

  random: function() {
    return this.array[Math.floor(Math.random() * this.array.length)];
  }
};

gl.util.extend(gl.Collection.prototype, gl.Events.prototype);

gl.Game = gl.Constructor.extend(gl.Events).extend(function(config) {
  config = config || {};
  this.timer = new gl.Timer(config.fps || 30);
});

gl.Piece = gl.Constructor.extend(gl.Events).extend(function(config) {
  config = config || {};
  this.id = gl.util.generate_id();
  this.game = config.game;
  this.ctx = config.ctx;
  this.width = config.width;
  this.height = config.height;
  this.position = config.position;
}, {
  
  destroy: function() {
    if (this.collection) this.collection.remove(this);
    this.erase();
  },

  erase: function() {},
  draw: function() {}
});

gl.Timer = function(fps) {
  gl.Events.call(this);
  this.ideal_fps = fps;
	this.smooth = fps >= 30;
  this.interval = 1000 / fps;
	this.coefficient = 1;
  this.tick = this.tick.bind(this);
};

gl.Timer.prototype = {
  
  every: function(num, one_time) {

    var self = this,
        get_num = function(num) {
          if (typeof num === 'number') {
            return num;
          } else {
            var range = num.split('..'),
                min = parseFloat(range[0]),
                max = parseFloat(range[1]);
            return (Math.random() * (max - min)) + min
          }
        };

    function bind(time, cb, scope) {

      var then = Date.now(),
          combined_cb = function() {
            var now = Date.now();
            if (now - then > time) {
              then = now;
              cb.call(scope || this);
              if (one_time) self.off('tick', combined_cb);
            }
          };

      self.on('tick', combined_cb, this);

      return { cancel: function() { self.off('tick', combined_cb); } };
    };

    return {

      seconds: function(cb, scope) {
        return bind(get_num(num) * 1000, cb, scope);
      },

      minutes: function(cb, scope) {
        return bind(get_num(num) * 60000, cb, scope);
      }
    }
  },

  after: function(num) {
    return this.every(num, true);
  },

  tick: function() {
    if (this.paused) return;
    this.fire('tick', this);
    this.get_frame(this.tick);
  },

  run: function() {
    this.paused = false;
    this.tick();
  },

  pause: function() {
    this.paused = true;
  },
  
	get_frame: function(cb) {
		this.process();
		if (this.smooth) {
			win.requestAnimationFrame(cb)
		}
		else {
			setTimeout(cb, this.interval * this.coefficient);
		}
	},
	
	process: function() {
    
    if (this.paused) {
      this.coefficient = 1;
      return;
    }
    
    var current_time = new Date().getTime(),
        elapsed = (current_time - (this.last_time || (current_time - 1))),
        fps = 1000 / elapsed;

    this.last_time = current_time;
		this.coefficient = Math.round(this.ideal_fps / fps * 100) / 100;
  }
};

gl.util.extend(gl.Timer.prototype, gl.Events.prototype);

gl.Vector = function(x, y) {
  this.x = x || 0;
  this.y = y || 0;
}

gl.Vector.prototype = {

  zero: function() {
    this.x = 0;
    this.y = 0;
  },

  add: function(v) {
    this.x += v.x;
    this.y += v.y;
    return this;
  },

  subtract: function(v) {
    this.x -= v.x;
    this.y -= v.y;        
    return this;    
  },

  round: function() {
    this.x = Math.round(this.x * 100) / 100;
    this.y = Math.round(this.y * 100) / 100;
  },

  scale: function(scale) {
    this.x *= scale;
    this.y *= scale;
    return this;
  },

  multiply: function(v) {
    this.x *= v.x;
    this.y *= v.y;
    return this;
  },

  dot: function(v) {
    return (this.x * v.x) + (this.y * v.y);
  },

  reverse: function() {
    this.x *= -1;
    this.y *= -1;
  },

  normalize: function() {
    var len = this.get_length();
    if (len) {
      this.x /= len;
      this.y /= len;
    }
    return this;
  },

  rotate: function(angle) {
    var cos = Math.cos(angle),
        sin = Math.sin(angle);
    this.x = this.x * cos - this.y * sin;
    this.y = this.x * sin + this.y * cos;
    return this;    
  },

  clone: function() {
    return new gl.Vector(this.x, this.y);
  },

	is_empty: function() {
		return this.x === 0 && this.y === 0;
	},

  get_length: function() {
    return Math.sqrt(this.get_raw_length());
  },

  get_raw_length: function() {
    return this.x * this.x + this.y * this.y;
  },
  
  get_angle_to: function(v) {
    var diff = this.get_difference(v);
    return Math.atan2(diff.y, diff.x);
  },
  
  get_angle: function() {
    return Math.atan2(this.y, this.x);
  },
  
  get_difference: function(v) {
    return v.clone().subtract(this);
  },

  is_near: function(v) {
    return this.get_difference(v).get_length() < 5;
  },
  
  to_string: function() {
    return 'Vector: ' + this.x + ', ' + this.y;
  }
};

// standardize requestAnimationFrame
win.requestAnimationFrame = win.requestAnimationFrame || 
                               win.webkitRequestAnimationFrame || 
                               win.mozRequestAnimationFrame || 
                               win.oRequestAnimationFrame || 
                               win.msRequestAnimationFrame ||
                               (function(cb) { setTimeout(cb, 100); });

(Function.prototype.bind || (Function.prototype.bind = function(scope) {
  var _this = this;
  return function() { _this.apply(scope, arguments); };
}));

return gl;

});
