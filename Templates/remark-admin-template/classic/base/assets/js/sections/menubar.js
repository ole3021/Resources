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
    folded: null,
    top: false,
    foldAlt: false,
    $instance: null,
    auto: true,

    init: function() {
      $html.removeClass('css-menubar').addClass('js-menubar');

      this.$instance = $(".site-menubar");

      if (this.$instance.length === 0) {
        return;
      }

      var self = this;

      if ($body.is('.site-menubar-top')) {
        this.top = true;
      }

      if ($body.is('.site-menubar-fold-alt')) {
        this.foldAlt = true;
      }

      if ($body.data('autoMenubar') === false || $body.is('.site-menubar-keep')) {
        if ($body.hasClass('site-menubar-fold')) {
          this.auto = 'fold';
        } else if ($body.hasClass('site-menubar-unfold')) {
          this.auto = 'unfold';
        }
      }

      this.$instance.on('changed.site.menubar', function() {
        self.update();
      });

      this.change();
    },

    change: function() {
      var breakpoint = Breakpoints.current();
      if (this.auto !== true) {
        switch (this.auto) {
          case 'fold':
            this.reset();
            if (breakpoint.name == 'xs') {
              this.hide();
            } else {
              this.fold();
            }
            return;
          case 'unfold':
            this.reset();
            if (breakpoint.name == 'xs') {
              this.hide();
            } else {
              this.unfold();
            }
            return;
        }
      }

      this.reset();

      if (breakpoint) {
        switch (breakpoint.name) {
          case 'lg':
            this.unfold();
            break;
          case 'md':
          case 'sm':
            this.fold();
            break;
          case 'xs':
            this.hide();
            break;
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
      this.folded = null;
      $body.removeClass('site-menubar-hide site-menubar-open site-menubar-fold site-menubar-unfold');
      $html.removeClass('disable-scrolling');
    },

    open: function() {
      if (this.opened !== true) {
        this.animate(function() {
          $body.removeClass('site-menubar-hide').addClass('site-menubar-open site-menubar-unfold');
          this.opened = true;

          $html.addClass('disable-scrolling');

        }, function() {
          this.scrollable.enable();
        });
      }
    },

    hide: function() {
      this.hoverscroll.disable();

      if (this.opened !== false) {
        this.animate(function() {

          $html.removeClass('disable-scrolling');
          $body.removeClass('site-menubar-open').addClass('site-menubar-hide site-menubar-unfold');
          this.opened = false;

        }, function() {
          this.scrollable.enable();
        });
      }
    },

    unfold: function() {
      this.hoverscroll.disable();

      if (this.folded !== false) {
        this.animate(function() {
          $body.removeClass('site-menubar-fold').addClass('site-menubar-unfold');
          this.folded = false;

        }, function() {
          this.scrollable.enable();

          if (this.folded !== null) {
            $.site.resize();
          }
        });
      }
    },

    fold: function() {
      this.scrollable.disable();

      if (this.folded !== true) {
        this.animate(function() {

          $body.removeClass('site-menubar-unfold').addClass('site-menubar-fold');
          this.folded = true;

        }, function() {
          this.hoverscroll.enable();

          if (this.folded !== null) {
            $.site.resize();
          }
        });
      }
    },

    toggle: function() {
      var breakpoint = Breakpoints.current();
      var folded = this.folded;
      var opened = this.opened;

      switch (breakpoint.name) {
        case 'lg':
          if (folded === null || folded === false) {
            this.fold();
          } else {
            this.unfold();
          }
          break;
        case 'md':
        case 'sm':
          if (folded === null || folded === true) {
            this.unfold();
          } else {
            this.fold();
          }
          break;
        case 'xs':
          if (opened === null || opened === false) {
            this.open();
          } else {
            this.hide();
          }
          break;
      }
    },

    update: function() {
      this.scrollable.update();
      this.hoverscroll.update();
    },

    scrollable: {
      api: null,
      native: false,
      init: function() {
        // if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        //   this.native = true;
        //   $body.addClass('site-menubar-native');
        //   return;
        // }

        if ($body.is('.site-menubar-native')) {
          this.native = true;
          return;
        }

        this.api = $.site.menubar.$instance.children('.site-menubar-body').asScrollable({
          namespace: 'scrollable',
          skin: 'scrollable-inverse',
          direction: 'vertical',
          contentSelector: '>',
          containerSelector: '>'
        }).data('asScrollable');
      },

      update: function() {
        if (this.api) {
          this.api.update();
        }
      },

      enable: function() {
        if (this.native) {
          return;
        }
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
    },

    hoverscroll: {
      api: null,

      init: function() {
        this.api = $.site.menubar.$instance.children('.site-menubar-body').asHoverScroll({
          namespace: 'hoverscorll',
          direction: 'vertical',
          list: '.site-menu',
          item: '> li',
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
