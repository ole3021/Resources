$.components.register("selectable", {
  mode: "init",
  defaults: {
    allSelector: '.selectable-all',
    itemSelector: '.selectable-item',
    rowSelector: 'tr',
    rowSelectable: false,
    rowActiveClass: 'active',
    onChange: null
  },
  init: function(context) {
    if (!$.fn.asSelectable) return;
    var defaults = $.components.getDefaults('selectable');

    $('[data-plugin="selectable"], [data-selectable="selectable"]', context).each(function() {
      var options = $.extend({}, defaults, $(this).data());
      $(this).asSelectable(options);
    });
  }
});
