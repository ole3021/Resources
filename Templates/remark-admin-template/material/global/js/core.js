/*!
 * remark (http://getbootstrapadmin.com/remark)
 * Copyright 2015 amazingsurge
 * Licensed under the Themeforest Standard Licenses
 */
(function(window, document, $) {
  'use strict';

  var $doc = $(document);

  // Site
  // ====
  $.site = $.site || {};

  $.extend($.site, {
    _queue: {
      prepare: [],
      run: [],
      complete: []
    },

    run: function() {
      var self = this;

      this.dequeue('prepare', function() {
        self.trigger('before.run', self);
      });

      this.dequeue('run', function() {
        self.dequeue('complete', function() {
          self.trigger('after.run', self);
        });
      });
    },

    dequeue: function(name, done) {
      var self = this,
        queue = this.getQueue(name),
        fn = queue.shift(),
        next = function() {
          self.dequeue(name, done);
        };

      if (fn) {
        fn.call(this, next);
      } else if ($.isFunction(done)) {
        done.call(this);
      }
    },

    getQueue: function(name) {
      if (!$.isArray(this._queue[name])) {
        this._queue[name] = [];
      }

      return this._queue[name];
    },

    extend: function(obj) {
      $.each(this._queue, function(name, queue) {
        if ($.isFunction(obj[name])) {
          queue.push(obj[name]);

          delete obj[name];
        }
      });

      $.extend(this, obj);

      return this;
    },

    trigger: function(name, data, $el) {
      if (typeof name === 'undefined') return;
      if (typeof $el === 'undefined') $el = $doc;

      $el.trigger(name + '.site', data);
    },

    throttle: function(func, wait) {
      var _now = Date.now || function() {
        return new Date().getTime();
      };
      var context, args, result;
      var timeout = null;
      var previous = 0;

      var later = function() {
        previous = _now();
        timeout = null;
        result = func.apply(context, args);
        context = args = null;
      };

      return function() {
        var now = _now();
        var remaining = wait - (now - previous);
        context = this;
        args = arguments;
        if (remaining <= 0) {
          clearTimeout(timeout);
          timeout = null;
          previous = now;
          result = func.apply(context, args);
          context = args = null;
        } else if (!timeout) {
          timeout = setTimeout(later, remaining);
        }
        return result;
      };
    },

    resize: function() {
      if (document.createEvent) {
        var ev = document.createEvent('Event');
        ev.initEvent('resize', true, true);
        window.dispatchEvent(ev);
      } else {
        element = document.documentElement;
        var event = document.createEventObject();
        element.fireEvent("onresize", event);
      }
    }
  });

  // Configs
  // =======
  $.configs = $.configs || {};

  $.extend($.configs, {
    data: {},
    get: function(name) {
      var callback = function(data, name) {
        return data[name];
      }

      var data = this.data;

      for (var i = 0; i < arguments.length; i++) {
        name = arguments[i];

        data = callback(data, name);
      }

      return data;
    },

    set: function(name, value) {
      this.data[name] = value;
    },

    extend: function(name, options) {
      var value = this.get(name);
      return $.extend(true, value, options);
    }
  });

  // Colors
  // ======
  $.colors = function(name, level) {
    if (name === 'primary') {
      name = $.configs.get('site', 'primaryColor');
      if (!name) {
        name = 'red';
      }
    }

    if (typeof $.configs.colors === 'undefined') {
      return null;
    }

    if (typeof $.configs.colors[name] !== 'undefined') {
      if (level && typeof $.configs.colors[name][level] !== 'undefined') {
        return $.configs.colors[name][level];
      }

      if (typeof level === 'undefined') {
        return $.configs.colors[name];
      }
    }

    return null;
  };

  // Components
  // ==========
  $.components = $.components || {};

  $.extend($.components, {
    _components: {},

    register: function(name, obj) {
      this._components[name] = obj;
    },

    init: function(name, context, args) {
      var self = this;

      if (typeof name === 'undefined') {
        $.each(this._components, function(name) {
          self.init(name);
        });
      } else {
        context = context || document;
        args = args || [];

        var obj = this.get(name);

        if (obj) {
          switch (obj.mode) {
            case 'default':
              return this._initDefault(name, context);
            case 'init':
              return this._initComponent(name, obj, context, args);
            case 'api':
              return this._initApi(name, obj, args);
            default:
              this._initApi(name, obj, context, args);
              this._initComponent(name, obj, context, args);
              return;
          }
        }
      }
    },

    /* init alternative, but only or init mode */
    call: function(name, context) {
      var args = Array.prototype.slice.call(arguments, 2);
      var obj = this.get(name);

      context = context || document;

      return this._initComponent(name, obj, context, args);
    },

    _initDefault: function(name, context) {
      if (!$.fn[name]) return;

      var defaults = this.getDefaults(name);

      $('[data-plugin=' + name + ']', context).each(function() {
        var $this = $(this),
          options = $.extend(true, {}, defaults, $this.data());

        $this[name](options);
      });
    },


    _initComponent: function(name, obj, context, args) {
      if ($.isFunction(obj.init)) {
        obj.init.apply(obj, [context].concat(args));
      }
    },

    _initApi: function(name, obj, args) {
      if (typeof obj.apiCalled === 'undefined' && $.isFunction(obj.api)) {
        obj.api.apply(obj, args);

        obj.apiCalled = true;
      }
    },


    getDefaults: function(name) {
      var component = this.get(name);

      if (component && typeof component.defaults !== "undefined") {
        return component.defaults;
      } else {
        return {};
      }
    },

    get: function(name, property) {
      if (typeof this._components[name] !== "undefined") {
        if (typeof property !== "undefined") {
          return this._components[name][property];
        } else {
          return this._components[name];
        }
      } else {
        console.warn('component:' + component + ' script is not loaded.');

        return undefined;
      }
    }
  });

})(window, document, jQuery);
