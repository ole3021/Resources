(function(document, window, $) {
  'use strict';

  var Site = window.Site;

  $(document).ready(function($) {
    Site.extend({
      run: function() {
        $('#icon_change').asRange({
          tip: false,
          scale: false,
          onChange: function(value) {
            $('#icon_size').text(value + "px");
            $('.panel .icon').css('font-size', value);
          }
        });
        $('.input-search input[type=text]').on('keyup', function() {
          var val = $(this).val();
          console.log(val);
          if (val !== '') {
            $('[data-name]').addClass('is-hide');
            $('[data-name*=' + val + ']').removeClass('is-hide');
          } else {
            $('[data-name]').removeClass('is-hide');
          }

          $('.icon-group').each(function() {
            var $group = $(this);
            if ($group.find('[data-name]:not(.is-hide)').length === 0) {
              $group.hide();
            } else {
              $group.show();
            }
          });

        });
      }
    }).run();

  });
})(document, window, jQuery);
