var failCount;
var stopBreakanoid = false;
var localMaxScore;
var difficulty;
var newLevel = false; //bool to indicate that level has changed
var wonGame; //bool to indicate that game is over, to delete quiz buttons

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

		checkLevelUp();
	}
	// Execute on load
	checkWidth();
	// Bind event listener
	$(window).resize(checkWidth);
}

function resetPoints(){

	updateLevel(-1);
	setCookie("won",0);
	updateXP((-1)*globalXP);
	updateScore((-1)*globalScore);
	updateIndicators();
}

function invokeGamePage(id) {

	//array of questions for certain object
	var qArray = questions[id];
	var q = qArray.quests[Math.floor(Math.random() * qArray.quests.length)];
	var type = q.type;
	var outro = qArray.outro;
	
	if (wonGame == false && (type == "mc" || type == "estimate" || type == "input") ) {

		prepareQuiz(q, outro);
	}
	else {
		
		prepareBreakanoid();
	}
	$(':mobile-pagecontainer').pagecontainer('change', '#game-page');
}

function checkLevelUp(){

	console.log("checkLevelUp called!");
	
	if (newLevel == true) {
		
		showLevelupPopup();
		newLevel = false;
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
		}).click( function() {stopBreakanoid = true;}).text("back") );

	$gContent = $('<div>').attr({'id':'game-content','data-role':'content'})
		.appendTo($page);
	
	$gContent.append( $("<canvas>", {'id':'breakanoid'}) );
	$gContent.append( $("<a>", {'data-role':'button', 'onclick':'startBreakanoid()'}).text('Start Breakanoid!') );
	
	$gContent.enhanceWithin();
	$gHead.toolbar();
}

function prepareQuiz(q, outro) {

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

		$('<a>',{'data-role':'button'}).text("Check!")
			.click( function(){checkQuiz(outro)}.bind(outro) ).appendTo($gContent);
		
		failCount = q.answers.length - 1;
		localMaxScore = failCount * 10;	

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
								popResultEstimate(outro, $solution, $res, i, ($toll - i)*20);
								updateScore( ($toll - i)*20 );
								updateXP(30);
								break;
							}
						}
						if ($notInTol == true)
							popResult(1, 0);
					}
			}.bind(outro) ).appendTo($gContent);

		localMaxScore = 30;	
		$gHead.toolbar();
		$gContent.enhanceWithin();
	}

// INPUT PROCESSING
	if (type == "input") {

		failCount = 3;
		$('<input>').attr({	'type':'text',
									'data-clear-btn':true,
									'id':'q-input',
									'placeholder':'Deine Antwort'
			}).appendTo($gContent);
		
		$checkBtn = $('<a>').attr({'data-role':'button'})
			.text("Check!").click( function() {

				if ($('#q-input').val() == q.answer) {
					popResult(0, 40);
					updateScore(localMaxScore);
					updateXP(40);
				}
				else{
					failCount--;
					popResult(1,failCount*20);
					if (failCount == 0)
						updateIndicators();
				}
			}.bind(outro) ).appendTo($gContent);
		
		localMaxScore = 40;
		$gHead.toolbar();
		$gContent.enhanceWithin();
	}
}

function checkQuiz(outro){ 
	//get checked radio button value
	var res = $('input[name=q-answers]:checked');
	var localScore = failCount * 10;
	
	if (res == null){
		console.log("CARE: res == null");
		return null;
	}
	else
		res = res.val();
	
	if (res == "true"){
		popResult(0, localScore, outro);
		updateXP(localMaxScore);
		updateScore(localScore);
		updateIndicators();
		return true;
	}
	else{
		failCount--;
		popResult(1, localScore);
		
		if (failCount == 0) {	
			updateIndicators();
		}
	}
	return false;
}

function sacrificeScore(){

	console.log("sacrificing!");
	updateXP(localMaxScore);
	updateScore( (-2) * localMaxScore );
}

function popResultEstimate(outro, sol, res, tol, score) {

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
	$pCon = $("<div/>",{'data-role':'content'}).appendTo($popUp);
	
	// input failed
	if (res == -1) {
		title = "Falsche Eingabe!";
		$("<p/>", {'text':"Keine Zahl in der Eingabe. Bitte ein n eingeben mit n ∈ ℕ!"}).appendTo($pCon);
		$("input[id=q-input]").val('');
	}
	else {
		$("<p/>", {'text':text}).appendTo($pCon);
		$("<p/>", {'text':outro}).appendTo($pCon);

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

	$pCon.enhanceWithin();
	$popUp.popup();

	// display popup
	$popUp.popup("open", {'overlayTheme': "b"}).trigger("create");
}

function popResult(res, localScore, outro) {

	// score points to subtract, if fail
	var sacrifice = localMaxScore * 2;

	// create popup container
	$popUp = $("<div/>").popup({
		theme: 'b',
		overlayTheme: 'b',
		transition: "pop",
	});
	$pCon = $("<div/>").attr({'data-role':'content'}).appendTo($popUp);
	
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
						+ localScore + " von " + localMaxScore + " Punkten erzielt!";
		
			$("<p/>", {'text':text}).appendTo($pCon);
			$("<p/>", {'text':outro}).appendTo($pCon);
			break;
		// wrong
		case 1:
			title = "Oh weh!";
			text = "Leider nicht korrekt.";
			
			// last try ..
			if (failCount == 1) {

				text += " Nur noch ein Versuch übrig.";
				$("<p/>", {'text':text}).appendTo($pCon);
				$pCon.append( $("<img>",{'src':'img/wrong.gif','id':'gif'}) );
			}
			// over!
			else if (failCount == 0) {
		
				text += " Diese Aufgabe bringt dir keine Punkte. Du kannst, um deine Erfahrung für diese Aufgabe zu retten, "
					+ sacrifice + " Punkte vom Punktestand opfern. Andernfalls geht auch diese verloren. Möchtest du Punkte opfern?"
	
				$("<p/>", { 'text':text }).appendTo($pCon);
				$popUp.attr("data-dismissible", false);
				
				$("<a/>", {	'text':"Nein!",
								'data-inline':'true',
								'data-role':"button",
								'data-rel':'back'
					}).appendTo($pCon);
	
				$("<a/>", {	'text':"OK!",
								"onclick":"sacrificeScore()",
								'data-role':"button",
								'data-inline':'true',
								'data-rel':'back'
					}).appendTo($pCon);
	
			}
			// wrong, but tries left
			else {
	
				text += " Nochmal probieren! Noch "+failCount+" Versuche übrig."
				$("<p/>", {'text': text }).appendTo($pCon);
				$pCon.append( $("<img>",{'src':'img/wrong.gif','id':'gif'}) );
			}

			break;
	}

	// create popup header
	$("<div/>", {
		'data-role': "header",
		'data-theme': "b"
	}).append( $("<h1>", {'text':title}) ).prependTo($popUp);
	
	$pCon.enhanceWithin();

	// display popup
	$popUp.popup("open", {'overlayTheme': "b"}).trigger("create");
}

function updateIndicators() {

	if (smallWidth == false) {
		setXPBar(globalXP);
		$('#xp-container p:first-child').text('XP (% von Level '+(currentLevel+1)+'):');
		setScoreBar(globalScore);
	}
	else {
		setXPCircle(globalXP);
		setScoreCircle(globalScore);
	}
}

function updateXP(xp) {

	var localXP = parseInt(xp);
	if (globalXP + localXP >= story.levels[currentLevel].xp) {

		globalXP = (globalXP + localXP) - story.levels[currentLevel].xp;
		newLevel = updateLevel();
	}
	else	
		globalXP += localXP;

	setCookie("xp", globalXP);

	if (smallWidth == false)
		setXPBar(globalXP);
	else
		setXPCircle(globalXP);
}

function updateLevel(lvl) {

	if (lvl == -1)
		currentLevel = -1;

	if (currentLevel != story.levels[story.levels.length -1].id){

		currentLevel++;
		setCookie("level", currentLevel);
		return true;
	}
	return false;
}


function showLevelupPopup() {

	var title, text;

	//create popup
	$popUp = $("<div/>",{'data-role':'popup'}).popup({
		theme: 'b',
		overlayTheme: 'b',
		transition: "pop",
		width: "400px"
	});
	// popup content
	$pCon = $("<div>",{'data-role':'content','role':'main'}).appendTo($popUp);

	if (currentLevel != story.levels[story.levels.length -1].id){
		title = "Level up! Neuer Titel: " + story.levels[currentLevel].name;
		text = story.levels[currentLevel].levelup;
		
		$("<p>", {'text': text}).appendTo($pCon);
	}
	else{
		wonGame = true;
		setCookie("won", 1);
		updateXP(-globalXP);

		$popUp.popup({dismissible:false});
		title = "Herzlichen Glückwunsch!";
		text = story.levels[currentLevel].levelup; 
		var text2 = 'Du hast "Life of Julius" gewonnen. Dein Highscore beträgt: '+globalScore+' Punkte! Wenn du willst, kannst du von Neuem anfangen, du kannst aber auch nochmal alle Orte besuchen. Dort findest du jetzt interessante Details zum jeweiligen Objekt. Spiel neu starten?';
		$("<p>", {'text': text}).appendTo($pCon);
		$("<p>", {'text': text2}).appendTo($pCon);
		$("<a/>", {	'text':"Nein!",
						'data-role':"button",
						'data-inline':'true',
						'data-rel':'back'
			}).appendTo($pCon);
	
		$("<a/>", {	'text':"OK!",
						"onclick":"resetPoints()",
						'data-role':"button",
						'data-inline':'true',
						'data-rel':'back'
			}).appendTo($pCon);
	}

	// popup header
	$("<div/>", {
		'data-role': "header",
		'data-theme': "b"
	}).append( $("<h1>", {'text':title}) ).prependTo($popUp);

	// display popup
	$popUp.enhanceWithin().popup("open", {'overlayTheme': "b"});
}

function updateScore(score) {

	globalScore += parseInt(score);

	if (globalScore < 0)
		globalScore = 0;
	
	setCookie("score", globalScore);
	
	if (smallWidth == false)
		setScoreBar(globalScore);
	else
		setScoreCircle(globalScore);
}

function initBars(){

	$xpCon = $("#xp-container").empty();
	$scoreCon = $("#score-container").empty();

	$xpCon.append( $('<p>').text('XP (% von Level '+(currentLevel+1)+'):') );
	$xpBar = $('<div>').attr({	'class':'progressbar tiny-green',
										'id':'xp-bar'
		}).appendTo($xpCon).append( $('<div>') ).append( $('<p>',{'id':'xp-percent'}) );

	$scoreCon.append( $('<p>').text('Punktestand:') );
//TODO: tiny-red
	$scoreBar = $('<div>').attr({	'class':'progressbar tiny-green',
											'id':'score-bar'
		}).appendTo($scoreCon).append( $('<div>') );
}

function initCircles(){

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
		value: globalXP/100,
		size: 35,
		fill: { color: '#55ff11' }
	});

	score_c.on('circle-animation-progress', function(e, v) {
		var obj = $(this).data('circle-progress'),
			ctx = obj.ctx,
			s = obj.size,
			sv = (globalScore * v).toFixed(),
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
         sv = (globalXP * v).toFixed(),
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

function setXPCircle(x) {

	var percentage = (x / story.levels[currentLevel].xp);
	$('#xp-circle').circleProgress('value', percentage);
}

function setXPBar(x){

	var percentage = (x / story.levels[currentLevel].xp);
	var progressBarWidth = percentage * $('#xp-bar').width();
	$('#xp-bar').find('div').first().animate({ width: progressBarWidth }, 500);
	$('#xp-percent').html(Math.round(percentage*100) + "%");
}

function setScoreBar(x){

	var progressBarWidth = $('#score-bar').width();
	$('#score-bar').find('div').animate({ width: progressBarWidth }, 500).html(x);
}

function setCookie(name, value) {

	document.cookie = name + "=" + value;
	console.log("set "+name+" to "+value);
}

//DEBUG
function printStats() {

	console.log('Score: ' + globalScore);
	console.log('level: ' + currentLevel+', '+story.levels[currentLevel].name);
	console.log('xp: '+globalXP+"/"+story.levels[currentLevel].xp);
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
