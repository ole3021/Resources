(function(document, window, $) {
  'use strict';

  var Site = window.Site;

  $(document).ready(function($) {
    Site.run();

    Waves.attach('.list-group > a:not(.disabled)', ['waves-block', 'waves-classic']);
  });

})(document, window, jQuery);
