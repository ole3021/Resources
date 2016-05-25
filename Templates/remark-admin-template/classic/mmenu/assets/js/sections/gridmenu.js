/*!
 * remark (http://getbootstrapadmin.com/remark)
 * Copyright 2015 amazingsurge
 * Licensed under the Themeforest Standard Licenses
 */
(function(window, document, $) {
  'use strict';

  var $body = $('body'),
    $html = $('html');

  $.site.gridmenu = {
    opened: false,

    init: function() {
      this.$instance = $('.site-gridmenu');

      if (this.$instance.length === 0) {
        return;
      }

      this.bind();
    },

    bind: function() {
      var self = this;

      $(document).on('click', '[data-toggle="gridmenu"]', function() {
        var $this = $(this);

        if (self.opened) {
          self.close();

          $this.removeClass('active')
            .attr('aria-expanded', false);

        } else {
          self.open();

          $this.addClass('active')
            .attr('aria-expanded', true);
        }
      });
    },

    open: function() {
      var self = this;

      if (this.opened !== true) {
        this.animate(function() {
          self.opened = true;


          self.$instance.addClass('active');

          $('[data-toggle="gridmenu"]').addClass('active')
            .attr('aria-expanded', true);

          $body.addClass('site-gridmenu-active');
          $html.addClass('disable-scrolling');
        }, function() {
          this.scrollable.enable();
        });
      }
    },

    close: function() {
      var self = this;

      if (this.opened === true) {
        this.animate(function() {
          self.opened = false;

          self.$instance.removeClass('active');

          $('[data-toggle="gridmenu"]').addClass('active')
            .attr('aria-expanded', true);

          $body.removeClass('site-gridmenu-active');
          $html.removeClass('disable-scrolling');
        }, function() {
          this.scrollable.disable();
        });
      }
    },

    toggle: function() {
      if (this.opened) {
        this.close();
      } else {
        this.open();
      }
    },

    animate: function(doing, callback) {
      var self = this;

      doing.call(self);
      this.$instance.trigger('changing.site.gridmenu');

      setTimeout(function() {
        callback.call(self);

        self.$instance.trigger('changed.site.gridmenu');
      }, 500);
    },

    scrollable: {
      api: null,
      init: function() {
        this.api = $.site.gridmenu.$instance.asScrollable({
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
    },
  };
})(window, document, jQuery);
