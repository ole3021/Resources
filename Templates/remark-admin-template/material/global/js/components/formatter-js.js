/*!
 * remark (http://getbootstrapadmin.com/remark)
 * Copyright 2015 amazingsurge
 * Licensed under the Themeforest Standard Licenses
 */
$.components.register("formatter", {
  mode: "init",
  defaults: {
    persistent: true
  },

  init: function(context) {
    if (!$.fn.formatter) return;

    var defaults = $.components.getDefaults("formatter"),
      browserName = navigator.userAgent.toLowerCase(),
      ieOptions;

    if (/msie/i.test(browserName) && !/opera/.test(browserName)) {
      ieOptions = {
        persistent: false
      };
    } else {
      ieOptions = {};
    }

    $('[data-plugin="formatter"]', context).each(function() {

      var options = $.extend({}, defaults, ieOptions, $(this).data());
      if (options.pattern) {
        options.pattern = options.pattern.replace(/\[\[/g, '{{').replace(/\]\]/g, '}}');
      }
      $(this).formatter(options);
    });
  }
});
