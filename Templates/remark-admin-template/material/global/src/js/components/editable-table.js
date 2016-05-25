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
