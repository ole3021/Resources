$.components.register("floatThead", {
  mode: "default",
  defaults: {
    top: function() {
      return $('.site-navbar').outerHeight();
    },
    position: 'absolute'
  }
});
