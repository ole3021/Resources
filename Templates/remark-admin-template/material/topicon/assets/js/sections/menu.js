/*!
 * remark (http://getbootstrapadmin.com/remark)
 * Copyright 2015 amazingsurge
 * Licensed under the Themeforest Standard Licenses
 */
(function(window, document, $) {
  'use strict';

  $.site.menu = {
    speed: 250,
    accordion: true, // A setting that changes the collapsible behavior to expandable instead of the default accordion style

    init: function() {
      this.$instance = $('.site-menu');

      if (this.$instance.length === 0) {
        return;
      }

      this.bind();

      if (Breakpoints.current().name !== 'xs') {
        this.scrollable.init();
      }
    },

    globalClick: function(flag) {
      switch (flag) {
        case 'on':
          $(document).on('click.site.menu', function(e) {
            if ($('.dropdown > [data-dropdown-toggle="true"]').length > 0) {
              if ($(e.target).closest(".dropdown-menu").length === 0) {
                $('.dropdown > [data-dropdown-toggle="true"]').attr('data-dropdown-toggle', 'false').closest(".dropdown").removeClass('open');
              }
            }
          });
          break;
        case 'off':
          $(document).off('click.site.menu');
          break;
      }
    },

    open: function($tag) {
      if ($tag.is('.dropdown')) {
        $('[data-dropdown-toggle="true"]').attr('data-dropdown-toggle', 'false').closest(".dropdown").removeClass('open');
        $tag.find('>.dropdown-toggle').attr('data-dropdown-toggle', 'true');
      }
      $tag.addClass('open');
    },

    close: function($tag) {
      $tag.removeClass('open');
      if ($tag.is('.dropdown')) {
        $tag.find('>.dropdown-toggle').attr('data-dropdown-toggle', 'false');
      }
    },

    bind: function() {
      var self = this;

      if (Breakpoints.current().name !== 'xs') {
        self.globalClick('on');
      }

      this.$instance.on('open.site.menu', '.site-menu-item', function(e) {
        var $item = $(this);

        if (Breakpoints.current().name === 'xs') {
          self.expand($item, function() {
            self.open($item);
          });
        } else {
          self.open($item);
        }

        if (self.accordion) {
          $item.siblings('.open').trigger('close.site.menu');
        }

        e.stopPropagation();
      }).on('close.site.menu', '.site-menu-item.open', function(e) {
        var $item = $(this);

        if (Breakpoints.current().name === 'xs') {
          self.collapse($item, function() {
            self.close($item);
          });
        } else {
          self.close($item);
        }

        e.stopPropagation();
      }).on('click.site.menu', '.site-menu-item', function(e) {
        var $this = $(this);

        if ($this.is('.has-sub') && $(e.target).closest('.site-menu-item').is(this)) {
          if ($this.is('.open')) {
            $this.trigger('close.site.menu');
          } else {
            $this.trigger('open.site.menu');
          }
        }

        if (Breakpoints.current().name === 'xs') {
          e.stopPropagation();
        } else {
          if ($this.is('.dropdown')) {
            e.stopPropagation();
          }

          if ($(e.target).closest('.site-menu-scroll-wrap').length === 1) {
            self.scrollable.update($(e.target).closest('.site-menu-scroll-wrap'))
            e.stopPropagation();
          }
        }
      });

      var prevBreakpoint = Breakpoints.current().name;

      Breakpoints.on('change', function() {
        var current = Breakpoints.current().name;

        self.reset();
        if (current === 'xs') {
          self.globalClick('off');
          self.scrollable.destory();
          self.$instance.off('click.site.menu.scroll');
        } else {
          if (prevBreakpoint === 'xs') {

            if (!self.scrollable.built) {
              self.scrollable.init();
            }

            self.globalClick('off');
            self.globalClick('on');

            $('.site-menu .scrollable-container', self.$instance).css({
              'height': '',
              'width': ''
            });

            self.$instance.one('click.site.menu.scroll', '.site-menu-item', function() {
              self.scrollable.refresh();
            });
          }
        }
        prevBreakpoint = current;
      });
    },

    reset: function() {
      $('.dropdown > [data-dropdown-toggle="true"]').attr('data-dropdown-toggle', 'false').closest(".dropdown").removeClass('open');
    },

    collapse: function($item, callback) {
      var self = this;
      var $sub = $($('> .site-menu-sub', $item)[0] || $('> .dropdown-menu', $item)[0] || $('> .site-menu-scroll-wrap', $item)[0]);

      $sub.show().slideUp(this.speed, function() {
        $(this).css('display', '');

        $(this).find('> .site-menu-item').removeClass('is-shown');

        if (callback) {
          callback();
        }

        self.$instance.trigger('collapsed.site.menu');
      });
    },

    expand: function($item, callback) {
      var self = this;
      var $sub = $($('> .site-menu-sub', $item)[0] || $('> .dropdown-menu', $item)[0] || $('> .site-menu-scroll-wrap', $item)[0]);
      var $children = $sub.is('.site-menu-sub') ? $sub.children('.site-menu-item').addClass('is-hidden') : $($sub.find('.site-menu-sub')[0]).addClass('is-hidden');

      $sub.hide().slideDown(this.speed, function() {
        $(this).css('display', '');

        if (callback) {
          callback();
        }

        self.$instance.trigger('expanded.site.menu');
      });

      setTimeout(function() {
        $children.addClass('is-shown');
        $children.removeClass('is-hidden');
      }, 0);
    },

    refresh: function() {
      this.$instance.find('.open').filter(':not(.active)').removeClass('open');
    },

    scrollable: {
      built: false,
      init: function() {
        var skin = 'scrollable-inverse';

        if ($.site.menubar.$instance && $.site.menubar.$instance.is('.site-menubar-light')) {
          skin = '';
        } else if ($('.site-menubar').is('.site-menubar-light')) {
          skin = '';
        }

        $.each($('.site-menu-scroll-wrap', $.site.menu.$instance), function(i, list) {
          $(list).asScrollable({
            namespace: 'scrollable',
            skin: skin,
            direction: 'vertical',
            contentSelector: '>',
            containerSelector: '>'
          }).data('asScrollable');
        });
        this.built = true;
      },

      update: function($target) {
        $target.data('asScrollable').update();
      },

      enable: function($target) {
        $target.data('asScrollable').enable();
      },

      disable: function($target) {
        $target.data('asScrollable').disable();
      },

      refresh: function() {
        var self = this;

        $.each($('.site-menu-scroll-wrap', this.$instance), function(i, list) {
          self.enable($(list));
        });
      },

      destory: function() {
        var self = this;

        $.each($('.site-menu-scroll-wrap', this.$instance), function(i, list) {
          self.disable($(list));
        });
      }
    }
  };
})(window, document, jQuery);
