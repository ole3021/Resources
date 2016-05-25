/*!
 * remark (http://getbootstrapadmin.com/remark)
 * Copyright 2015 amazingsurge
 * Licensed under the Themeforest Standard Licenses
 */
$.components.register("animsition", {
  mode: "manual",
  defaults: {
    inClass: 'fade-in',
    outClass: 'fade-out',
    inDuration: 800,
    outDuration: 500,
    linkElement: '.animsition-link',
    loading: true,
    loadingParentElement: "body",
    loadingClass: "loader",
    loadingType: "default",
    timeout: false,
    timeoutCountdown: 5000,
    onLoadEvent: true,
    browser: ['animation-duration', '-webkit-animation-duration'],
    overlay: false,
    // random: true,
    overlayClass: 'animsition-overlay-slide',
    overlayParentElement: "body",

    inDefaults: [
      'fade-in',
      'fade-in-up-sm', 'fade-in-up', 'fade-in-up-lg',
      'fade-in-down-sm', 'fade-in-down', 'fade-in-down-lg',
      'fade-in-left-sm', 'fade-in-left', 'fade-in-left-lg',
      'fade-in-right-sm', 'fade-in-right', 'fade-in-right-lg',
      // 'overlay-slide-in-top', 'overlay-slide-in-bottom', 'overlay-slide-in-left', 'overlay-slide-in-right',
      'zoom-in-sm', 'zoom-in', 'zoom-in-lg'
    ],
    outDefaults: [
      'fade-out',
      'fade-out-up-sm', 'fade-out-up', 'fade-out-up-lg',
      'fade-out-down-sm', 'fade-out-down', 'fade-out-down-lg',
      'fade-out-left-sm', 'fade-out-left', 'fade-out-left-lg',
      'fade-out-right-sm', 'fade-out-right', 'fade-out-right-lg',
      // 'overlay-slide-out-top', 'overlay-slide-out-bottom', 'overlay-slide-out-left', 'overlay-slide-out-right'
      'zoom-out-sm', 'zoom-out', 'zoom-out-lg'
    ]
  },
  init: function(context, callback) {
    var options = $.components.getDefaults("animsition");

    if (options.random) {
      var li = options.inDefaults.length,
        lo = options.outDefaults.length;

      var ni = parseInt(li * Math.random(), 0),
        no = parseInt(lo * Math.random(), 0);

      options.inClass = options.inDefaults[ni];
      options.outClass = options.outDefaults[no];
    }

    var $this = $(".animsition", context);

    $this.animsition(options);

    $("." + options.loadingClass).addClass('loader-' + options.loadingType);

    if ($this.animsition('supportCheck', options)) {
      if ($.isFunction(callback)) {
        $this.one('animsition.end', function() {
          callback.call();
        });
      }

      return true;
    } else {
      if ($.isFunction(callback)) {
        callback.call();
      }
      return false;
    }
  }
});
