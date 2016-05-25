/*!
 * remark (http://getbootstrapadmin.com/remark)
 * Copyright 2015 amazingsurge
 * Licensed under the Themeforest Standard Licenses
 */
(function(document, window, $) {
  'use strict';

  var Site = window.Site;

  $(document).ready(function($) {
    Site.run();
  });

  // Example Button Random
  // ---------------------
  (function() {
    $('#exampleButtonRandom').on('click', function(e) {
      e.preventDefault();

      $('[data-plugin="progress"]').each(function() {
        var number = Math.round(Math.random(1) * 100) + '%';
        $(this).asProgress('go', number);
      });
    });
  })();


  // Example Panel With Tool
  // -----------------------
  window.customRefreshCallback = function(done) {
    var $panel = $(this);
    setTimeout(function() {
      done();
      $panel.find('.panel-body').html('Lorem ipsum In nostrud Excepteur velit reprehenderit quis consequat veniam officia nisi labore in est.');
    }, 1000);
  };

})(document, window, jQuery);
