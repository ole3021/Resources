/*!
 * remark (http://getbootstrapadmin.com/remark)
 * Copyright 2015 amazingsurge
 * Licensed under the Themeforest Standard Licenses
 */
$.components.register("sweetalert", {
  mode: "api",
  api: function() {
    if (typeof swal === "undefined") return;

    var defaults = $.components.getDefaults("sweetalert");

    $(document).on('click.site.sweetalert', '[data-plugin="sweetalert"]', function() {
      var options = $.extend(true, {}, defaults, $(this).data());

      swal(options);
    });
  }
});
