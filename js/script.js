$(document).ready(function() {

	createGraph('#data-table', '.chart');
	
	function createGraph(data, container) {
		var bars = [];
		var figureContainer = $('<div id="figure"></div>');
		var graphContainer = $('<div class="graph"></div>');
		var barContainer = $('<div class="bars"></div>');
		var data = $(data);
		var container = $(container);
		var chartData;		
		var chartYMax;
		var columnGroups;
		
		var barTimer;
		var graphTimer;
		
		var tableData = {
			chartData: function() {
				var chartData = [];
				data.find('tbody td').each(function() {
					chartData.push($(this).text());
				});
				return chartData;
			},
			chartHeading: function() {
				var chartHeading = data.find('caption').text();
				return chartHeading;
			},
			chartLegend: function() {
				var chartLegend = [];
				data.find('tbody th').each(function() {
					chartLegend.push($(this).text());
				});
				return chartLegend;
			},
			chartYMax: function() {
				var chartData = this.chartData();
				var chartYMax = Math.ceil(Math.max.apply(Math, chartData) / 1000) * 700;
				return chartYMax;
			},
			yLegend: function() {
				var chartYMax = this.chartYMax();
				var yLegend = [];
				var yAxisMarkings = 8;						
				for (var i = 0; i < yAxisMarkings; i++) {
					yLegend.unshift(((chartYMax * i) / (yAxisMarkings - 1)) / 1);
				}
				return yLegend;
			},
			xLegend: function() {
				var xLegend = [];
				data.find('thead th').each(function() {
					xLegend.push($(this).text());
				});
				return xLegend;
			},
			columnGroups: function() {
				var columnGroups = [];
				var columns = data.find('tbody tr:eq(0) td').length;
				for (var i = 0; i < columns; i++) {
					columnGroups[i] = [];
					data.find('tbody tr').each(function() {
						columnGroups[i].push($(this).find('td').eq(i).text());
					});
				}
				return columnGroups;
			}
		}
			
		chartData = tableData.chartData();		
		chartYMax = tableData.chartYMax();
		columnGroups = tableData.columnGroups();
		
		// Конструируем график(контейнер) 
		// Перебираем группы столбцов для добавления нужных баров
		$.each(columnGroups, function(i) {
			var barGroup = $('<div class="bar-group"></div>');
			for (var j = 0, k = columnGroups[i].length; j < k; j++) {
				var barObj = {};
				barObj.label = this[j];
				barObj.height = Math.floor(barObj.label / chartYMax * 100) + '%';
				barObj.bar = $('<div class="bar fig' + j + '"><span>' + barObj.label + '</span></div>')
					.appendTo(barGroup);
				bars.push(barObj);
			}
			barGroup.appendTo(barContainer);			
		});
		
		var chartHeading = tableData.chartHeading();
		var heading = $('<h4>' + chartHeading + '</h4>');
		heading.appendTo(figureContainer);
		
		var chartLegend	= tableData.chartLegend();
		var legendList	= $('<ul class="legend"></ul>');
		$.each(chartLegend, function(i) {			
			var listItem = $('<li><span class="icon fig' + i + '"></span>' + '- Динамика отказов за ' + this + ' год.' + '</li>')
				.appendTo(legendList);
		});
		legendList.appendTo(figureContainer);
		
		var xLegend	= tableData.xLegend();		
		var xAxisList	= $('<ul class="x-axis"></ul>');
		$.each(xLegend, function(i) {			
			var listItem = $('<li><span>' + this + '</span></li>')
				.appendTo(xAxisList);
		});
		xAxisList.appendTo(graphContainer);
		
		var yLegend	= tableData.yLegend();
		var yAxisList	= $('<ul class="y-axis"></ul>');
		$.each(yLegend, function(i) {			
			var listItem = $('<li><span>' + this + '</span></li>')
				.appendTo(yAxisList);
		});
		yAxisList.appendTo(graphContainer);		
		
		barContainer.appendTo(graphContainer);		
		
		graphContainer.appendTo(figureContainer);
		
		figureContainer.appendTo(container);
		
		function displayGraph(bars, i) {		
			if (i < bars.length) {
				// Анимируем столбцы.
				$(bars[i].bar).animate({
					height: bars[i].height
				}, 200); //Скорость роста столбца
				barTimer = setTimeout(function() {
					i++;				
					displayGraph(bars, i);
				}, 40); //Задержка анимации перед ростом следующей группы столбцов
			}
		}
		
		// Сброс значений графика
		function resetGraph() {
			$.each(bars, function(i) {
				$(bars[i].bar).stop().css('height', 0);
			});
			
			clearTimeout(barTimer);
			clearTimeout(graphTimer);
					
			graphTimer = setTimeout(function() {		
				displayGraph(bars, 0);
			}, 200);
		}
		
		$('#reset-graph-button').click(function() {
			resetGraph();
			return false;
		});
		
		resetGraph();
	}	
});