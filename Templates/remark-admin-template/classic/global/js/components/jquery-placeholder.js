/*!
 * remark (http://getbootstrapadmin.com/remark)
 * Copyright 2015 amazingsurge
 * Licensed under the Themeforest Standard Licenses
 */
$.components.register("placeholder", {
  mode: "init",
  init: function(context) {
    if (!$.fn.placeholder) return;

    $('input, textarea', context).placeholder();
  }
});
