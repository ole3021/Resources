/*!
 * remark (http://getbootstrapadmin.com/remark)
 * Copyright 2015 amazingsurge
 * Licensed under the Themeforest Standard Licenses
 */
(function(window, document, $) {
  'use strict';

  $.site.sidebar = {
    init: function() {
      if (typeof $.slidePanel === 'undefined') return;

      $(document).on('click', '[data-toggle="site-sidebar"]', function() {
        var $this = $(this);

        var direction = 'right';
        if ($('body').hasClass('site-menubar-flipped')) {
          direction = 'left';
        }

        var defaults = $.components.getDefaults("slidePanel");
        var options = $.extend({}, defaults, {
          direction: direction,
          skin: 'site-sidebar',
          dragTolerance: 80,
          template: function(options) {
            return '<div class="' + options.classes.base + ' ' + options.classes.base + '-' + options.direction + '">' +
              '<div class="' + options.classes.content + ' site-sidebar-content"></div>' +
              '<div class="slidePanel-handler"></div>' +
              '</div>';
          },
          afterLoad: function() {
            var self = this;
            this.$panel.find('.tab-pane').asScrollable({
              namespace: 'scrollable',
              contentSelector: "> div",
              containerSelector: "> div"
            });

            $.components.init('switchery', self.$panel);

            this.$panel.on('shown.bs.tab', function() {
              self.$panel.find(".tab-pane.active").asScrollable('update');
            });
          },
          beforeShow: function() {
            if (!$this.hasClass('active')) {
              $this.addClass('active');
            }
          },
          afterHide: function() {
            if ($this.hasClass('active')) {
              $this.removeClass('active');
            }
          }
        });

        if ($this.hasClass('active')) {
          $.slidePanel.hide();
        } else {
          var url = $this.data('url');
          if (!url) {
            url = $this.attr('href');
            url = url && url.replace(/.*(?=#[^\s]*$)/, '');
          }

          $.slidePanel.show({
            url: url
          }, options);
        }
      });

      $(document).on('click', '[data-toggle="show-chat"]', function() {
        $('#conversation').addClass('active');
      });


      $(document).on('click', '[data-toggle="close-chat"]', function() {
        $('#conversation').removeClass('active');
      });
    }
  };

})(window, document, jQuery);
