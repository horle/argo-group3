var failCount;
var local_score_max;
var difficulty;

function callQuiz(id) {

    console.log(id);
	prepareQuiz(id);
	$(':mobile-pagecontainer').pagecontainer('change', '#game-page');
}

function prepareQuiz(id) {

	//array of questions with certain difficulty
	var q;

	switch(difficulty) {
		case "easy":
			q = questions[id].easy[0]; break;
		default:
		case "intermediate":
			q = questions[id].intermediate[0]; break;
		case "hard":
			q = questions[id].hard[0]; break;	
	}

	$("#quiz-q").html(q.text);

	var rad = "";
		
	if (q.type == "mc") {
	   //create radio buttons for answers  
		for (var i = 0; i < q.answers.length; i++) {

			rad += "<input type='radio' name='answers' id='answer-"+i+"' value='"
				+ q.answers[i].correct + "'><label for='answer-"+i+"'>" + q.answers[i].text + "</label>";
		}
		
		failCount = q.answers.length - 1;
		local_score_max = failCount * 10;
		$("#quiz-a").html(rad);
	}
	if (q.type == "input") {
		

	}
	if (q.type == "estimate") {

	}
}

function checkQuiz(){ 
	console.log("check quiz called");
	//get checked radio button value
	var res = $('input[name=answers]:checked');
	
	if (res === null){
		return null;
	}
	else
		res = res.val();
	
	if (res == "true"){
		console.log("answer correct");
		popResult(true);
	}
	else{
		failCount--;
		popResult(false);
	}
	return false;
}

function popResult(res) {

	var local_score = failCount * 10;

	var $popUp = $("<div/>").popup({
		theme: 'a',
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
		'data-theme': "a"
	}).append($("<h1>", {text:title})).appendTo($popUp);
	
	if (res == false)
		if (failCount == 1)
			text += " Noch 1 Versuch übrig.";
		else if (failCount == 0)
			text += " Diese Aufgabe bringt dir keine Punkte.";
		else
			text += " Nochmal versuchen! Noch "+failCount+" Versuche übrig.";
				
	$("<p/>", { text : text }).appendTo($popUp);
	$popUp.popup("open", {overlayTheme: "a"}).trigger("create");
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

