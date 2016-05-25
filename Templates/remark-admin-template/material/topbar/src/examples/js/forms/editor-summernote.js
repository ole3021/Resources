(function(document, window, $) {
  'use strict';

  var Site = window.Site;

  $(document).ready(function($) {
    Site.run();
  });

  window.edit = function() {
    $('.click2edit').summernote();
  };
  window.save = function() {
    $('.click2edit').destroy();
  };
})(document, window, jQuery);
