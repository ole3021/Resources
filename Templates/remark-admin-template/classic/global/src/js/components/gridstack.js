$.components.register("gridstack", {
  mode: "init",
  defaults: {
    cell_height: 80,
    vertical_margin: 20
  },
  init: function(context) {
    if (!$.fn.gridstack) return;

    var defaults = $.components.getDefaults("gridstack");

    $('[data-plugin="gridstack"]', context).each(function() {
      var options = $.extend(true, {}, defaults, $(this).data());

      $(this).gridstack(options);
    });
  }
});
