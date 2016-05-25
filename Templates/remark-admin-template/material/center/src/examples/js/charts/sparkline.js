(function(document, window, $) {
  'use strict';

  var Site = window.Site;

  $(document).ready(function($) {
    Site.run();
  });

  // Sparkline Basic
  // ---------------
  // Pie Chart
  $(".sparkline-pie-chart").sparkline([4, 2, 6], {
    type: 'pie',
    height: '162px',
    sliceColors: [$.colors("primary", 500), $.colors("primary", 700), $.colors("primary", 600)]
  });

  // line chart
  $(".sparkline-line-chart").sparkline([1, 3, 4, 2, 3, 6, 5, 3], {
    type: 'line',
    height: '162px',
    width: '200px',
    normalRangeMin: 0,
    spotRadius: 2,
    spotColor: $.colors("red", 600),
    highlightSpotColor: $.colors("red", 700),
    lineColor: $.colors("red", 500),
    highlightLineColor: $.colors("red", 500),
    fillColor: $.colors("red", 100)
  });

  // bar chart
  $(".sparkline-bar-chart").sparkline([4, 7, 3, 2, 5, 6, 8, 5, 4, 8], {
    type: 'bar',
    height: '162px',
    barWidth: 10,
    barSpacing: 6,
    barColor: $.colors("primary", 500),
    negBarColor: $.colors("primary", 600)
  });

  // composite bar chart
  $('.sparkline-compositebar-chart').sparkline('html', {
    type: 'bar',
    height: '162px',
    barWidth: 10,
    barSpacing: 5,
    barColor: $.colors("grey", 400)
  });

  $('.sparkline-compositebar-chart').sparkline([4, 5, 6, 6, 5, 5, 3, 6, 4, 2], {
    composite: true,
    fillColor: false,
    lineColor: $.colors("purple", 400)
  });

  $('.sparkline-compositebar-chart').sparkline([1, 4, 5, 2, 3, 5, 6, 1, 3, 6], {
    composite: true,
    fillColor: false,
    lineColor: $.colors("red", 400)
  });


  // Sparkline Types
  // ---------------
  // Line charts taking their values from the tag
  $('.sparkline-line').sparkline('html', {
    height: '32px',
    width: '150px',
    lineColor: $.colors("red", 600),
    fillColor: $.colors("red", 100)
  });

  // Bar charts using inline values
  $('.sparkline-bar').sparkline('html', {
    type: 'bar',
    height: '32px',
    barWidth: 10,
    barSpacing: 5,
    barColor: $.colors("primary", 500),
    negBarColor: $.colors("red", 500),
    stackedBarColor: [$.colors("primary", 500), $.colors("red", 500)]
  });

  // Composite line charts, the second using values supplied via javascript
  $('.sparkline-compositeline').sparkline('html', {
    height: '32px',
    width: '150px',
    fillColor: false,
    lineColor: $.colors("primary", 500),
    spotColor: $.colors("green", 500),
    minSpotColor: $.colors("primary", 500),
    maxSpotColor: $.colors("green", 500),
    changeRangeMin: 0,
    chartRangeMax: 10
  });
  $('.sparkline-compositeline').sparkline([4, 1, 5, 7, 9, 8, 7, 6, 6, 4, 7, 8, 4, 3, 2, 5, 6, 7], {
    composite: true,
    fillColor: false,
    height: '32px',
    width: '150px',
    lineColor: $.colors("red", 500),
    spotColor: $.colors("green", 500),
    minSpotColor: $.colors("primary", 500),
    maxSpotColor: $.colors("green", 500),
    changeRangeMin: 0,
    chartRangeMax: 10
  });

  // Line charts with normal range marker
  $('.sparkline-normalline').sparkline('html', {
    fillColor: false,
    height: '32px',
    width: '150px',
    lineColor: $.colors("red", 600),
    spotColor: $.colors("primary", 500),
    minSpotColor: $.colors("primary", 500),
    maxSpotColor: $.colors("primary", 500),
    normalRangeColor: $.colors("grey", 300),
    normalRangeMin: -1,
    normalRangeMax: 8
  });

  // Bar + line composite charts
  $('.sparkline-compositebar').sparkline('html', {
    type: 'bar',
    height: '32px',
    barWidth: 10,
    barSpacing: 5,
    barColor: $.colors("primary", 500)
  });

  $('.sparkline-compositebar').sparkline([4, 1, 5, 7, 9, 9, 8, 7, 6, 6, 4, 7, 8, 4, 3, 2, 2, 5, 6, 7], {
    composite: true,
    fillColor: false,
    lineColor: $.colors("red", 600),
    spotColor: $.colors("primary", 500)
  });

  // Discrete charts
  $('.sparkline-discrete1').sparkline('html', {
    type: 'discrete',
    height: '32px',
    lineColor: $.colors("primary", 500),
    xwidth: 36
  });

  $('.sparkline-discrete2').sparkline('html', {
    type: 'discrete',
    height: '32px',
    lineColor: $.colors("primary", 500),
    thresholdColor: $.colors("red", 600),
    thresholdValue: 4
  });

  // Bullet charts
  $('.sparkline-bullet').sparkline('html', {
    type: 'bullet',
    targetColor: $.colors("red", 500),
    targetWidth: '2',
    performanceColor: $.colors("primary", 600),
    rangeColors: [$.colors("primary", 100), $.colors("primary", 200), $.colors("primary", 400)]
  });

  // Customized line chart
  $('.sparkline-linecustom').sparkline('html', {
    height: '32px',
    width: '150px',
    lineColor: $.colors("red", 400),
    fillColor: $.colors("grey", 300),
    minSpotColor: false,
    maxSpotColor: false,
    spotColor: $.colors("green", 500),
    spotRadius: 2
  });

  // Tri-state charts using inline values
  $('.sparkline-tristate').sparkline('html', {
    type: 'tristate',
    height: '32px',
    barWidth: 10,
    barSpacing: 5,
    posBarColor: $.colors("primary", 500),
    negBarColor: $.colors("grey", 400),
    zeroBarColor: $.colors("red", 500)
  });

  $('.sparkline-tristatecols').sparkline('html', {
    type: 'tristate',
    height: '32px',
    barWidth: 10,
    barSpacing: 5,
    posBarColor: $.colors("primary", 500),
    negBarColor: $.colors("grey", 400),
    zeroBarColor: $.colors("red", 500),
    colorMap: {
      '-4': $.colors("red", 700),
      '-2': $.colors("primary", 600),
      '2': $.colors("grey", 500)
    }
  });

  // Box plots
  $('.sparkline-boxplot').sparkline('html', {
    type: 'box',
    height: '20px',
    width: '68px',
    lineColor: $.colors("primary", 700),
    boxLineColor: $.colors("primary", 400),
    boxFillColor: $.colors("primary", 400),
    whiskerColor: $.colors("grey", 600),
    // outlierLineColor: $.colors("grey", 400),
    // outlierFillColor: false,
    medianColor: $.colors("red", 500)
      // targetColor: $.colors("green", 500)
  });

  // Box plots raw
  $('.sparkline-boxplotraw').sparkline([1, 3, 5, 8, 10, 15, 18], {
    type: 'box',
    height: '20px',
    width: '78px',
    raw: true,
    showOutliers: true,
    target: 6,
    lineColor: $.colors("primary", 700),
    boxLineColor: $.colors("primary", 400),
    boxFillColor: $.colors("primary", 400),
    whiskerColor: $.colors("grey", 600),
    outlierLineColor: $.colors("grey", 400),
    outlierFillColor: $.colors("grey", 200),
    medianColor: $.colors("red", 500),
    targetColor: $.colors("green", 500)
  });

  // Pie charts
  $('.sparkline-pie').sparkline('html', {
    type: 'pie',
    height: '30px',
    sliceColors: [$.colors("primary", 500), $.colors("primary", 700), $.colors("primary", 600)]
  });

  $('.sparkline-pie-1').sparkline('html', {
    type: 'pie',
    height: '30px',
    sliceColors: [$.colors("primary", 500), $.colors("grey", 400)]
  });

})(document, window, jQuery);
