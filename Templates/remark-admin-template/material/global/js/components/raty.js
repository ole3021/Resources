/*!
 * remark (http://getbootstrapadmin.com/remark)
 * Copyright 2015 amazingsurge
 * Licensed under the Themeforest Standard Licenses
 */
$.components.register("rating", {
  mode: "init",
  defaults: {
    targetKeep: true,
    icon: "font",
    starType: "i",
    starOff: "icon md-star",
    starOn: "icon md-star orange-600",
    cancelOff: "icon md-minus-circle",
    cancelOn: "icon md-minus-circle orange-600",
    starHalf: "icon md-star-half orange-500"
  },
  init: function(context) {
    if (!$.fn.raty) return;

    var defaults = $.components.getDefaults("rating");

    $('[data-plugin="rating"]', context).each(function() {
      var $this = $(this);
      var options = $.extend(true, {}, defaults, $this.data());

      if (options.hints) {
        options.hints = options.hints.split(',');
      }

      $this.raty(options);
    });
  }
});
