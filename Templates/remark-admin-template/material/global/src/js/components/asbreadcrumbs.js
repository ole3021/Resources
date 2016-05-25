$.components.register("breadcrumb", {
  mode: "init",
  defaults: {
    namespace: "breadcrumb"
  },
  init: function(context) {
    if (!$.fn.asBreadcrumbs) return;
    var defaults = $.components.getDefaults("breadcrumb");

    $('[data-plugin="breadcrumb"]', context).each(function() {
      var options = $.extend({}, defaults, $(this).data());

      $(this).asBreadcrumbs(options);
    });
  }
});
