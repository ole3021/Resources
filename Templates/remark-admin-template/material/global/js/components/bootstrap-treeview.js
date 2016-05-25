/*!
 * remark (http://getbootstrapadmin.com/remark)
 * Copyright 2015 amazingsurge
 * Licensed under the Themeforest Standard Licenses
 */
$.components.register("treeview", {
  mode: "init",
  defaults: {
    injectStyle: false,
    expandIcon: "icon md-plus",
    collapseIcon: "icon md-minus",
    emptyIcon: "icon",
    nodeIcon: "icon md-folder",
    showBorder: false,
    // color: undefined, // "#000000",
    // backColor: undefined, // "#FFFFFF",
    borderColor: $.colors("grey", 300),
    onhoverColor: $.colors("grey", 200),
    selectedColor: "#ffffff",
    selectedBackColor: $.colors("primary", 600),

    searchResultColor: $.colors("primary", 600),
    searchResultBackColor: "#ffffff"
  },
  init: function(context) {
    if (!$.fn.treeview) return;

    var defaults = $.components.getDefaults("treeview");

    $('[data-plugin="treeview"]', context).each(function() {
      var $this = $(this);
      var options = $this.data();
      if (typeof options.source === "string" && $.isFunction(window[options.source])) {
        options.data = window[options.source]();
        delete options.source;
      } else if ($.isFunction(options.souce)) {
        options.data = options.source();
        delete options.source;
      }

      options = $.extend(true, {}, defaults, options);
      $this.treeview(options);
    });
  }
});
