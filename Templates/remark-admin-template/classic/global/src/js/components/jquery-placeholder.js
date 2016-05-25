$.components.register("placeholder", {
  mode: "init",
  init: function(context) {
    if (!$.fn.placeholder) return;

    $('input, textarea', context).placeholder();
  }
});
