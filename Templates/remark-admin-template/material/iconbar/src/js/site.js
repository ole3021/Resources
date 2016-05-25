(function(window, document, $) {
  'use strict';

  var $body = $(document.body);

  // configs setup
  // =============
  $.configs.set('site', {
    fontFamily: "Noto Sans, sans-serif",
    primaryColor: "indigo",
    assets: "../assets"
  });

  window.Site = $.site.extend({
    run: function(next) {
      // polyfill
      this.polyfillIEWidth();

      // Menubar setup
      // =============
      if (typeof $.site.menu !== 'undefined') {
        $.site.menu.init();
      }

      if (typeof $.site.menubar !== 'undefined') {
        $(".site-menubar").on('changing.site.menubar', function() {
          $('[data-toggle="menubar"]').each(function() {
            var $this = $(this);
            var $hamburger = $(this).find('.hamburger');

            function toggle($el) {
              $el.toggleClass('hided', !$.site.menubar.opened);
              $el.toggleClass('unfolded', !$.site.menubar.folded);
            }
            if ($hamburger.length > 0) {
              toggle($hamburger);
            } else {
              toggle($this);
            }
          });

          $.site.menu.refresh();
        });

        $(document).on('click', '[data-toggle="collapse"]', function(e) {
          var $trigger = $(e.target);
          if (!$trigger.is('[data-toggle="collapse"]')) {
            $trigger = $trigger.parents('[data-toggle="collapse"]');
          }
          var href;
          var target = $trigger.attr('data-target') || (href = $trigger.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '');
          var $target = $(target);
          if ($target.hasClass('navbar-search-overlap')) {
            $target.find('input').focus();

            e.preventDefault();
          } else if ($target.attr('id') === 'site-navbar-collapse') {
            var isOpen = !$trigger.hasClass('collapsed');
            $body.addClass('site-navbar-collapsing');

            $body.toggleClass('site-navbar-collapse-show', isOpen);

            setTimeout(function() {
              $body.removeClass('site-navbar-collapsing');
            }, 350);
          }
        });

        $(document).on('click', '[data-toggle="menubar"]', function() {
          $.site.menubar.toggle();

          return false;
        });

        $.site.menubar.init();

        Breakpoints.on('change', function() {
          $.site.menubar.change();
        });
      }

      // Sidebar setup
      // =============
      if (typeof $.site.sidebar !== 'undefined') {
        $.site.sidebar.init();
      }

      // Tooltip setup
      // =============
      $(document).tooltip({
        selector: '[data-tooltip=true]',
        container: 'body'
      });

      $('[data-toggle="tooltip"]').tooltip();
      $('[data-toggle="popover"]').popover();

      // Fullscreen
      // ==========
      if (typeof screenfull !== 'undefined') {
        $(document).on('click', '[data-toggle="fullscreen"]', function() {
          if (screenfull.enabled) {
            screenfull.toggle();
          }

          return false;
        });

        if (screenfull.enabled) {
          document.addEventListener(screenfull.raw.fullscreenchange, function() {
            $('[data-toggle="fullscreen"]').toggleClass('active', screenfull.isFullscreen);
          });
        }
      }

      // Dropdown menu setup
      // ===================
      $body.on('click', '.dropdown-menu-media', function(e) {
        e.stopPropagation();
      });


      // Page Animate setup
      // ==================
      if (typeof $.animsition !== 'undefined') {
        this.loadAnimate(function() {
          $('.animsition').css({
            "animation-duration": '0s'
          });
          next();
        });
      } else {
        next();
      }

      // Mega navbar setup
      // =================
      $(document).on('click', '.navbar-mega .dropdown-menu', function(e) {
        e.stopPropagation();
      });

      $(document).on('show.bs.dropdown', function(e) {
        var $target = $(e.target);
        var $trigger = e.relatedTarget ? $(e.relatedTarget) : $target.children('[data-toggle="dropdown"]');

        var animation = $trigger.data('animation');
        if (animation) {
          var $menu = $target.children('.dropdown-menu');
          $menu.addClass('animation-' + animation);

          $menu.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
            $menu.removeClass('animation-' + animation);
          });
        }
      });

      $(document).on('shown.bs.dropdown', function(e) {
        var $target = $(e.target);
        var $menu = $target.find('.dropdown-menu-media > .list-group');

        if ($menu.length > 0) {
          var api = $menu.data('asScrollable');
          if (api) {
            api.update();
          } else {
            var defaults = $.components.getDefaults("scrollable");
            $menu.asScrollable(defaults);
          }
        }
      });

      // Page Aside Scrollable
      // =====================

      var pageAsideScroll = $('[data-plugin="pageAsideScroll"]');

      if (pageAsideScroll.length > 0) {
        pageAsideScroll.asScrollable({
          namespace: "scrollable",
          contentSelector: "> [data-role='content']",
          containerSelector: "> [data-role='container']"
        });

        var pageAside = $(".page-aside");
        var scrollable = pageAsideScroll.data('asScrollable');

        if (scrollable) {
          if ($body.is('.page-aside-fixed') || $body.is('.page-aside-scroll')) {
            $(".page-aside").on("transitionend", function() {
              scrollable.update();
            });
          }

          Breakpoints.on('change', function() {
            var current = Breakpoints.current().name;

            if (!$body.is('.page-aside-fixed') && !$body.is('.page-aside-scroll')) {
              if (current === 'xs') {
                scrollable.enable();
                pageAside.on("transitionend", function() {
                  scrollable.update();
                });
              } else {
                pageAside.off("transitionend");
                scrollable.disable();
              }
            }
          });

          $(document).on('click.pageAsideScroll', '.page-aside-switch', function() {
            var isOpen = pageAside.hasClass('open');

            if (isOpen) {
              pageAside.removeClass('open');
            } else {
              scrollable.update();
              pageAside.addClass('open');
            }
          });

          $(document).on('click.pageAsideScroll', '[data-toggle="collapse"]', function(e) {
            var $trigger = $(e.target);
            if (!$trigger.is('[data-toggle="collapse"]')) {
              $trigger = $trigger.parents('[data-toggle="collapse"]');
            }
            var href;
            var target = $trigger.attr('data-target') || (href = $trigger.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '');
            var $target = $(target);

            if ($target.attr('id') === 'site-navbar-collapse') {
              scrollable.update();
            }
          });
        }
      }

      // Page Actions Waves
      // =========================
      if (typeof Waves !== 'undefined') {
        Waves.init();
        Waves.attach('.site-menu-item > a', ['waves-classic']);
        Waves.attach(".site-navbar .navbar-toolbar [data-toggle='menubar']", ["waves-light", "waves-round"]);
        Waves.attach(".page-header-actions .btn:not(.btn-inverse)", ["waves-light", "waves-round"]);
        Waves.attach(".page-header-actions .btn-inverse", ["waves-classic", "waves-round"]);
        Waves.attach('.page > div:not(.page-header) .btn:not(.ladda-button):not(.btn-round):not(.btn-pure):not(.btn-floating):not(.btn-flat)', ['waves-light']);
        Waves.attach('.page > div:not(.page-header) .btn-pure:not(.ladda-button):not(.btn-round):not(.btn-floating):not(.btn-flat):not(.icon)', ['waves-classic']);
      }

      // Init Loaded Components
      // ======================
      $.components.init();

      this.startTour();
    },

    polyfillIEWidth: function() {
      if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
        var msViewportStyle = document.createElement('style');
        msViewportStyle.appendChild(
          document.createTextNode(
            '@-ms-viewport{width:auto!important}'
          )
        );
        document.querySelector('head').appendChild(msViewportStyle);
      }
    },

    loadAnimate: function(callback) {
      return $.components.call("animsition", document, callback);
    },

    startTour: function(flag) {
      if (typeof this.tour === 'undefined') {
        if (typeof introJs === 'undefined') {
          return;
        }

        var tourOptions = $.configs.get('tour'),
          self = this;
        flag = $('body').css('overflow');
        this.tour = introJs();

        this.tour.onbeforechange(function() {
          $('body').css('overflow', 'hidden');
        });

        this.tour.oncomplete(function() {
          $('body').css('overflow', flag);
        });

        this.tour.onexit(function() {
          $('body').css('overflow', flag);
        });

        this.tour.setOptions(tourOptions);
        $('.site-tour-trigger').on('click', function() {
          self.tour.start();
        });
      }
      // if (window.localStorage && window.localStorage.getItem('startTour') && (flag !== true)) {
      //   return;
      // } else {
      //   this.tour.start();
      //   window.localStorage.setItem('startTour', true);
      // }
    }
  });

})(window, document, jQuery);
