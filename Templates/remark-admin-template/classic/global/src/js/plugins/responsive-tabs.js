(function(window, document, $) {
  "use strict";

  var pluginName = 'responsiveHorizontalTabs',
    defaults = {
      navSelector: '.nav-tabs',
      itemSelector: '>li',
      dropdownSelector: '>.dropdown',
      dropdownItemSelector: 'li',
      tabSelector: '.tab-pane',
      activeClassName: 'active'
    };

  var Plugin = function(el, options) {
    var $tabs = this.$tabs = $(el);
    this.options = options = $.extend(true, {}, defaults, options);

    var $nav = this.$nav = $tabs.find(this.options.navSelector),
      $dropdown = this.$dropdown = $nav.find(this.options.dropdownSelector);
    var $items = this.$items = $nav.find(this.options.itemSelector).filter(function() {
      return !$(this).is($dropdown);
    });

    this.$dropdownItems = $dropdown.find(this.options.dropdownItemSelector);
    this.$tabPanel = this.$tabs.find(this.options.tabSelector);

    this.breakpoints = [];

    $items.each(function() {
      $(this).data('width', $(this).width());
    });

    this.init();
    this.bind();

  };

  Plugin.prototype = {
    init: function() {
      if (this.$dropdown.length === 0) return;

      this.$dropdown.show();
      this.breakpoints = [];

      var length = this.length = this.$items.length,
        dropWidth = this.dropWidth = this.$dropdown.width(),
        total = 0;

      this.flag = length;

      if (length <= 1) {
        this.$dropdown.hide();
        return;
      }

      for (var i = 0; i < length - 2; i++) {
        if (i === 0) this.breakpoints.push(this.$items.eq(i).outerWidth() + dropWidth);
        else this.breakpoints.push(this.breakpoints[i - 1] + this.$items.eq(i).width());
      }

      for (i = 0; i < length; i++) {
        total += this.$items.eq(i).outerWidth();
      }
      this.breakpoints.push(total);

      this.layout();
    },

    layout: function() {
      if (this.breakpoints.length <= 0) return;

      var width = this.$nav.width(),
        i = 0,
        activeClassName = this.options.activeClassName,
        active = this.$tabPanel.filter('.' + activeClassName).index();

      for (; i < this.breakpoints.length; i++) {
        if (this.breakpoints[i] > width) break;
      }

      if (i === this.flag) return;


      this.$items.removeClass(activeClassName);
      this.$dropdownItems.removeClass(activeClassName);
      this.$dropdown.removeClass(activeClassName);

      if (i === this.breakpoints.length) {
        this.$dropdown.hide();
        this.$items.show();
        this.$items.eq(active).addClass(activeClassName);
      } else {
        this.$dropdown.show();
        for (var j = 0; j < this.length; j++) {
          if (j < i) {
            this.$items.eq(j).show();
            this.$dropdownItems.eq(j).hide();
          } else {
            this.$items.eq(j).hide();
            this.$dropdownItems.eq(j).show();
          }
        }

        if (active < i) {
          this.$items.eq(active).addClass(activeClassName);
        } else {
          this.$dropdown.addClass(activeClassName);
          this.$dropdownItems.eq(active).addClass(activeClassName);
        }


      }

      this.flag = i;
    },

    bind: function() {
      var self = this;

      $(window).resize(function() {
        self.layout();
      });
    }

  };


  $.fn[pluginName] = function(options) {
    if (typeof options === 'string') {
      var method = options;
      var method_arguments = Array.prototype.slice.call(arguments, 1);
      if (/^\_/.test(method)) {
        return false;
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
        } else {
          $.data(this, pluginName).init();
        }
      });
    }
  };
})(window, document, jQuery);
