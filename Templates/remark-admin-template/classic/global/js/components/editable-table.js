/*!
 * remark (http://getbootstrapadmin.com/remark)
 * Copyright 2015 amazingsurge
 * Licensed under the Themeforest Standard Licenses
 */
$.components.register("editableTable", {
  mode: "init",
  init: function(context) {
    if (!$.fn.editableTableWidget) return;

    var defaults = $.components.getDefaults("editableTable");

    $('[data-plugin="editableTable"]', context).each(function() {
      var options = $.extend(true, {}, defaults, $(this).data());

      $(this).editableTableWidget(options);
    });
  }
});
