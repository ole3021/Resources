(function(window, document, $) {
  'use strict';
  var $body = $('body'),
    $html = $('html');

  $.site.menubar = {
    opened: null,
    $instance: null,
    init: function() {
      $html.removeClass('css-menubar').addClass('js-menubar');

      this.$instance = $(".site-menubar");
      if (this.$instance.length === 0) {
        return;
      }

      var self = this;

      this.$instance.on('changing.site.menubar', function() {
        $('[data-toggle="site-menubar"]').each(function() {
          var $this = $(this);
          var $hamburger = $(this).find('.hamburger');

          function toggle($el) {
            $el.toggleClass('hided', !self.opened);
          }
          if ($hamburger.length > 0) {
            toggle($hamburger);
          } else {
            toggle($this);
          }
        });
      });

      $(document).on('click', '[data-toggle="site-menubar"]', function() {
        self.toggle();
        return false;
      });

      this.$instance.on('changed.site.menubar', function() {
        self.update();
      });

      this.change();

      Breakpoints.on('change', function() {
        self.change();
      });
    },

    change: function() {
      var breakpoint = Breakpoints.current();
      this.reset();

      if (breakpoint.name == 'xs') {
        this.hide();
      }

      this.scrollable.disable();
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
      $body.removeClass('site-menubar-hide site-menubar-open');
    },

    open: function() {
      if (this.opened !== true) {
        this.animate(function() {
          $body.removeClass('site-menubar-hide').addClass('site-menubar-open');
          this.opened = true;

          $html.addClass('disable-scrolling');

        }, function() {
          if (Breakpoints.current().name === 'xs') {
            this.scrollable.enable();
          }
        });
      }
    },

    hide: function() {
      if (this.opened !== false) {
        this.animate(function() {
          $html.removeClass('disable-scrolling');
          $body.removeClass('site-menubar-open').addClass('site-menubar-hide');
          this.opened = false;

        }, function() {
          this.scrollable.enable();
        });
      }
    },

    toggle: function() {
      var breakpoint = Breakpoints.current();
      var opened = this.opened;

      if (breakpoint.name === 'xs') {
        if (opened === null || opened === false) {
          this.open();
        } else {
          this.hide();
        }
      }
    },

    update: function() {
      this.scrollable.update();
    },

    scrollable: {
      api: null,
      init: function() {
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
