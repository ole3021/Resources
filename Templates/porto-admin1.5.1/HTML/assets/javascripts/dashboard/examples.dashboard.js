/*
Name: 			Dashboard - Examples
Written by: 	Okler Themes - (http://www.okler.net)
Theme Version: 	1.5.1
*/

(function($) {

	'use strict';

	/*
	Sales Selector
	*/
	$('#salesSelector').themePluginMultiSelect().on('change', function() {
		var rel = $(this).val();
		$('#salesSelectorItems .chart').removeClass('chart-active').addClass('chart-hidden');
		$('#salesSelectorItems .chart[data-sales-rel="' + rel + '"]').addClass('chart-active').removeClass('chart-hidden');
	});

	$('#salesSelector').trigger('change');

	$('#salesSelectorWrapper').addClass('ready');

	/*
	Flot: Sales 1
	*/
	var flotDashSales1 = $.plot('#flotDashSales1', flotDashSales1Data, {
		series: {
			lines: {
				show: true,
				lineWidth: 2
			},
			points: {
				show: true
			},
			shadowSize: 0
		},
		grid: {
			hoverable: true,
			clickable: true,
			borderColor: 'rgba(0,0,0,0.1)',
			borderWidth: 1,
			labelMargin: 15,
			backgroundColor: 'transparent'
		},
		yaxis: {
			min: 0,
			color: 'rgba(0,0,0,0.1)'
		},
		xaxis: {
			mode: 'categories',
			color: 'rgba(0,0,0,0)'
		},
		legend: {
			show: false
		},
		tooltip: true,
		tooltipOpts: {
			content: '%x: %y',
			shifts: {
				x: -30,
				y: 25
			},
			defaultTheme: false
		}
	});

	// devcode: !production
	$(this).on("styleSwitcher.modifyVars", function(ev) {
		flotDashSales1Data[0].color = ev.options.colorPrimary;
		flotDashSales1.setData(flotDashSales1Data);
		flotDashSales1.draw();
	});

	if (typeof($.browser) != 'undefined') {
		if($.browser.mobile) {
			flotDashSales1Data[0].color = '#0088cc';
			flotDashSales1.setData(flotDashSales1Data);
			flotDashSales1.draw();
		}
	}

	// endcode

	/*
	Flot: Sales 2
	*/
	var flotDashSales2 = $.plot('#flotDashSales2', flotDashSales2Data, {
		series: {
			lines: {
				show: true,
				lineWidth: 2
			},
			points: {
				show: true
			},
			shadowSize: 0
		},
		grid: {
			hoverable: true,
			clickable: true,
			borderColor: 'rgba(0,0,0,0.1)',
			borderWidth: 1,
			labelMargin: 15,
			backgroundColor: 'transparent'
		},
		yaxis: {
			min: 0,
			color: 'rgba(0,0,0,0.1)'
		},
		xaxis: {
			mode: 'categories',
			color: 'rgba(0,0,0,0)'
		},
		legend: {
			show: false
		},
		tooltip: true,
		tooltipOpts: {
			content: '%x: %y',
			shifts: {
				x: -30,
				y: 25
			},
			defaultTheme: false
		}
	});

	/*
	Flot: Sales 3
	*/
	var flotDashSales3 = $.plot('#flotDashSales3', flotDashSales3Data, {
		series: {
			lines: {
				show: true,
				lineWidth: 2
			},
			points: {
				show: true
			},
			shadowSize: 0
		},
		grid: {
			hoverable: true,
			clickable: true,
			borderColor: 'rgba(0,0,0,0.1)',
			borderWidth: 1,
			labelMargin: 15,
			backgroundColor: 'transparent'
		},
		yaxis: {
			min: 0,
			color: 'rgba(0,0,0,0.1)'
		},
		xaxis: {
			mode: 'categories',
			color: 'rgba(0,0,0,0)'
		},
		legend: {
			show: false
		},
		tooltip: true,
		tooltipOpts: {
			content: '%x: %y',
			shifts: {
				x: -30,
				y: 25
			},
			defaultTheme: false
		}
	});

	/*
	Liquid Meter
	*/
	$('#meterSales').liquidMeter({
		shape: 'circle',
		color: '@@skinColor',
		background: '#F9F9F9',
		fontSize: '24px',
		fontWeight: '600',
		stroke: '#F2F2F2',
		textColor: '#333',
		liquidOpacity: 0.9,
		liquidPalette: ['#333'],
		speed: 3000,
		animate: !$.browser.mobile
	});

	$('#meterSalesSel a').on('click', function( ev ) {
		ev.preventDefault();

		var val = $(this).data("val"),
			selector = $(this).parent(),
			items = selector.find('a');

		items.removeClass('active');
		$(this).addClass('active');

		// Update Meter Value
		$('#meterSales').liquidMeter('set', val);
	});

	// devcode: !production
	$(this).on("styleSwitcher.modifyVars", function(ev) {
		$('#meterSales').liquidMeter('color', ev.options.colorPrimary);
	});

	if (typeof($.browser) != 'undefined') {
		if($.browser.mobile) {
			$('#meterSales').liquidMeter('color', '#0088cc');
		}
	}

	// endcode

	/*
	Flot: Basic
	*/
	var flotDashBasic = $.plot('#flotDashBasic', flotDashBasicData, {
		series: {
			lines: {
				show: true,
				fill: true,
				lineWidth: 1,
				fillColor: {
					colors: [{
						opacity: 0.45
					}, {
						opacity: 0.45
					}]
				}
			},
			points: {
				show: true
			},
			shadowSize: 0
		},
		grid: {
			hoverable: true,
			clickable: true,
			borderColor: 'rgba(0,0,0,0.1)',
			borderWidth: 1,
			labelMargin: 15,
			backgroundColor: 'transparent'
		},
		yaxis: {
			min: 0,
			max: 200,
			color: 'rgba(0,0,0,0.1)'
		},
		xaxis: {
			color: 'rgba(0,0,0,0)'
		},
		tooltip: true,
		tooltipOpts: {
			content: '%s: Value of %x is %y',
			shifts: {
				x: -60,
				y: 25
			},
			defaultTheme: false
		}
	});

	// devcode: !production
	$(this).on("styleSwitcher.modifyVars", function(ev) {
		flotDashBasicData[0].color = ev.options.colorPrimary;
		flotDashBasic.setData(flotDashBasicData);
		flotDashBasic.draw();
	});

	if (typeof($.browser) != 'undefined') {
		if($.browser.mobile) {
			flotDashBasicData[0].color = '#0088cc';
			flotDashBasic.setData(flotDashBasicData);
			flotDashBasic.draw();
		}
	}

	// endcode

	/*
	Flot: Real-Time
	*/
	(function() {
		var data = [],
			totalPoints = 300;

		function getRandomData() {

			if (data.length > 0)
				data = data.slice(1);

			// Do a random walk
			while (data.length < totalPoints) {

				var prev = data.length > 0 ? data[data.length - 1] : 50,
					y = prev + Math.random() * 10 - 5;

				if (y < 0) {
					y = 0;
				} else if (y > 100) {
					y = 100;
				}

				data.push(y);
			}

			// Zip the generated y values with the x values
			var res = [];
			for (var i = 0; i < data.length; ++i) {
				res.push([i, data[i]])
			}

			return res;
		}

		var flotDashRealTime = $.plot('#flotDashRealTime', [getRandomData()], {
			colors: ['#8CC9E8'],
			series: {
				lines: {
					show: true,
					fill: true,
					lineWidth: 1,
					fillColor: {
						colors: [{
							opacity: 0.45
						}, {
							opacity: 0.45
						}]
					}
				},
				points: {
					show: false
				},
				shadowSize: 0
			},
			grid: {
				borderColor: 'rgba(0,0,0,0.1)',
				borderWidth: 1,
				labelMargin: 15,
				backgroundColor: 'transparent'
			},
			yaxis: {
				min: 0,
				max: 100,
				color: 'rgba(0,0,0,0.1)'
			},
			xaxis: {
				show: false
			}
		});

		function update() {

			flotDashRealTime.setData([getRandomData()]);

			// Since the axes don't change, we don't need to call plot.setupGrid()
			flotDashRealTime.draw();
			setTimeout(update, ($('html').hasClass( 'mobile-device' ) ? 1000 : 30) );
		}

		update();
	})();

	/*
	Sparkline: Bar
	*/
	var sparklineBarDashOptions = {
		type: 'bar',
		width: '80',
		height: '55',
		barColor: '@@skinColor',
		negBarColor: '#B20000'
	};

	$("#sparklineBarDash").sparkline(sparklineBarDashData, sparklineBarDashOptions);

	// devcode: !production
	$(this).on("styleSwitcher.modifyVars", function(ev) {
		$("#sparklineBarDash").sparkline(sparklineBarDashData, $.extend({}, sparklineBarDashOptions, {
			barColor: ev.options.colorPrimary
		}));
	});

	if (typeof($.browser) != 'undefined') {
		if($.browser.mobile) {
			$("#sparklineBarDash").sparkline(sparklineBarDashData, $.extend({}, sparklineBarDashOptions, {
				barColor: '#0088cc'
			}));
		}
	}

	// endcode

	/*
	Sparkline: Line
	*/
	var sparklineLineDashOptions = {
		type: 'line',
		width: '80',
		height: '55',
		lineColor: '@@skinColor'
	};

	$("#sparklineLineDash").sparkline(sparklineLineDashData, sparklineLineDashOptions);

	/*
	Map
	*/
	var vectorMapDashOptions = {
		map: 'world_en',
		backgroundColor: null,
		color: '#FFF',
		hoverOpacity: 0.7,
		selectedColor: '#0088CC',
		selectedRegions: ['US'],
		enableZoom: true,
		borderWidth:1,
		showTooltip: true,
		values: sample_data,
		scaleColors: ['@@skinColor'],
		normalizeFunction: 'polynomial'
	};

	$('#vectorMapWorld').vectorMap(vectorMapDashOptions);

}).apply(this, [jQuery]);