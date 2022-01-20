
;(function($) {

	$.fn.openWeather  = function(options) {
		const defaults = {
			descriptionTarget: null,
			maxTemperatureTarget: null,
			minTemperatureTarget: null,
			windSpeedTarget: null,
			humidityTarget: null,
			sunriseTarget: null,
			sunsetTarget: null,
			placeTarget: null,
			units: 'c',
			windSpeedUnit: 'Mps',
			city: null,
			key: null,		
		}

		const plugin = this;
		const el = $(this);
		plugin.settings = {}
		plugin.settings = $.extend({}, defaults, options);
		const s = plugin.settings;

		const formatTime = function(unixTimestamp) {
			const milliseconds = unixTimestamp * 1000;
			const date = new Date(milliseconds);
			let hours = date.getHours();
			if(hours > 12) {
				let hoursRemaining = 24 - hours;
				hours = 12 - hoursRemaining;
			}
			let minutes = date.getMinutes();
			minutes = minutes.toString();
			if(minutes.length < 2) {
				minutes = 0 + minutes;
			}
			let time = hours + ':' + minutes;
			return time;
		}

		let apiURL = 'https://api.openweathermap.org/data/2.5/weather?lang=';
		if(s.city != null) {
			apiURL += '&q='+s.city;

		}

		if(s.key != null) {
			apiURL += '&appid=' + s.key;
		}

		$.ajax({
			type: 'GET',
			url: apiURL,
			dataType: 'jsonp',
			success: function(data) {

				if(data) {
					if(s.units == 'c') {
						temperature = Math.round(data.main.temp - 273.15) + '°C';
						minTemperature = Math.round(data.main.temp_min - 273.15) + '°C';
						maxTemperature = Math.round(data.main.temp_max - 273.15) + '°C';
						
					} 
					windSpeed = (s.windSpeedUnit == 'km/h') ? data.wind.speed*3.6 : data.wind.speed;

					weatherObj = {
						city: `${data.name}, ${data.sys.country}`,
						temperature: {
							current: temperature,
							min: minTemperature,
							max: maxTemperature,
							units: s.units.toUpperCase()
						},
						description: data.weather[0].description,
						windspeed: `${Math.round(windSpeed)} ${ s.windSpeedUnit }`,
						humidity: `${data.main.humidity}%`,
						sunrise: `${formatTime(data.sys.sunrise)} AM`,
						sunset: `${formatTime(data.sys.sunset)} PM`
					};
					el.html(temperature);

					$(s.descriptionTarget).text(weatherObj.description);

					if(s.placeTarget != null) {

						$(s.placeTarget).text(weatherObj.city);
					}

			
					if(s.windSpeedTarget != null) {
						$(s.windSpeedTarget).text(weatherObj.windspeed);
					}

				
					if(s.humidityTarget != null) {
						$(s.humidityTarget).text(weatherObj.humidity);
					}

				
					if(s.sunriseTarget != null) {
						$(s.sunriseTarget).text(weatherObj.sunrise);
					}

					if(s.sunsetTarget != null) {
						$(s.sunsetTarget).text(weatherObj.sunset);
					}
					
				}
			},
			
		});
	}
})(jQuery);
