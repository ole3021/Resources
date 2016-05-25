$.components.register("highlight", {
  mode: "init",
  defaults: {

  },
  init: function(context) {
    if (typeof $.fn.hightlight === "undefined") return;
    var defaults = $.components.getDefaults('highlight');

    // hljs.configure({useBR: true});

    $('[data-plugin="highlight"]', context).each(function(i, block) {
      hljs.highlightBlock(block);
    });
  }
});
