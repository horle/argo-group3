var failCount;
var local_score_max;
var difficulty;

function renderIndicators(xp, score){
	//store the references outside the event handler!
	var $window = $(window);

	function checkWidth() {
		var windowsize = $window.width();
		if (windowsize > 440) {
			smallWidth = false;
			initBars();
			updateIndicators();
		}
		else {
			smallWidth = true;
			initCircles();
			updateIndicators();
		}
		console.log("resized!");
	}
	// Execute on load
	checkWidth();
	// Bind event listener
	$(window).resize(checkWidth);
}

// DEPRECATED, JUST FOR DEBUG
function callQuiz(id) {

	invokeGamePage(id);
}

function invokeGamePage(id) {

	//array of questions for certain object
	var q_array = questions[id].quests;
	var q = q_array[Math.floor(Math.random() * q_array.length)];
	var type = q.type;
	
	if (type == "mc" || type == "estimate" || type == "input") {

		prepareQuiz(q);
		$(':mobile-pagecontainer').pagecontainer('change', '#game-page');
	}
	else if (type == "breakanoid") {
		
		prepareBreakanoid(q);
		$(':mobile-pagecontainer').pagecontainer('change', '#game-page');
	}
}

function prepareQuiz(q) {

	$page = $('#game-page').empty();
	$gHead = $('<div>').attr({'id':'game-header','data-role':'header'})
		.appendTo($page);

	$gHead.append( $('<h2>').text("Quiz") );
	$gHead.append(	$('<a>').attr({'id':'game-close-btn',
											'href':'#map-page',
											'data-icon':'back',
											'class':'ui-btn-left'
		}).text("back") );

	$gContent = $('<div>').attr({'id':'game-content','data-role':'content'})
		.appendTo($page);

	var type = q.type;
	$gContent.append( $('<h3>').text(q.text) );

// MULTIPLE CHOICE
	if (type == "mc") {

		$gRadioContainer = $('<div>').attr({'class':'ui-field-contain'})
			.appendTo($gContent);
		$gRadioFieldSet = $('<fieldset>').attr({'data-role':'controlgroup'})
			.appendTo($gRadioContainer);
	
		var rad = "";
	   //create radio buttons for answers  
		for (var i = 0; i < q.answers.length; i++) {

			$('<input>').attr({	'type':'radio',
										'name':'q-answers',
										'id':'answer-'+i,
										'value':q.answers[i].correct
				}).appendTo($gRadioFieldSet);

			$('<label>').attr({'for':'answer-'+i}).text(q.answers[i].text)
				.appendTo($gRadioFieldSet);
		}

		$('<a>').attr({'data-role':'button','onclick':'checkQuiz()'})
			.text("Check!").appendTo($gContent);
		
		failCount = q.answers.length - 1;
		local_score_max = failCount * 10;	

		//update jquery mobile
		$gHead.toolbar();
		$gContent.enhanceWithin();
	}

// ESTIMATE QUESTION
	if (type == "estimate") {
		
		var solution = q.answer.sol;
		var tolerances = q.answer.tolerances;
//TODO

	}

// INPUT PROCESSING
	if (type == "input") {

		$('<input>').attr({	'type':'text',
									'data-clear-btn':true,
									'id':'q-input',
									'placeholder':'Deine Antwort'
			}).appendTo($gContent);
		
		function checkQuizInput() {

			if ($('#q-input').val() == q.answer.sol) {
//TODO
				console.log("richtig");
			}
		}

		$('<a>').attr({'data-role':'button','onclick':'checkQuizInput()'})
			.text("Check!").appendTo($gContent);
	}
}

function checkQuiz(){ 
	//get checked radio button value
	var res = $('input[name=q-answers]:checked');
	var local_score = failCount * 10;
	
	if (res == null){
		console.log("CARE: res == null");
		return null;
	}
	else
		res = res.val();
	
	if (res == "true"){
		popResult(true, local_score);
		updateXP(local_score_max);
		updateScore(local_score);
		updateIndicators();
	}
	else{
		failCount--;
		// decision to sacrifice score points for xp
		if ( popResult(false, local_score) == 1 ) {
			
			updateXP(local_score_max);
			updateScore(local_score_max * (-2));
			updateIndicators();
		}
	}
	return false;
}

function sacrificeScore(){

	console.log("sacrificing!");
	global_score += (-2) * local_score_max;
	updateIndicators();
}

function popResult(res, local_score) {

	// score points to subtract, if fail
	var sacrifice = local_score_max * 2;

	$popUp = $("<div/>").popup({
		theme: 'b',
		overlayTheme: 'b',
		transition: "pop",
	});
	if (res == true || failCount == 0)
		$popUp.on("popupafterclose", function() {
			$(this).remove();
			$(':mobile-pagecontainer').pagecontainer('change', '#map-page');
		});

	var title = res == true ? "Yeah!" : "Oh weh!";
	var text = res == true ? "Herzlichen Glückwunsch! Du hast die Frae richtig beantwortet und "
		+ local_score + " von " + local_score_max + " Punkten erzielt!" : "Leider nicht korrekt.";

	$("<div/>", {
		'data-role': "header",
		'data-theme': "b"
	}).append($("<h1>", {text:title})).appendTo($popUp);

	// answer wrong	
	if (res == false) {
		
		// last try ..
		if (failCount == 1) {

			text += " Nur noch ein Versuch übrig.";
			$("<p/>", { text : text }).appendTo($popUp);
		}
		// over!
		else if (failCount == 0) {
	
			text += " Diese Aufgabe bringt dir keine Punkte. Du kannst, um deine Erfahrung für diese Aufgabe zu retten, "
				+ sacrifice + " Punkte vom Highscore opfern. Möchtest du das?"

			$("<p/>", { text : text }).appendTo($popUp);
			$popUp.attr("data-dismissable", false);
			
			$("<a/>", {	text:"Nein!",
							'data-role':"button",
							"data-rel":"back"
				}).appendTo($popUp);

			$("<a/>", {	text:"OK!",
							"onClick":"sacrificeScore()",
							'data-role':"button",
				}).appendTo($popUp);

		}
		// wrong, but tries left
		else {

			text += " Nochmal versuchen! Noch "+failCount+" Versuche übrig."
			$("<p/>", { text : text }).appendTo($popUp);
		}
	// correct answer
	} else
		$("<p/>", { text : text }).appendTo($popUp);

	// in each case: display popup
	$popUp.popup("open", {overlayTheme: "b"}).trigger("create");
}

function updateIndicators() {

	if (smallWidth == false) {
		setXPBar(global_xp);
		setScoreBar(global_score);
	}
	else {
		setXPCircle(global_xp);
		setScoreCircle(global_score);
	}
}
//TODO: LEVELSTUFEN
function updateXP(xp) {
	
	global_xp += xp;

	setCookie("xp", global_xp);

	if (smallWidth == false)
		setXPBar(global_xp);
	else
		setXPCircle(global_xp);
}

function updateScore(score) {

	global_score += score;
	
	setCookie("score", global_score);
	
	if (smallWidth == false)
		setScoreBar(global_score);
	else
		setScoreCircle(global_score);
}

function prepareBreakanoid() {
	
	$("#game-content").html("<canvas id='breakanoid'></canvas>");
	startBreakanoid();
}

function initBars(){

	console.log("bars initialising");

	$xpCon = $("#xp-container").empty();
	$scoreCon = $("#score-container").empty();

	$xpCon.append( $('<p>').text('XP (% von Level):') );
	$xpBar = $('<div>').attr({	'class':'progressbar tiny-green',
										'id':'xp-bar'
		}).appendTo($xpCon).append( $('<div>') );

	$scoreCon.append( $('<p>').text('Punktestand:') );
//TODO: tiny-red
	$scoreBar = $('<div>').attr({	'class':'progressbar tiny-green',
											'id':'score-bar'
		}).appendTo($scoreCon).append( $('<div>') );
}

function initCircles(){

	console.log("circles initialising");

	//reset class attr
	$("#xp-container").removeClass("progressbar tiny-green").html("<div id='xp-circle'></div>");
	$("#score-container").removeClass("progressbar tiny-green").html("<div id='score-circle'></div>");
	//getBarValues(); needs to be implemented with cookies

	// circle js code
	var score_c = $('#score-circle').circleProgress({
		value: 0,
		size: 40,
		fill: { color: '#ff1e41' } 
	});

	var xp_c = $('#xp-circle').circleProgress({
		value: 0,
		size: 40,
		fill: { color: '#55ff11' }
	});

	score_c.on('circle-animation-progress', function(e, v) {
		var obj = $(this).data('circle-progress'),
			ctx = obj.ctx,
			s = obj.size,
			sv = (100 * v).toFixed(),
			fill = obj.arcFill;
	
		ctx.save();
		ctx.font = "bold " + s / 2.5 + "px sans-serif";
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillStyle = fill;
		ctx.fillText(sv, s / 2, s / 2);
		ctx.restore();
	});
	xp_c.on('circle-animation-progress', function(e, v) {
      var obj = $(this).data('circle-progress'),
         ctx = obj.ctx,
         s = obj.size,
         sv = (100 * v).toFixed(),
         fill = obj.arcFill;

      ctx.save();
      ctx.font = "bold " + s / 2.5 + "px sans-serif";
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = fill;
      ctx.fillText(sv, s / 2, s / 2);
      ctx.restore();
   });
}

function setScoreCircle(x) {

	$('#score-circle').circleProgress({value: x});
}

function setXPCircle(x) {

	$('#xp-circle').circleProgress({value: x});
}

function setXPBar(x){

	var progressBarWidth = x * $('#xp-bar').width() / 100;
	$('#xp-bar').find('div').animate({ width: progressBarWidth }, 500).html(x + "% ");
}
function getXPBar(){

	return $('#xp-circle').circleProgress('value');
}
function setScoreBar(x){

	var progressBarWidth = x * $('#score-bar').width() / 100;
	$('#score-bar').find('div').animate({ width: progressBarWidth }, 500).html(x + "% ");
}
function getScoreBar(){

	return $('#score-circle').circleProgress('value');
}

function setCookie(name, value) {

	document.cookie = name + "=" + value;
	console.log("set "+name+" to "+value);
}

// ONLY NUMBERS!
function readCookie(cname) {

	var name = cname + "=";
	var ca = document.cookie.split(';');

	for(var i=0; i<ca.length; i++) {

		var c = ca[i];
		while (c.charAt(0)==' ')
			c = c.substring(1);

		if (c.indexOf(name) == 0)
			return parseInt(c.substring(name.length, c.length));
	}
	return "";
}
