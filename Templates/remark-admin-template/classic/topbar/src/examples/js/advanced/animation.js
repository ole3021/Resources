(function(document, window, $) {
  'use strict';

  var Site = window.Site;

  $(document).ready(function($) {
    Site.run();

    $(document).on('click', '.select-loader', function(e) {
      var type = $(this).data('type'),
        curr = $('.example-loading .loader').data('type');

      if (type === curr) return;
      $('.example-loading .loader').removeClass('loader-' + curr).addClass('loader-' + type).data('type', type);

    });

    // Example NProgress
    // -----------------
    (function() {
      // Start Progress Loader
      // NProgress.start();

      // On click event gather options and Init NProgress Plugin
      $(document).on('click', '.btn', function(e) {
        var $target = $(e.target);
        var id = $target.attr('id');

        switch (id) {
          // Loader Example Increments
          case 'exampleNProgressStart':
            NProgress.start();
            break;
          case 'exampleNProgressSet':
            NProgress.set(0.50);
            break;
          case 'exampleNProgressInc':
            NProgress.inc();
            break;
          case 'exampleNProgressDone':
            NProgress.done(true);
            break;

            // Loader Positions
          case 'exampleNProgressDefault':
            // ReConfigure Progress Loader
            NProgress.done(true);
            NProgress.configure({
              template: '<div class="bar" role="bar"></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
            });
            NProgress.start();
            break;
          case 'exampleNProgressHeader':
            // ReConfigure Progress Loader
            NProgress.done(true);
            NProgress.configure({
              template: '<div class="bar nprogress-bar-header" role="bar"></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
            });
            NProgress.start();
            break;
          case 'exampleNProgressBottom':
            // ReConfigure Progress Loader
            NProgress.done(true);
            NProgress.configure({
              template: '<div class="bar nprogress-bar-bottom" role="bar"></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
            });
            NProgress.start();
            break;

            // Loader Contextuals
          case 'exampleNProgressPrimary':
            // ReConfigure Progress Loader
            NProgress.done(true);
            NProgress.configure({
              template: '<div class="bar nprogress-bar-primary" role="bar"></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
            });
            NProgress.start();
            break;
          case 'exampleNProgressSuccess':
            // ReConfigure Progress Loader
            NProgress.done(true);
            NProgress.configure({
              template: '<div class="bar nprogress-bar-success" role="bar"></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
            });
            NProgress.start();
            break;
          case 'exampleNProgressInfo':
            // ReConfigure Progress Loader
            NProgress.done(true);
            NProgress.configure({
              template: '<div class="bar nprogress-bar-info" role="bar"></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
            });
            NProgress.start();
            break;
          case 'exampleNProgressWarning':
            // ReConfigure Progress Loader
            NProgress.done(true);
            NProgress.configure({
              template: '<div class="bar nprogress-bar-warning" role="bar"></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
            });
            NProgress.start();
            break;
          case 'exampleNProgressDanger':
            // ReConfigure Progress Loader
            NProgress.done(true);
            NProgress.configure({
              template: '<div class="bar nprogress-bar-danger" role="bar"></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
            });
            NProgress.start();
            break;
          case 'exampleNProgressDark':
            // ReConfigure Progress Loader
            NProgress.done(true);
            NProgress.configure({
              template: '<div class="bar nprogress-bar-dark" role="bar"></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
            });
            NProgress.start();
            break;
          case 'exampleNProgressLight':
            // ReConfigure Progress Loader
            NProgress.done(true);
            NProgress.configure({
              template: '<div class="bar nprogress-bar-light" role="bar"></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
            });
            NProgress.start();
            break;
        }
      });
    })();
  });

})(document, window, jQuery);
