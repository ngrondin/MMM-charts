
Module.register("MMM-charts",{
	chartData: [],

	defaults: {
		
	},

	start: function() {
		this.getData();
	},
	
	getScripts: function() {
		return [
			'https://cdn.jsdelivr.net/npm/chart.js/dist/chart.min.js',
			'https://cdn.jsdelivr.net/npm/chartjs-adapter-date-fns/dist/chartjs-adapter-date-fns.bundle.min.js'
		];
	},
	
	getStyles: function() {
		return [
			'modules/MMM-charts/styles.css'
		];
	},

	getData: function() {
		if(this.config.url != null) {
			this.sendSocketNotification('getdata', {url: this.config.url});
		}
	},
	
	getDom: function() {
		var container = document.createElement("div");
		container.style.width = "500px";
		container.style.height = "300px";
		container.classList.add("MMM-charts-container");
		if(this.chartData != null && this.chartData.length > 0) {
			var canvas = document.createElement("canvas");
			const ctx = canvas.getContext('2d');
			var series = [];
			var labels = [];
			var seriesCount = this.chartData[0].length - 1;
			var firstLabel = this.chartData[0][0];
			var istimeseries = (new Date(firstLabel) !== "Invalid Date") && !isNaN(new Date(firstLabel));
			for(var i = 0; i < seriesCount; i++) series.push([]);
			for(var item of this.chartData) {
				labels.push(new Date(item[0]));
				for(var i = 0; i < seriesCount; i++) {
					series[i].push(i < item.length ? item[i + 1] : 0);
				}
			}
			var datasets = [];
			for(var i = 0; i < seriesCount; i++) {
				datasets.push({
					data: series[i],
					borderColor: 'rgba(180, 180, 180, 1)',
					pointRadius: 0,
					tension: 0.1,
					borderWidth: 1
				});
			}

			const myChart = new Chart(ctx, {
				type: 'line',
				data: {
					labels: labels,
					datasets: datasets
				},
				options: {
					responsive: true,
					maintainAspectRatio: false,
					scales: {
						y: {
							beginAtZero: true
						},
						x: {
							type: 'time',
							time: {
								format: 'YYYY-MM-DD'
							},
							scaleLabel: {
								display:     true,
								labelString: 'Date'
							}
						}
					},
					plugins: {
						legend: {
							display: false
						}
					}
				}
			});
			container.append(canvas);
		} else {
			container.innerHTML = "No Data";
		}
		return container;
	},

	socketNotificationReceived: function(notification, payload) {
		if(notification == 'data') {
			this.chartData = payload;
			this.updateDom(1000);
		}
	},


});
