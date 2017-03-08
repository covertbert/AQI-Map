const apiToken = '6d7207f8385582fa8a3bf83483dec2a9b1c7f64e';
const coordinates = {
	uk: '51.1,-6.9,58.1,1.3',
	europe: '38.0,-28.0,71.0,47.0',
};
const apiQuery = `//api.waqi.info/map/bounds/?latlng=${coordinates.uk}&token=${apiToken}`;
const placesArray = [];

const getApiData = $.getJSON(apiQuery, (result) => {
	const data = result.data;
	data.map((aqiData) => {
		placesArray.push({
			lat: aqiData.lat,
			lon: aqiData.lon,
			aqi: parseInt(aqiData.aqi, 10),
		});
		return placesArray;
	});
});

function setGradient(aqi) {
	const greenBlue = Math.floor(256 - ((aqi / 100) * 256));
	return `rgb(256, ${greenBlue}, ${greenBlue})`;
}

function initMap() {
	const map = new google.maps.Map(document.getElementById('map'), {
		zoom: 6,
		center: { lat: 54.0, lng: -3.0 },
		mapTypeId: 'roadmap',
	});

	getApiData.then(() => {
		placesArray.map((aqiData) => {
			const coords = { lat: aqiData.lat, lng: aqiData.lon };
			if (!isNaN(aqiData.aqi)) {
				const circle = new google.maps.Circle({
					center: coords,
					strokeWeight: 0,
					fillColor: setGradient(aqiData.aqi),
					fillOpacity: 0.9,
					map,
					radius: 15000,
					label: aqiData.aqi.toString(),
				});
			}
		});
	});
}
