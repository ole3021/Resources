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

  Chart.defaults.global.responsive = true;


  // Example Chartjs Line
  // --------------------
  (function() {
    var lineChartData = {
      labels: ["January", "February", "March", "April", "May", "June", "July"],
      scaleShowGridLines: true,
      scaleShowVerticalLines: false,
      scaleGridLineColor: "#ebedf0",
      datasets: [{
        fillColor: "rgba(204, 213, 219, .1)",
        strokeColor: $.colors("grey", 400),
        pointColor: $.colors("grey", 400),
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: $.colors("grey", 400),
        data: [65, 59, 80, 81, 56, 55, 40]
      }, {
        fillColor: "rgba(98, 168, 234, .1)",
        strokeColor: $.colors("primary", 600),
        pointColor: $.colors("primary", 600),
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: $.colors("primary", 600),
        data: [28, 48, 40, 19, 86, 27, 90]
      }]
    };

    var myLine = new Chart(document.getElementById("exampleChartjsLine").getContext("2d")).Line(lineChartData);
  })();


  // Example Chartjs Bar
  // --------------------
  (function() {
    var barChartData = {
      labels: ["January", "February", "March", "April", "May"],
      scaleShowGridLines: true,
      scaleShowVerticalLines: false,
      scaleGridLineColor: "#ebedf0",
      barShowStroke: false,
      datasets: [{
        fillColor: $.colors("blue", 500),
        strokeColor: $.colors("blue", 500),
        highlightFill: $.colors("blue", 500),
        highlightStroke: $.colors("blue", 500),
        data: [65, 45, 75, 50, 60]
      }, {
        fillColor: $.colors("grey", 400),
        strokeColor: $.colors("grey", 400),
        highlightFill: $.colors("grey", 400),
        highlightStroke: $.colors("grey", 400),
        data: [30, 20, 40, 25, 45]
      }]
    };

    var myBar = new Chart(document.getElementById("exampleChartjsBar").getContext("2d")).Bar(barChartData);
  })();


  // Example Chartjs Radar
  // --------------------
  (function() {
    var radarChartData = {
      labels: ["Eating", "Drinking", "Sleeping", "Designing", "Coding", "Partying", "Running"],
      pointLabelFontSize: 14,
      datasets: [{
        fillColor: "rgba(204,213,219,0.35)",
        strokeColor: "rgba(0,0,0,0)",
        pointColor: $.colors("grey", 400),
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: $.colors("grey", 400),
        data: [65, 59, 90, 81, 56, 55, 40]
      }, {
        fillColor: "rgba(250,122,122,0.25)",
        strokeColor: "rgba(0,0,0,0)",
        pointColor: $.colors("red", 500),
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: $.colors("red", 500),
        data: [28, 48, 40, 19, 96, 27, 100]
      }]
    };

    var myRadar = new Chart(document.getElementById("exampleChartjsRadar").getContext("2d")).Radar(radarChartData, {
      scaleShowLabels: false,
      pointLabelFontSize: 10
    });
  })();


  // Example Chartjs Ploar Area
  // --------------------------
  (function() {
    var chartData = [{
      value: 300,
      color: $.colors("red", 600),
      label: "Red"

    }, {
      value: 200,
      color: $.colors("primary", 500),
      label: "Blue"
    }, {
      value: 100,
      color: $.colors("grey", 300),
      label: "Grey"
    }, {
      value: 50,
      color: $.colors("grey", 400),
      label: "Dark Grey"
    }];

    var myPolarArea = new Chart(document.getElementById("exampleChartjsPloarArea").getContext("2d")).PolarArea(chartData);
  })();


  // Example Chartjs Pie
  // -------------------
  (function() {
    var pieData = [{
      value: 50,
      color: $.colors("primary", 500),
      label: "Blue"
    }, {
      value: 50,
      color: $.colors("grey", 300),
      label: "Grey"
    }];

    var myPie = new Chart(document.getElementById("exampleChartjsPie").getContext("2d")).Pie(pieData);
  })();


  // Example Chartjs Donut
  // ---------------------
  (function() {
    var doughnutData = [{
      value: 45,
      color: $.colors("red", 500),
      label: "Red"
    }, {
      value: 15,
      color: $.colors("grey", 300),
      label: "Grey"
    }, {
      value: 60,
      color: $.colors("primary", 500),
      label: "Blue"
    }];

    var myDoughnut = new Chart(document.getElementById("exampleChartjsDonut").getContext("2d")).Doughnut(doughnutData);
  })();

})(document, window, jQuery);
