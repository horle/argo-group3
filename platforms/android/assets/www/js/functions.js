var failCount;
var local_score_max;
var difficulty;

function renderBars(){
	//store the references outside the event handler!
	var $window = $(window);

	function checkWidth() {
		var windowsize = $window.width();
		if (windowsize > 440) {
			initBars();
		}
		else
			initCircles();
	}
	// Execute on load
	checkWidth();
	// Bind event listener
	$(window).resize(checkWidth);
}

function callQuiz(id) {

	prepareQuiz(id);
	$(':mobile-pagecontainer').pagecontainer('change', '#game-page');
}

function prepareQuiz(id) {

	//array of questions for certain object
	var q_array = questions[id].quests;
	var q = q_array[Math.floor(Math.random() * q_array.length)];

	$("#quiz-q").html(q.text);
	var type = q.type;
		
	if (type == "mc") {
	
		var rad = "";
	   //create radio buttons for answers  
		for (var i = 0; i < q.answers.length; i++) {

			rad += "<input type='radio' name='answers' id='answer-"+i+"' value='"
				+ q.answers[i].correct + "'><label for='answer-"+i+"'>" + q.answers[i].text + "</label>";
		}
		
		failCount = q.answers.length - 1;
		local_score_max = failCount * 10;
		$("#quiz-a").html(rad);
	}
	if (type == "estimate") {
		
		var solution = q.answer.sol;
		var tolerances = q.answer.tolerances;
	}
	if (type == "input") {

	}
}

function checkQuiz(){ 
	//get checked radio button value
	var res = $('input[name=answers]:checked');
	var local_score = failCount * 10;
	
	if (res == null){
		return null;
	}
	else
		res = res.val();
	
	if (res == "true"){
		popResult(true, local_score);
		high_score += local_score;
	}
	else{
		failCount--;
		popResult(false, local_score);
	}
	return false;
}

function popResult(res, local_score) {

	// score points to subtract, if fail
	var sacrifice = local_score_max * 2;

	var $popUp = $("<div/>").popup({
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
	var text = res == true ? "Herzlichen Glückwunsch! Du hast die Frage richtig beantwortet und "+local_score+" von "+local_score_max+" Punkten erzielt!" : "Leider nicht korrekt.";

	$("<div/>", {
		'data-role': "header",
		'data-theme': "b"
	}).append($("<h1>", {text:title})).appendTo($popUp);
	
	if (res == false) {
		if (failCount == 1) {
			text += " Nur noch ein Versuch übrig.";
			$("<p/>", { text : text }).appendTo($popUp);
		}
		else if (failCount == 0) {
			text += " Diese Aufgabe bringt dir keine Punkte. Du kannst, um deine Erfahrung für diese Aufgabe zu retten, "+sacrifice+" Punkte vom Highscore opfern. Möchtest du das?";
			$("<p/>", { text : text, "data-dismissable" : false }).appendTo($popUp);
//TODO: ADD EVENT FUNCTION
			$("<a/>", { text: "Nein!", href: "#", class: "ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b", "data-rel":"back" }).appendTo($popUp);
			$("<a/>", { text: "OK!", href: "#", class: "ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-a", "data-rel":"back" }).appendTo($popUp);
		}
		else {
			text += " Nochmal versuchen! Noch "+failCount+" Versuche übrig."
			$("<p/>", { text : text }).appendTo($popUp);
		}
	} else
		$("<p/>", { text : text }).appendTo($popUp);

	$popUp.popup("open", {overlayTheme: "b"}).trigger("create");
}

function initBars(){

	console.log("bars initialising");

	$("#xp-container").addClass("progressbar tiny-green").html("<div></div>");
	$("#score-container").addClass("progressbar tiny-green").html("<div></div>");
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

function setXPBar(x){

	var progressBarWidth = x * $('#xp-container').width() / 100;
	$('#xp-container').find('div').animate({ width: progressBarWidth }, 500).html(x + "% ");
}
function getXPBar(){

	return $('#xp-circle').circleProgress('value');
}
function setScoreBar(x){

	var progressBarWidth = x * $('#score-container').width() / 100;
	$('#score-container').find('div').animate({ width: progressBarWidth }, 500).html(x + "% ");
}
function getScoreBar(){

	return $('#score-circle').circleProgress('value');
}

