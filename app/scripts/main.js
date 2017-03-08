const apiToken = '6d7207f8385582fa8a3bf83483dec2a9b1c7f64e';
const coordinates = {
	uk: '51.1,-6.9,58.1,1.3',
	europe: '38.0,-28.0,71.0,47.0',
};
const apiQuery = `//api.waqi.info/map/bounds/?latlng=${coordinates.europe}&token=${apiToken}`;
const placesArray = [];
let aqiHighest = 0;

const getApiData = $.getJSON(apiQuery, (result) => {
	const data = result.data;
	data.map((aqiData) => {
		const aqiValue = parseInt(aqiData.aqi, 10);
		placesArray.push({
			lat: aqiData.lat,
			lon: aqiData.lon,
			aqi: aqiValue,
		});
		if (aqiValue > aqiHighest && aqiValue !== 999) {
			aqiHighest = aqiValue;
		}
		return placesArray;
	});
});

function setCircleOpacity(AQIValue) {
	return AQIValue / 250 <= 0.9 ? AQIValue / 250 : 0.95;
}

function setGradient(AQIValue) {
	const greenBlue = Math.floor(256 - ((AQIValue / aqiHighest > 700 ? 700 : aqiHighest) * 256));
	return `rgb(256, ${greenBlue}, ${greenBlue})`;
}

function drawDataCircles(map) {
	getApiData.then(() => {
		placesArray.map((aqiData) => {
			const circleCoordinates = { lat: aqiData.lat, lng: aqiData.lon };
			if (!isNaN(aqiData.aqi)) {
				const circle = new google.maps.Circle({
					center: circleCoordinates,
					strokeWeight: 0,
					fillColor: setGradient(aqiData.aqi),
					fillOpacity: setCircleOpacity(aqiData.aqi),
					map,
					radius: 20000,
				});
				return circle;
			}
			return true;
		});
	});
}

function initMap() {
	const dataMap = new google.maps.Map(document.getElementById('map'), {
		zoom: 6,
		center: { lat: 54.0, lng: -3.0 },
		mapTypeId: 'roadmap',
	});
	drawDataCircles(dataMap);
}
