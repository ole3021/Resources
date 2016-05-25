$.components.register("verticalTab", {
  mode: "init",
  init: function(context) {
    if (!$.fn.matchHeight) return;

    $('.nav-tabs-vertical', context).each(function() {
      $(this).children().matchHeight();
    });
  }
});

$.components.register("horizontalTab", {
  mode: "init",
  init: function(context) {
    if (!$.fn.responsiveHorizontalTabs) return;

    $('.nav-tabs-horizontal', context).responsiveHorizontalTabs();
  }
});

$.components.register("navTabsLine", {
  mode: "init",
  defaults: {
    speed: '0.5s, 1s',
    animate: 'cubic-bezier(0.4, 0, 0.2, 1), cubic-bezier(0.4, 0, 0.2, 1)',
    tpl: function() {
      return '<li class="nav-tabs-autoline"></li>';
    }
  },
  init: function(context) {
    var defaults = $.components.getDefaults('navTabsLine');

    $('.nav-tabs-line', context).each(function() {
      var $this = $(this);
      var options = $.extend({}, defaults, $this.data());
      var $parent = $this.parent();
      var $active = $this.find('.active');

      var $autoLineTpl = $(options.tpl()).css({
        "-webkit-transition-duration": options.speed,
        "transition-duration": options.speed,
        "-webkit-transition-timing-function": options.animate,
        "transition-timing-function": options.animate
      });
      $autoLineTpl.appendTo($this);

      var horizontalLine = function($this) {
        var left = $this.position().left;
        var lineWidth = $this.width();

        $autoLineTpl.css({
          "left": left,
          "width": lineWidth
        });
      };

      var verticalLine = function($this) {
        var top = $this.position().top;
        var lineHeight = $this.height();

        $autoLineTpl.css({
          "top": top,
          "height": lineHeight
        });
      };

      var change = function($this) {
        if ($parent.hasClass('nav-tabs-vertical')) {
          verticalLine($this);
        } else {
          horizontalLine($this);
        }
      };

      $this.on('shown.bs.tab', 'a[data-toggle="tab"]', function() {
        change($(this).parent());
      });

      change($active);
    });
  }
});
