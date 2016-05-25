(function(document, window, $) {
  'use strict';

  window.AppForum = App.extend({
    run: function(next) {
      next();
    }
  });

  $(document).ready(function() {
    AppForum.run();
  });
})(document, window, jQuery);
