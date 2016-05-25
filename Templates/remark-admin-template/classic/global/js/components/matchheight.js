/*!
 * remark (http://getbootstrapadmin.com/remark)
 * Copyright 2015 amazingsurge
 * Licensed under the Themeforest Standard Licenses
 */
$.components.register("matchHeight", {
  mode: "init",
  defaults: {},
  init: function(context) {
    if (typeof $.fn.matchHeight === "undefined") return;
    var defaults = $.components.getDefaults('matchHeight');

    $('[data-plugin="matchHeight"]', context).each(function() {
      var $this = $(this),
        options = $.extend(true, {}, defaults, $this.data()),
        matchSelector = $this.data('matchSelector');

      if (matchSelector) {
        $this.find(matchSelector).matchHeight(options);
      } else {
        $this.children().matchHeight(options);
      }

    });
  }
});
