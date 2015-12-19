/*********MAP INITIALISING*********/
var map = L.map('map').setView([50.94, 6.95], 14);

//lustig!
// https://www.mapbox.com/developers/api/maps/#mapids
    
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
	attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors,<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
	maxZoom: 20,
	id: 'mapbox.pirates',
	accessToken: 'pk.eyJ1IjoibWFwYm94IiwiYSI6IjZjNmRjNzk3ZmE2MTcwOTEwMGY0MzU3YjUzOWFmNWZhIn0.Y8bhBaUMqFiPrDRW9hieoQ'
}).addTo(map);
    
/*
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);
*/

var overlay = document.getElementById('overlay');
var content = document.getElementById('overlay-content');
var header = document.getElementById('overlay-h1');
var img = document.getElementById('overlay-img');


//custom icon ;)

var spqrIcon = L.icon({
    iconUrl: 'http://www.asterix.com/jeux-et-concours/geo-quiz/images/pointe.png',

    iconSize:     [38, 95], // size of the icon
    iconAnchor:   [3, 87], // point of the icon which will correspond to marker's location
    popupAnchor:  [13, -76] // point from which the popup should open relative to the iconAnchor
});

//filling map with points
for (var i = 0; i < myPlaces.features.length; i++){

	feat = myPlaces.features[i];
	var marker = L.marker(feat.geometry.coordinates, {icon: spqrIcon});
	(function(feat) {
		marker.on('click', function(e){
			
			overlay.style.display = "none";
			map.setView(e.latlng, 16, {animate: true});
			setContent(feat);
			overlay.style.display = "block";
		});
	})(feat);

	marker.addTo(map).bindPopup("<b>"+feat.properties.name+"</b>");
}


function setContent(feat) {
	header.innerHTML = feat.properties.name;
	content.innerHTML = feat.properties.popupContent;
	img.src = feat.properties.picURL;
}

// click somewhere on the map to hide the overlay div
map.on('click', function(e){
	
	overlay.style.display = 'none';
});

/*******MAP INITIALISED********/
