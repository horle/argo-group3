var map;
var smallWidth = false;
var global_score = 0;
var global_xp = 0;
var level = 1;

function introduction() {

	$page = $('#story-page');

	$pHead = $('#story-page-header');

	$pHead.append( $('<h2>').html('Willkommen zu "Life of Julius"!') );
	$pHead.append( $('<a>').attr({'data-role':'button',
											'id':'story-page-skip',
											'onclick':'startGame()',
											'class':'ui-btn-right',
											'data-icon':'forward'
		}).text('Überspringen') );

	$pCon = $('#story-page-content');
		
	$pCon.append( $('<img>').attr({'src':'img/julius_stand.jpg','width':'400px','id':'julius-bg'}) );
	$pCon.append( $('<p>').attr({'id':'intro-text'}).text(story.introduction) );

	$pHead.toolbar();
	$pCon.enhanceWithin();
	
}

function startGame() {

	$('#story-page').remove();
	$(':mobile-pagecontainer').pagecontainer('change', '#map-page');
}

$(document).on('pagebeforecreate', '#map-page', function() {

	// first time playing?
	if (readCookie("game") != 1){
	
		console.log("starting introduction");
		introduction();
		$(':mobile-pagecontainer').pagecontainer('change', '#story-page');
	}

/*********MAP INITIALISING*********/
	setCookie("game", 1);
	global_xp = readCookie("xp");
	global_score = readCookie("score");

	if (global_xp == "")
		global_xp = 0;
	if (global_score == "")
		global_score = 0;

	map = L.map('map').setView([50.939, 6.959], 15);

    function addMarker(i) {

        var feat = myPlaces.features[i],
            marker = L.marker(feat.geometry.coordinates, {icon: spqrIcon});

        marker.on('click', function(e){

            map.setView(e.latlng, 15, {animate: true});
            setContent(feat);

            $("#detail-panel").panel('open');
            $("#btn-start-quiz").unbind('click');
            $("#btn-start-quiz").on('click', function() {
					invokeGamePage(feat.properties.id)
            });

        });

        marker.addTo(map).bindPopup("<b>"+feat.properties.name+"</b>");
    }

	//lustig!
	// https://www.mapbox.com/developers/api/maps/#mapids
		 
	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
		maxZoom: 20,
		id: 'mapbox.pirates',
		accessToken: 'pk.eyJ1IjoibWFwYm94IiwiYSI6IjZjNmRjNzk3ZmE2MTcwOTEwMGY0MzU3YjUzOWFmNWZhIn0.Y8bhBaUMqFiPrDRW9hieoQ'
	}).addTo(map);
		 
	/*
	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);
	*/
	
	var header = $("#detail-panel-h2");
	var content = $("#detail-panel-p");
	var img = $("#detail-panel-img");

	//custom icon ;)

	var spqrIcon = L.icon({
		 iconUrl: 'http://www.asterix.com/jeux-et-concours/geo-quiz/images/pointe.png',

		 iconSize:     [38, 95], // size of the icon
		 iconAnchor:   [3, 87], // point of the icon which will correspond to marker's location
		 popupAnchor:  [13, -76] // point from which the popup should open relative to the iconAnchor
	});

	//filling map with points
	for (var i = 0; i < myPlaces.features.length; i++){

        addMarker(i);
	}

	function setContent(feat) {
		header.html(feat.properties.name);
		content.html(feat.properties.popupContent);
		img.attr({'src': feat.properties.picURL});
	}
	
	renderIndicators(global_xp, global_score);
/*******MAP INITIALISED********/

});
