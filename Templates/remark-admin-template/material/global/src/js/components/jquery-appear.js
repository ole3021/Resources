$.components.register("appear", {
  defaults: {},
  api: function(context) {
    if (!$.fn.appear) return;

    $(document).on("appear", '[data-plugin="appear"]', function() {
      var $item = $(this),
        animate = $item.data("animate");

      if ($item.hasClass('appear-no-repeat')) return;
      $item.removeClass("invisible").addClass('animation-' + animate);

      if ($item.data("repeat") === false) {
        $item.addClass('appear-no-repeat');
      }
    });

    $(document).on("disappear", '[data-plugin="appear"]', function() {
      var $item = $(this),
        animate = $item.data("animate");

      if ($item.hasClass('appear-no-repeat')) return;

      $item.addClass("invisible").removeClass('animation-' + animate);
    });
  },

  init: function(context) {
    if (!$.fn.appear) return;

    var defaults = $.components.getDefaults("appear");

    $('[data-plugin="appear"]', context).appear(defaults);
    $('[data-plugin="appear"]', context).not(':appeared').addClass("invisible");
  }
});
