(function(window, document, $) {
  'use strict';

  var pluginName = 'actionBtn';

  var Plugin = $[pluginName] = function(element, options) {
    this.element = element;
    this.$element = $(element);

    this.options = $.extend({}, Plugin.defaults, options, this.$element.data());

    this.init();
  };

  Plugin.defaults = {
    trigger: 'click', // click, hover
    toggleSelector: '.site-action-toggle',
    listSelector: '.site-action-buttons',
    activeClass: 'active',
    onShow: function() {},
    onHide: function() {}
  };

  Plugin.prototype = {
    constructor: Plugin,
    init: function() {
      this.showed = false;

      this.$toggle = this.$element.find(this.options.toggleSelector);
      this.$list = this.$element.find(this.options.listSelector);

      var self = this;

      if (this.options.trigger === 'hover') {
        this.$element.on('mouseenter', this.options.toggleSelector, function() {
          if (!self.showed) {
            self.show();
          }
        });
        this.$element.on('mouseleave', this.options.toggleSelector, function() {
          if (self.showed) {
            self.hide();
          }
        });
      } else {
        this.$element.on('click', this.options.toggleSelector, function() {
          if (self.showed) {
            self.hide();
          } else {
            self.show();
          }
        });
      }
    },

    show: function() {
      if (!this.showed) {
        this.$element.addClass(this.options.activeClass);
        this.showed = true;

        this.options.onShow.call(this);
      }
    },
    hide: function() {
      if (this.showed) {
        this.$element.removeClass(this.options.activeClass);
        this.showed = false;

        this.options.onHide.call(this);
      }
    }
  };

  $.fn[pluginName] = function(options) {
    if (typeof options === 'string') {
      var method = options;
      var method_arguments = Array.prototype.slice.call(arguments, 1);

      if (/^\_/.test(method)) {
        return false;
      } else if ((/^(get)$/.test(method))) {
        var api = this.first().data(pluginName);
        if (api && typeof api[method] === 'function') {
          return api[method].apply(api, method_arguments);
        }
      } else {
        return this.each(function() {
          var api = $.data(this, pluginName);
          if (api && typeof api[method] === 'function') {
            api[method].apply(api, method_arguments);
          }
        });
      }
    } else {
      return this.each(function() {
        if (!$.data(this, pluginName)) {
          $.data(this, pluginName, new Plugin(this, options));
        }
      });
    }
  };
})(window, document, jQuery);
