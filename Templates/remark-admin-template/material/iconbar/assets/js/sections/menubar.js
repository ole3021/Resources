/*!
 * remark (http://getbootstrapadmin.com/remark)
 * Copyright 2015 amazingsurge
 * Licensed under the Themeforest Standard Licenses
 */
(function(window, document, $) {
  'use strict';

  var $body = $('body'),
    $html = $('html');

  $.site.menubar = {
    opened: null,
    top: false,
    $instance: null,
    auto: true,

    init: function() {
      $html.removeClass('css-menubar').addClass('js-menubar');

      this.$instance = $(".site-menubar");

      if (this.$instance.length === 0) {
        return;
      }

      var self = this;

      this.$instance.on('changed.site.menubar', function() {
        self.update();
      });

      this.hoverscroll.enable();

      this.change();
    },

    change: function() {
      var breakpoint = Breakpoints.current();

      if ($body.hasClass('site-menubar-keep') && $body.hasClass('site-menubar-hide')) {
        this.hide();

        if (breakpoint && $body.hasClass('site-menubar-unfold')) {
          if (breakpoint.name === "xs") {
            this.hide();
          }
        }
      } else {
        this.reset();

        if (breakpoint) {
          if (breakpoint.name === "xs") {
            this.hide();
          } else {
            this.unfold();
          }
        }
      }
    },

    animate: function(doing, callback) {
      var self = this;
      $body.addClass('site-menubar-changing');

      doing.call(self);
      this.$instance.trigger('changing.site.menubar');

      setTimeout(function() {
        callback.call(self);
        $body.removeClass('site-menubar-changing');

        self.$instance.trigger('changed.site.menubar');
      }, 500);
    },

    reset: function() {
      this.opened = null;
      $body.removeClass('site-menubar-hide site-menubar-unfold');
    },

    hide: function() {
      if (this.opened !== false) {
        this.animate(function() {
          $body.removeClass('site-menubar-unfold').addClass('site-menubar-hide');
          this.opened = false;

        }, function() {

        });
      }
    },

    unfold: function() {
      if (this.opened !== true) {
        this.animate(function() {
          $body.removeClass('site-menubar-hide').addClass('site-menubar-unfold');
          this.opened = true;
        }, function() {
          $.site.resize();
        });
      }
    },

    toggle: function() {
      var breakpoint = Breakpoints.current();
      var opened = this.opened;

      if (!opened) {
        this.unfold();
      } else {
        this.hide();
      }
    },

    update: function() {
      this.hoverscroll.update();
    },

    hoverscroll: {
      api: null,

      init: function() {
        this.api = $.site.menubar.$instance.children('.site-menubar-body').asHoverScroll({
          namespace: 'hoverscorll',
          direction: 'vertical',
          list: '.site-menu',
          item: '> .site-menu-item',
          exception: '.site-menu-sub',
          fixed: false,
          boundary: 100,
          onEnter: function() {
            //$(this).siblings().removeClass('hover');
            //$(this).addClass('hover');
          },
          onLeave: function() {
            //$(this).removeClass('hover');
          }
        }).data('asHoverScroll');
      },

      update: function() {
        if (this.api) {
          this.api.update();
        }
      },

      enable: function() {
        if (!this.api) {
          this.init();
        }
        if (this.api) {
          this.api.enable();
        }
      },

      disable: function() {
        if (this.api) {
          this.api.disable();
        }
      }
    }
  };
})(window, document, jQuery);
