/*!
 * remark (http://getbootstrapadmin.com/remark)
 * Copyright 2015 amazingsurge
 * Licensed under the Themeforest Standard Licenses
 */
$.components.register("isotope", {
  mode: "init",
  defaults: {},
  init: function(context) {
    if (typeof $.fn.isotope === "undefined") return;
    var defaults = $.components.getDefaults('isotope');

    var callback = function() {
      $('[data-plugin="isotope"]', context).each(function() {
        var $this = $(this),
          options = $.extend(true, {}, defaults, $this.data());

        $this.isotope(options);
      });
    }
    if (context !== document) {
      callback();
    } else {
      $(window).on('load', function() {
        callback();
      });
    }
  }
});
