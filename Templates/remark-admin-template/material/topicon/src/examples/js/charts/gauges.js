(function(document, window, $) {
  'use strict';

  var Site = window.Site;

  $(document).ready(function($) {
    Site.run();
  });


  // Example Gauge Dynamic
  // ---------------------
  $(document).ready(function($) {
    var dynamicGauge = $("#exampleDynamicGauge").data('gauge');

    setInterval(function() {
      var random = Math.round(Math.random() * 1000);

      var options = {
        strokeColor: $.colors("primary", 500)
      };
      if (random > 700) {
        options.strokeColor = $.colors("pink", 500);
      } else if (random < 300) {
        options.strokeColor = $.colors("green", 500);
      }

      dynamicGauge.setOptions(options)
        .set(random);
    }, 1500);
  });

  // Example Donut Dynamic
  // ---------------------
  $(document).ready(function($) {
    var dynamicDonut = $("#exampleDynamicDonut").data('donut');

    setInterval(function() {
      var random = Math.round(Math.random() * 1000);

      var options = {
        strokeColor: $.colors("primary", 500)
      };
      if (random > 700) {
        options.strokeColor = $.colors("pink", 500);
      } else if (random < 300) {
        options.strokeColor = $.colors("green", 500);
      }

      dynamicDonut.setOptions(options)
        .set(random);
    }, 1500);
  });

})(document, window, jQuery);
