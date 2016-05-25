$.components.register("matchHeight", {
  mode: "init",
  defaults: {},
  init: function(context) {
    if (typeof $.fn.matchHeight === "undefined") return;
    var defaults = $.components.getDefaults('matchHeight');

    $('[data-plugin="matchHeight"]', context).each(function() {
      var $this = $(this),
        options = $.extend(true, {}, defaults, $this.data()),
        matchSelector = $this.data('matchSelector');

      if (matchSelector) {
        $this.find(matchSelector).matchHeight(options);
      } else {
        $this.children().matchHeight(options);
      }

    });
  }
});
