var failCount;
var local_score_max;
var difficulty;

function renderIndicators(xp, score){
	//store the references outside the event handler!
	var $window = $(window);

	function checkWidth() {
		var windowsize = $window.width();
		if (windowsize > 530) {
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

//JUST FOR DEBUG
function resetPoints(){

	updateXP((-1)*global_xp);
	updateScore((-1)*global_score);
	updateIndicators();
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

function prepareBreakanoid() {

	$page = $('#game-page').empty();	

	$gHead = $('<div>').attr({'id':'game-header','data-role':'header'})
		.appendTo($page);

	$gHead.append( $('<h2>').text("Breakanoid") );
	$gHead.append(	$('<a>').attr({'id':'game-close-btn',
											'href':'#map-page',
											'data-icon':'back',
											'class':'ui-btn-left'
		}).text("back") );

	$gContent = $('<div>').attr({'id':'game-content','data-role':'content'})
		.appendTo($page);
	
	$gContent.append( $("<canvas>", {'id':'breakanoid'}) );
	$gContent.append( $("<a>", {'data-role':'button', 'onclick':'startBreakanoid()'}).text('Breakanoid!') );
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
		}).text("zurück") );

	$gContent = $('<div>').attr({'id':'game-content','data-role':'content'})
		.appendTo($page);

	var type = q.type;
	$gContent.append( $('<h3>').html(q.text) );

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

			$('<label>').attr({'for':'answer-'+i}).html(q.answers[i].text)
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
		
		failCount = 0;
		$solution = q.answer.sol;
		$tolerances = q.answer.tolerances;

		$('<input>').attr({	'type':'text',
									'data-clear-btn':true,
									'id':'q-input',
									'placeholder':'Deine Antwort'
			}).appendTo($gContent);

		$checkBtn = $('<a>').attr({'data-role':'button'})
			.text("Check!").click( function() {
				
					$qInput = $('#q-input');
					$res = parseInt( $qInput.val() );

					if ( isNaN( $res ) == true )
						//no failcount necessary
						popResultEstimate($solution, -1, 0, 0);
					
					else {
						$diff = Math.abs( $res - $solution );
						$toll = $tolerances.length;
						$notInTol = true;

						for (var i = 0; i < $toll; i++){

							if ($diff <= $tolerances[i]) {
								$notInTol = false;
								console.log("DEBUG: estimate score: "+($toll -i)*20);
								popResultEstimate($solution, $res, i, ($toll - i)*20);
								updateScore( ($toll - i)*20 );
								updateXP(30);
								break;
							}
							if ($notInTol == false)
								popResult(1, 0);
						}
					}
			}).appendTo($gContent);

		local_score_max = 30;	
		$gHead.toolbar();
		$gContent.enhanceWithin();
	}

// INPUT PROCESSING
	if (type == "input") {

		$('<input>').attr({	'type':'text',
									'data-clear-btn':true,
									'id':'q-input',
									'placeholder':'Deine Antwort'
			}).appendTo($gContent);
		
		$checkBtn = $('<a>').attr({'data-role':'button'})
			.text("Check!").click( function() {
				if ($('#q-input').val() == q.answer.sol) {
					//TODO
					console.log("richtig");
				}
			}).appendTo($gContent);
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
		popResult(0, local_score);
		updateXP(local_score_max);
		updateScore(local_score);
		updateIndicators();
		return true;
	}
	else{
		failCount--;
		popResult(1, local_score);
		
		if (failCount == 0) {	
			updateIndicators();
		}
	}
	return false;
}

function sacrificeScore(){

	console.log("sacrificing!");
	updateXP(local_score_max);
	updateScore( (-2) * local_score_max );
}

function popResultEstimate(sol, res, tol, score) {

	var title = "Schätzfrage";
	var text = "Du hast "+res+" geschätzt. Die Lösung ist "+sol
						+". Du liegst damit ";

	switch(tol) {
		case 0:
			text += "genau richtig! Super! "+score+" Punkte gehen an dich!";break;
		case 1: 
			text += "ziemlich nah dran! "+score+" Punkte für dich!"; break;
		case 2:
			text += "nicht schlecht. "+score+" Punkte!"; break;
		case 3:
			text += "voll daneben. Leider nur "+score+" Punkte.";break;
	}

	$popUp = $("<div/>").popup({
		theme: 'b',
		overlayTheme: 'b',
		transition: "pop",
	});
	
	// input failed
	if (res == -1) {
		title = "Falsche Eingabe!";
		$("<p/>", {'text':"Keine Zahl in der Eingabe. Bitte ein n eingeben mit n ∈ ℕ!"}).appendTo($popUp);
		$("input[id=q-input]").val('');
	}
	else {
		$("<p/>", {'text':text}).appendTo($popUp);

		$popUp.on("popupafterclose", function() {
			$(this).remove();
			$(':mobile-pagecontainer').pagecontainer('change', '#map-page');
		});
	}

	// create popup header
	$("<div/>", {
		'data-role': "header",
		'data-theme': "b"
	}).append( $("<h1>", {'text':title}) ).prependTo($popUp);

	// display popup
	$popUp.popup("open", {'overlayTheme': "b"}).trigger("create");
}

function popResult(res, local_score) {

	// score points to subtract, if fail
	var sacrifice = local_score_max * 2;

	// create popup container
	$popUp = $("<div/>").popup({
		theme: 'b',
		overlayTheme: 'b',
		transition: "pop",
	});
	
	// correct answer or lost
	if (res == 0 || failCount == 0)
		$popUp.on("popupafterclose", function() {
			$(this).remove();
			$(':mobile-pagecontainer').pagecontainer('change', '#map-page');
		});

	var title = "";
	var text = "";

	switch(res){
		// correct
		case 0:
			title = "Yeah!";
			text = "Herzlichen Glückwunsch! Du hast die Frage richtig beantwortet und "
						+ local_score + " von " + local_score_max + " Punkten erzielt!";
		
			$("<p/>", {'text':text}).appendTo($popUp);
			break;
		// wrong
		case 1:
			title = "Oh weh!";
			text = "Leider nicht korrekt.";
			
			// last try ..
			if (failCount == 1) {

				text += " Nur noch ein Versuch übrig.";
				$("<p/>", { text : text }).appendTo($popUp);
			}
			// over!
			else if (failCount == 0) {
		
				text += " Diese Aufgabe bringt dir keine Punkte. Du kannst, um deine Erfahrung für diese Aufgabe zu retten, "
					+ sacrifice + " Punkte vom Punktestand opfern. Andernfalls geht auch diese verloren. Möchtest du Punkte opfern?"
	
				$("<p/>", { 'text':text }).appendTo($popUp);
				$popUp.attr("data-dismissable", false);
				
				$("<a/>", {	'text':"Nein!",
								'data-role':"button",
								'data-rel':'back'
					}).appendTo($popUp);
	
				$("<a/>", {	'text':"OK!",
								"onclick":"sacrificeScore()",
								'data-role':"button",
								'data-rel':'back'
					}).appendTo($popUp);
	
			}
			// wrong, but tries left
			else {
	
				text += " Nochmal probieren! Noch "+failCount+" Versuche übrig."
				$("<p/>", {'text': text }).appendTo($popUp);
			}

			break;
	}

	// create popup header
	$("<div/>", {
		'data-role': "header",
		'data-theme': "b"
	}).append( $("<h1>", {'text':title}) ).prependTo($popUp);

	// display popup
	$popUp.popup("open", {'overlayTheme': "b"}).trigger("create");
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
	
	global_xp += parseInt(xp);

	setCookie("xp", global_xp);

	if (smallWidth == false)
		setXPBar(global_xp);
	else
		setXPCircle(global_xp);
}

function updateScore(score) {

	global_score += parseInt(score);

	if (global_score < 0)
		global_score = 0;
	
	setCookie("score", global_score);
	
	if (smallWidth == false)
		setScoreBar(global_score);
	else
		setScoreCircle(global_score);
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
	$xpCon = $("#xp-container").empty();
	$scoreCon = $("#score-container").empty();

	$xpCon.append( $("<div>", {'class':'circle-desc'}).text('XP (in %)') ).append( $("<div>", {'id':'xp-circle'}) );
	$scoreCon.append( $("<div>", {'class':'circle-desc'}).text('Punkte') ).append( $("<div>", {'id':'score-circle'}) );

	// circle js code
	var score_c = $('#score-circle').circleProgress({
		value: 100,
		size: 35,
		fill: { color: '#ff1e41' } 
	});

	var xp_c = $('#xp-circle').circleProgress({
		value: global_xp/100,
		size: 35,
		fill: { color: '#55ff11' }
	});

	score_c.on('circle-animation-progress', function(e, v) {
		var obj = $(this).data('circle-progress'),
			ctx = obj.ctx,
			s = obj.size,
			sv = (global_score * v).toFixed(),
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
         sv = (global_xp * v).toFixed(),
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

function setScoreCircle(x) {$('#score-circle').circleProgress('value', 100);}

function setXPCircle(x) {$('#xp-circle').circleProgress('value', x/100);}

function setXPBar(x){

	var progressBarWidth = x * $('#xp-bar').width() / 100;
	$('#xp-bar').find('div').animate({ width: progressBarWidth }, 500).html(x + "%");
}

function setScoreBar(x){

	var progressBarWidth = $('#score-bar').width();
	$('#score-bar').find('div').animate({ width: progressBarWidth }, 500).html(x);
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
