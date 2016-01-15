var failCount;
var local_score_max;
var difficulty;

function callQuiz(id) {

    console.log(id);
	prepareQuiz(id);
	$(':mobile-pagecontainer').pagecontainer('change', '#game-page');
}

function prepareQuiz(id) {

	//array of questions for certain object
	var q_array = questions[id].quests;
	var q = q_array[Math.floor(Math.random() * q_array.length)];

/*
	switch(difficulty) {
		case "easy":
			q = questions[id].easy[0]; break;
		default:
		case "intermediate":
			q = questions[id].intermediate[0]; break;
		case "hard":
			q = questions[id].hard[0]; break;	
	}
*/

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


// circle js code
$('#score-circle').circleProgress({
	value: 0.6,
	size: 40,
	fill: { color: '#ff1e41' } 
}).on('circle-animation-progress', function(event, progress) {
	$(this).find('strong').html(parseInt(24 * progress));
});

$('#xp-circle').circleProgress({
   value: 0.5,
   size: 40,
   fill: { color: '#55ff11' }
}).on('circle-animation-progress', function(event, progress) {
    $(this).find('strong').html(parseInt(87 * progress));
});

