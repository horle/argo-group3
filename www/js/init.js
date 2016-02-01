var map;
var smallWidth = false; //bool to indicate mobile device
var globalScore = 0;
var globalXP = 0;
var currentLevel = 0;

function introduction() {

	$page = $('#story-page');

	$pHead = $('#story-page-header');

	$pHead.append( $('<h2>').html('Willkommen zu "Life of Julius"!') );
	$pHead.append( $('<a>',{
		'data-role':'button',
		'id':'story-page-skip',
		'onclick':'startGame()',
		'class':'ui-btn-right',
		'data-iconpos':'right',
		'data-icon':'forward'
	}).text('Überspringen') );

	$pCon = $('#story-page-content');
		
	$pCon.append( $('<img>',{'src':'img/julius_stand.png','width':'300px','id':'julius'}) );
	$pCon.append( $('<p>',{'id':'intro-text'}).text(story.introduction) );
	$pCon.append( $('<a>',{
		'data-role':'button',
		'id':'story-page-skip',
		'onclick':'storyNext()',
		'data-icon':'arrow-r',
		'data-iconpos':'right'
	}).text('weiter ...') );

	$pHead.toolbar();
	$pCon.enhanceWithin();
}

function storyNext() {

	$pCon = $('#story-page-content');
	$pCon.empty();

	$intro = 'Die Entwickler von "Life of Julius" wünschen Dir viel Spaß beim Spielen!';
	
	$pCon.append( $('<p>',{'id':'intro-text'}).text(story.levels[0].levelup) );
	$pCon.append( $('<p>',{'id':'intro-text'}).text($intro) );
	$pCon.append( $('<a>',{
		'data-role':'button',
		'id':'story-page-skip',
		'onclick':'startGame()',
		'data-icon':'forward'
	}).text('Los!') );

	$pCon.enhanceWithin();
}

function startGame() {

	$('#story-page').remove();
	$(':mobile-pagecontainer').pagecontainer('change', '#map-page');
	
	setCookie("game", 1);
}

$(document).on('pagebeforecreate', '#map-page', function() {

	// first time playing?
	if (readCookie("game") != 1){
	
		introduction();
		$(':mobile-pagecontainer').pagecontainer('change', '#story-page');
		setCookie("level", 0);
		setCookie("xp", 0);
		setCookie("score",0);

	}

/*********MAP INITIALISING*********/

	$.mobile.hashListeningEnabled = false;
	$.mobile.changePage.defaults.changeHash = false;	

	wonGame = readCookie("won") == 1 ? true : false;
	currentLevel = readCookie("level");
	globalXP = readCookie("xp");
	globalScore = readCookie("score");

	if (globalXP == "")
		globalXP = 0;
	if (globalScore == "")
		globalScore = 0;

	map = L.map('map').setView([50.939, 6.959], 15);

   function addMarker(i) {

		var feat = myPlaces.features[i];
		var marker = L.marker(feat.geometry.coordinates, {icon: spqrIcon});

		marker.on('click', function(e){

			map.setView(e.latlng, 15, {animate: true});

			if(wonGame == false){
				setStoryContent(feat);
			}
			else{
				setDetailContent(feat);
			}

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
		attribution: '<a href="http://openstreetmap.org">OpenStreetMap</a>, <a href="http://mapbox.com">Mapbox</a>',
		maxZoom: 20,
		id: 'mapbox.pirates',
		accessToken: "pk.eyJ1IjoibGlmZW9mbHVsaXVzIiwiYSI6ImNpanptc25sMDAwNnJ2cGx6bjV2ajBwcTAifQ.FCMhdEJ3A9aZH2houDa7rw"
	//'pk.eyJ1IjoibWFwYm94IiwiYSI6IjZjNmRjNzk3ZmE2MTcwOTEwMGY0MzU3YjUzOWFmNWZhIn0.Y8bhBaUMqFiPrDRW9hieoQ'
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

	function setDetailContent(feat) {
		header.html(feat.properties.name);
		content.html(feat.properties.popupContent);
		img.attr({'src': feat.properties.picURL});
	}
	
	function setStoryContent(feat) {
		header.html(feat.properties.name);
		content.text(questions[feat.properties.id].intro);
		img.attr({'src': feat.properties.picURL});
	}

	renderIndicators(globalXP, globalScore);

	$('#level-panel').on("panelbeforeopen", function (){

		var goal = 0, sum = 0, next = 0, nextRank;

		for (var i = 0; i < story.levels.length; i++)
			goal += story.levels[i].xp;
		
		for (var i = 0; i < currentLevel; i++)
			sum += story.levels[i].xp;

		next = sum + story.levels[currentLevel].xp;
		sum += globalXP;
		
		if(currentLevel == story.levels.length -1){
			nextRank = "Konsul";
		}
		else
			nextRank = story.levels[currentLevel+1].name;

		thermometer(goal, sum, story.levels[currentLevel].name, next, nextRank, true);
		addResetButton();
	});

/*******MAP INITIALISED********/

});
