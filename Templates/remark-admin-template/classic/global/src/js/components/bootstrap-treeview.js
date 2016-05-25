$.components.register("treeview", {
  mode: "init",
  defaults: {
    injectStyle: false,
    expandIcon: "icon wb-plus",
    collapseIcon: "icon wb-minus",
    emptyIcon: "icon",
    nodeIcon: "icon wb-folder",
    showBorder: false,
    // color: undefined, // "#000000",
    // backColor: undefined, // "#FFFFFF",
    borderColor: $.colors("blue-grey", 200),
    onhoverColor: $.colors("blue-grey", 100),
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
