$.components.register("rating", {
  mode: "init",
  defaults: {
    targetKeep: true,
    icon: "font",
    starType: "i",
    starOff: "icon wb-star",
    starOn: "icon wb-star orange-600",
    cancelOff: "icon wb-minus-circle",
    cancelOn: "icon wb-minus-circle orange-600",
    starHalf: "icon wb-star-half orange-500"
  },
  init: function(context) {
    if (!$.fn.raty) return;

    var defaults = $.components.getDefaults("rating");

    $('[data-plugin="rating"]', context).each(function() {
      var $this = $(this);
      var options = $.extend(true, {}, defaults, $this.data());

      if (options.hints) {
        options.hints = options.hints.split(',');
      }

      $this.raty(options);
    });
  }
});
