$.components.register("bootbox", {
  mode: "api",
  defaults: {
    message: ""
  },
  api: function() {
    if (typeof bootbox === "undefined") return;
    var defaults = $.components.getDefaults("bootbox");

    $(document).on('click.site.bootbox', '[data-plugin="bootbox"]', function() {
      var $btn = $(this);
      var options = $btn.data();

      options = $.extend(true, {}, defaults, options);
      if (options.classname) {
        options.className = options.classname;
      }

      if (typeof options.callback === "string" && $.isFunction(window[options.callback])) {
        options.callback = window[options.callback];
      }

      if (options.type) {
        switch (options.type) {
          case "alert":
            bootbox.alert(options);
            break;
          case "confirm":
            bootbox.confirm(options);
            break;
          case "prompt":
            bootbox.prompt(options);
            break;
          default:
            bootbox.dialog(options);
        }
      } else {
        bootbox.dialog(options);
      }
    });
  }
});
