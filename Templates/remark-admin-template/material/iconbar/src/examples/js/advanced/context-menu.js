(function(document, window, $) {
  'use strict';

  var Site = window.Site;

  $(document).ready(function($) {
    Site.run();
  });


  // Demo 2
  // ------
  (function() {
    $('#exampleContext').contextmenu({
      target: '#exampleContextMenu',
      before: function(e) {
        // This function is optional.
        // Here we use it to stop the event if the user clicks a span
        e.preventDefault();
        if (e.target.tagName == 'SPAN') {
          e.preventDefault();
          this.closemenu();
          return false;
        }
        this.getMenu().find("li").eq(4).find('a').html("This was dynamically changed");
        return true;
      }
    });
  })();


  // Demo 3
  // ------
  (function() {
    $('#exampleContext2').contextmenu({
      target: '#exampleContextMenu',
      onItem: function(context, e) {
        alert($.trim($(e.target).text()));
      }
    });

    $('#exampleContextMenu').on('show.bs.context', function(e) {
      console.log('before show event');
    });

    $('#exampleContextMenu').on('shown.bs.context', function(e) {
      console.log('after show event');
    });

    $('#exampleContextMenu').on('hide.bs.context', function(e) {
      console.log('before hide event');
    });

    $('#exampleContextMenu').on('hidden.bs.context', function(e) {
      console.log('after hide event');
    });
  })();


})(document, window, jQuery);
