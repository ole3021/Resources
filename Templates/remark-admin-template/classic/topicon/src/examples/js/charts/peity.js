(function(document, window, $) {
  'use strict';

  var Site = window.Site;

  $(document).ready(function($) {
    Site.run();
  });

  // Example Peity Default
  // ---------------------
  (function() {
    /* dynamic example */
    var dynamicChart = $("#examplePeityDynamic").peity("line", {
      width: 64,
      fill: [$.colors("primary", 200)],
      stroke: $.colors("primary", 500),
      height: 22
    });

    setInterval(function() {
      var random = Math.round(Math.random() * 10);
      var values = dynamicChart.text().split(",");
      values.shift();
      values.push(random);

      dynamicChart
        .text(values.join(","))
        .change();
    }, 1000);
  })();


  // Example Peity Red
  // -------------------
  (function() {
    /* dynamic example */
    var dynamicRedChart = $("#examplePeityDynamicRed").peity("line", {
      width: 64,
      fill: [$.colors("red", 200)],
      stroke: $.colors("red", 500),
      height: 22
    });

    setInterval(function() {
      var random = Math.round(Math.random() * 10);
      var values = dynamicRedChart.text().split(",");
      values.shift();
      values.push(random);

      dynamicRedChart
        .text(values.join(","))
        .change();
    }, 1000);
  })();


  // Example Peity Green
  // -------------------
  (function() {
    /* dynamic example */
    var dynamicGreenChart = $("#examplePeityDynamicGreen").peity("line", {
      width: 64,
      fill: [$.colors("green", 200)],
      stroke: $.colors("green", 500),
      height: 22
    });

    setInterval(function() {
      var random = Math.round(Math.random() * 10);
      var values = dynamicGreenChart.text().split(",");
      values.shift();
      values.push(random);

      dynamicGreenChart
        .text(values.join(","))
        .change();
    }, 1000);
  })();


  // Example Peity Orange
  // --------------------
  (function() {
    /* dynamic example */
    var dynamicOrangeChart = $("#examplePeityDynamicOrange").peity("line", {
      width: 64,
      fill: [$.colors("orange", 200)],
      stroke: $.colors("orange", 500),
      height: 22
    });

    setInterval(function() {
      var random = Math.round(Math.random() * 10);
      var values = dynamicOrangeChart.text().split(",");
      values.shift();
      values.push(random);

      dynamicOrangeChart
        .text(values.join(","))
        .change();
    }, 1000);
  })();

})(document, window, jQuery);
