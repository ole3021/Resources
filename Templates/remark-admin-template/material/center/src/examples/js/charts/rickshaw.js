(function(document, window, $) {
  'use strict';
  var Site = window.Site;
  $(document).ready(function($) {
    Site.run();
  });

  // Example Lines
  // -------------
  (function() {
    var seriesData = [
      [],
      [],
      []
    ];
    var random = new Rickshaw.Fixtures.RandomData(150);

    for (var i = 0; i < 150; i++) {
      random.addData(seriesData);
    }

    var $element = $('#exampleChart');
    var graph = new Rickshaw.Graph({
      element: $element.get(0),
      width: $element.width(),
      height: 300,
      renderer: 'line',
      series: [{
        color: $.colors("primary", 500),
        data: seriesData[0],
        name: 'New York'
      }, {
        color: $.colors("red", 500),
        data: seriesData[1],
        name: 'London'
      }, {
        color: $.colors("green", 500),
        data: seriesData[2],
        name: 'Tokyo'
      }]
    });

    graph.render();

    setInterval(function() {
      random.removeData(seriesData);
      random.addData(seriesData);
      graph.update();

    }, 2000);

    var hoverDetail = new Rickshaw.Graph.HoverDetail({
      graph: graph
    });

    var legend = new Rickshaw.Graph.Legend({
      graph: graph,
      element: document.getElementById('exampleChartLegend')

    });

    var shelving = new Rickshaw.Graph.Behavior.Series.Toggle({
      graph: graph,
      legend: legend
    });

    var axes = new Rickshaw.Graph.Axis.Time({
      graph: graph
    });
    axes.render();

    $(window).on('resize', function() {
      graph.configure({
        width: $element.width()
      });
      graph.render();
    });
  })();


  // Example Scatter Plot
  // --------------------
  (function() {
    var seriesData = [
      [],
      [],
      []
    ];
    var random = new Rickshaw.Fixtures.RandomData(150);

    for (var i = 0; i < 150; i++) {
      random.addData(seriesData);
    }

    var $element = $('#exampleScatterChart');
    var graph = new Rickshaw.Graph({
      element: $element.get(0),
      width: $element.width(),
      height: 300,
      renderer: 'scatterplot',
      series: [{
        color: $.colors("primary", 500),
        data: seriesData[0],
        name: 'New York'
      }, {
        color: $.colors("red", 500),
        data: seriesData[1],
        name: 'London'
      }, {
        color: $.colors("green", 500),
        data: seriesData[2],
        name: 'Tokyo'
      }]
    });

    graph.render();

    var hoverDetail = new Rickshaw.Graph.HoverDetail({
      graph: graph
    });

    var legend = new Rickshaw.Graph.Legend({
      graph: graph,
      element: document.getElementById('exampleScatterLegend')
    });

    var shelving = new Rickshaw.Graph.Behavior.Series.Toggle({
      graph: graph,
      legend: legend
    });

    $(window).on('resize', function() {
      graph.configure({
        width: $element.width()
      });
      graph.render();
    });

  })();

  // Example Stacked Bars
  // --------------------
  (function() {
    var seriesData = [
      [],
      [],
      []
    ];
    var random = new Rickshaw.Fixtures.RandomData(150);

    for (var i = 0; i < 150; i++) {
      random.addData(seriesData);
    }

    var $element = $('#exampleStackedChart');
    var graph = new Rickshaw.Graph({
      element: $element.get(0),
      width: $element.width(),
      height: 300,
      renderer: 'bar',
      series: [{
        color: $.colors("primary", 700),
        data: seriesData[0],
        name: 'New York'
      }, {
        color: $.colors("primary", 500),
        data: seriesData[1],
        name: 'London'
      }, {
        color: $.colors("primary", 300),
        data: seriesData[2],
        name: 'Tokyo'
      }]
    });

    graph.render();

    setInterval(function() {
      random.removeData(seriesData);
      random.addData(seriesData);
      graph.update();

    }, 2000);

    var hoverDetail = new Rickshaw.Graph.HoverDetail({
      graph: graph
    });

    var legend = new Rickshaw.Graph.Legend({
      graph: graph,
      element: document.getElementById('exampleStackedLegend')
    });

    var shelving = new Rickshaw.Graph.Behavior.Series.Toggle({
      graph: graph,
      legend: legend
    });

    $(window).on('resize', function() {
      graph.configure({
        width: $element.width()
      });
      graph.render();
    });
  })();

  // Example Area
  // ------------
  (function() {
    var seriesData = [
      [],
      [],
      []
    ];
    var random = new Rickshaw.Fixtures.RandomData(150);

    for (var i = 0; i < 150; i++) {
      random.addData(seriesData);
    }

    var $element = $('#exampleAreaChart');
    var graph = new Rickshaw.Graph({
      element: $element.get(0),
      width: $element.width(),
      height: 300,
      renderer: 'area',
      stroke: true,
      series: [{
        color: $.colors("purple", 700),
        data: seriesData[0],
        name: 'New York'
      }, {
        color: $.colors("purple", 500),
        data: seriesData[1],
        name: 'London'
      }, {
        color: $.colors("purple", 300),
        data: seriesData[2],
        name: 'Tokyo'
      }]
    });

    graph.render();

    setInterval(function() {
      random.removeData(seriesData);
      random.addData(seriesData);
      graph.update();

    }, 2000);

    var hoverDetail = new Rickshaw.Graph.HoverDetail({
      graph: graph
    });

    var legend = new Rickshaw.Graph.Legend({
      graph: graph,
      element: document.getElementById('exampleAreaLegend')
    });

    var shelving = new Rickshaw.Graph.Behavior.Series.Toggle({
      graph: graph,
      legend: legend
    });

    $(window).on('resize', function() {
      graph.configure({
        width: $element.width()
      });
      graph.render();
    });

  })();

  // Example Multiple Renderers
  // ---------------------------
  (function() {
    var seriesData = [
      [],
      [],
      [],
      [],
      []
    ];
    var random = new Rickshaw.Fixtures.RandomData(50);

    for (var i = 0; i < 75; i++) {
      random.addData(seriesData);
    }

    var $element = $('#exampleMultipleChart');
    var graph = new Rickshaw.Graph({
      element: $element.get(0),
      width: $element.width(),
      height: 300,
      renderer: 'multi',
      dotSize: 5,
      series: [{
        name: 'temperature',
        data: seriesData.shift(),
        color: $.colors("green", 500),
        renderer: 'stack'
      }, {
        name: 'heat index',
        data: seriesData.shift(),
        color: $.colors("cyan", 500),
        renderer: 'stack'
      }, {
        name: 'dewpoint',
        data: seriesData.shift(),
        color: $.colors("blue", 500),
        renderer: 'scatterplot'
      }, {
        name: 'pop',
        data: seriesData.shift().map(function(d) {
          return {
            x: d.x,
            y: d.y / 4
          }
        }),
        color: $.colors("indigo", 500),
        renderer: 'bar'
      }, {
        name: 'humidity',
        data: seriesData.shift().map(function(d) {
          return {
            x: d.x,
            y: d.y * 1.5
          }
        }),
        renderer: 'line',
        color: $.colors("red", 500)
      }]
    });

    var slider = new Rickshaw.Graph.RangeSlider.Preview({
      graph: graph,
      element: document.querySelector('#exampleMultipleSlider')
    });

    graph.render();

    var detail = new Rickshaw.Graph.HoverDetail({
      graph: graph
    });

    var legend = new Rickshaw.Graph.Legend({
      graph: graph,
      element: document.querySelector('#exampleMultipleLegend')
    });

    var highlighter = new Rickshaw.Graph.Behavior.Series.Highlight({
      graph: graph,
      legend: legend,
      disabledColor: function() {
        return 'rgba(0, 0, 0, 0.2)'
      }
    });

    var highlighter = new Rickshaw.Graph.Behavior.Series.Toggle({
      graph: graph,
      legend: legend
    });

    $(window).on('resize', function() {
      graph.configure({
        width: $element.width()
      });
      graph.render();
    });
  })();
})(document, window, jQuery);
