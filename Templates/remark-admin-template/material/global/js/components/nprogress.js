/*!
 * remark (http://getbootstrapadmin.com/remark)
 * Copyright 2015 amazingsurge
 * Licensed under the Themeforest Standard Licenses
 */
$.components.register("nprogress", {
  mode: "init",
  defaults: {
    minimum: 0.15,
    trickleRate: .07,
    trickleSpeed: 360,
    showSpinner: false,
    template: '<div class="bar" role="bar"></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
  },
  init: function() {
    if (typeof NProgress === "undefined") return;
    var defaults = $.components.getDefaults('nprogress');
    NProgress.configure(defaults);
  }
});
