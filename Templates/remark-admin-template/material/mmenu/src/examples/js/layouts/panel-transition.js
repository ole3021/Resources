(function(document, window, $) {
  'use strict';

  var Site = window.Site;

  $(document).ready(function($) {
    Site.run();

    var $example = $('#exampleTransition');

    $(document).on('click.panel.transition', '[data-type]', function() {
      var type = $(this).data('type');

      $example.data('animateList').run(type);
    });
  });

})(document, window, jQuery);
