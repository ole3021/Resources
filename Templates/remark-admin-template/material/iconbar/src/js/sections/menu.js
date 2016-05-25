(function(window, document, $) {
  'use strict';

  $.site.menu = {
    speed: 250,
    init: function() {
      this.$instance = $('.site-menu');

      if (this.$instance.length === 0) {
        return;
      }

      this.bind();
    },

    bind: function() {
      var self = this;

      this.$instance.on('mouseenter.site.menu', '.site-menu-item', function(e) {
        var $item = $(this);
        if ($item.is('.has-sub') && $item.parent('.site-menu').length > 0) {
          var $sub = $item.children('.site-menu-sub');
          self.position($item, $sub);
        }

        $item.addClass('hover');
      }).on('mouseleave.site.menu', '.site-menu-item', function() {
        var $item = $(this);
        if ($item.is('.has-sub') && $item.parent('.site-menu').length > 0) {
          $item.children('.site-menu-sub').css("max-height", "");
        }

        $item.removeClass('hover');
      }).on('deactive.site.menu', '.site-menu-item.active', function(e) {
        var $item = $(this);

        $item.removeClass('active');

        e.stopPropagation();
      }).on('active.site.menu', '.site-menu-item', function(e) {
        var $item = $(this);

        $item.addClass('active');

        e.stopPropagation();
      }).on('open.site.menu', '.site-menu-item', function(e) {
        var $item = $(this);

        self.expand($item, function() {
          $item.addClass('open');
        });

        $item.siblings('.open').trigger('close.site.menu');

        e.stopPropagation();
      }).on('close.site.menu', '.site-menu-item.open', function(e) {
        var $item = $(this);

        self.collapse($item, function() {
          $item.removeClass('open');
        });

        e.stopPropagation();
      }).on('click.site.menu ', '.site-menu-item', function(e) {
        var $item = $(this);
        if ($item.parent('.site-menu').length == 0 && $item.is('.has-sub') && $(e.target).closest('.site-menu-item').is(this)) {
          if ($item.is('.open')) {
            $item.trigger('close.site.menu');
          } else {
            $item.trigger('open.site.menu');
          }
        } else {
          if (!$item.is('.active')) {
            $item.siblings('.active').trigger('deactive.site.menu');
            $item.trigger('active.site.menu');
          }
        }

        e.stopPropagation();
      }).on('tap.site.menu', '> .site-menu-item', function() {
        var $item = $(this);

        if ($item.is('.has-sub') && $item.parent('.site-menu').length > 0) {
          $item.siblings('.hover').each(function() {
            var $item = $(this);
            if ($item.is('.has-sub') && $item.parent('.site-menu').length > 0) {
              $item.children('.site-menu-sub').css("max-height", "");
            }

            $item.removeClass('hover');
          });

          if ($item.is('.hover')) {
            if ($item.is('.has-sub') && $item.parent('.site-menu').length > 0) {
              $item.children('.site-menu-sub').css("max-height", "");
            }
            $item.removeClass('hover');
          } else {
            if ($item.is('.has-sub') && $item.parent('.site-menu').length > 0) {
              var $sub = $item.children('.site-menu-sub');
              self.position($item, $sub);
            }
            $item.addClass('hover');
          }
        }
      }).on('scroll.site.menu', '.site-menu-sub', function(e) {
        e.stopPropagation();
      });
    },

    collapse: function($item, callback) {
      var self = this;
      var $sub = $item.children('.site-menu-sub');

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
      var $sub = $item.children('.site-menu-sub');
      var $children = $sub.children('.site-menu-item').addClass('is-hidden');

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

    position: function($item, $dropdown) {
      var offsetTop = $item.position().top,
        dropdownHeight = $dropdown.outerHeight(),
        menubarHeight = $.site.menubar.$instance.outerHeight(),
        itemHeight = $item.find("> a").outerHeight();

      $dropdown.removeClass('site-menu-sub-up').css('max-height', "");

      //if (offsetTop + dropdownHeight > menubarHeight) {
      if (offsetTop > menubarHeight / 2) {
        $dropdown.addClass('site-menu-sub-up');

        if ($.site.menubar.foldAlt) {
          offsetTop = offsetTop - itemHeight;
        }
        //if(dropdownHeight > offsetTop + itemHeight) {
        $dropdown.css('max-height', offsetTop + itemHeight);
        //}
      } else {
        if ($.site.menubar.foldAlt) {
          offsetTop = offsetTop + itemHeight;
        }
        $dropdown.removeClass('site-menu-sub-up');
        $dropdown.css('max-height', menubarHeight - offsetTop);
      }
      //}
    }
  };
})(window, document, jQuery);
