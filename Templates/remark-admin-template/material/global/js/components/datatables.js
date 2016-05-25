/*!
 * remark (http://getbootstrapadmin.com/remark)
 * Copyright 2015 amazingsurge
 * Licensed under the Themeforest Standard Licenses
 */
$.components.register("dataTable", {
  defaults: {
    responsive: true,
    language: {
      "sSearchPlaceholder": "Search..",
      "lengthMenu": "_MENU_",
      "search": "_INPUT_",
      "paginate": {
        "previous": '<i class="icon md-chevron-left"></i>',
        "next": '<i class="icon md-chevron-right"></i>'
      }
    }
  },
  api: function() {
    if (!$.fn.dataTable) return;

    if ($.fn.dataTable.TableTools) {
      // Set the classes that TableTools uses to something suitable for Bootstrap
      $.extend(true, $.fn.dataTable.TableTools.classes, {
        "container": "DTTT btn-group pull-left",
        "buttons": {
          "normal": "btn btn-default btn-flat",
          "disabled": "disabled"
        },
        "print": {
          "body": "site-print DTTT_Print"
        }
      });
    }
  },
  init: function(context) {
    if (!$.fn.dataTable) return;

    var defaults = $.components.getDefaults("dataTable");

    $('[data-plugin="dataTable"]', context).each(function() {
      var options = $.extend(true, {}, defaults, $(this).data());

      $(this).dataTable(options);
    });
  }
});
