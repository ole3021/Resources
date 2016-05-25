$.components.register("slidePanel", {
  mode: "manual",
  defaults: {
    closeSelector: '.slidePanel-close',
    mouseDragHandler: '.slidePanel-handler',
    loading: {
      template: function(options) {
        return '<div class="' + options.classes.loading + '">' +
          '<div class="loader loader-default"></div>' +
          '</div>';
      },
      showCallback: function(options) {
        this.$el.addClass(options.classes.loading + '-show');
      },
      hideCallback: function(options) {
        this.$el.removeClass(options.classes.loading + '-show');
      }
    }
  }
});
