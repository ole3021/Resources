/*!
 * remark (http://getbootstrapadmin.com/remark)
 * Copyright 2015 amazingsurge
 * Licensed under the Themeforest Standard Licenses
 */
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
