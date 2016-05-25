/*!
 * remark (http://getbootstrapadmin.com/remark)
 * Copyright 2015 amazingsurge
 * Licensed under the Themeforest Standard Licenses
 */
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
