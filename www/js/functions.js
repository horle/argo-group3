var failCount;

function callQuiz(id) {

	prepareQuiz(id);
	$(':mobile-pagecontainer').pagecontainer('change', '#game-page');
}

function prepareQuiz(id) {

	var q = questions[id].easy[1];
	$("#quiz-q").html(q.text);

	var rad = "";
   //create radio buttons for answers  
   for (var i = 0; i < q.answers.length; i++) {

      rad += "<input type='radio' name='answers' id='answer-"+i+"' value='"
         + q.answers[i].correct + "'><label for='answer-"+i+"'>" + q.answers[i].text + "</label>";
   }
	failCount = q.answers.length - 1;
	$("#quiz-a").html(rad);
}
/*
function popQuestion(id) {
	
	//get question by id
	var q = questions.questions[id];

	//counter for wrong answers. one less than number of possibilities
	failCount = q.answers.length - 1;
	
	var rad = "";
	//create radio buttons for answers	
	for (var i = 0; i < q.answers.length; i++) {
		
		rad += "<div class=\"answer\"><input class=\"visibleInput\" type=\"radio\" name=\"question\" value="
			+ q.answers[i].correct + "><span>" + q.answers[i].text + "</span></div><br>";
	}
	
	var that = this;
	swal({
		title: q.title,
		text: q.text + "<br>"+rad,
		html: true,
		closeOnConfirm: false
	}, function() {
			ret = that.check();
			if (ret === false){
				if (failCount === 1)
					swal.showInputError("Leider falsch! Noch 1 Versuch übrig.");
				else
					swal.showInputError("Leider falsch! Noch "+failCount+" Versuche übrig.");
					
				return false;
			} else
			if (ret === null)
				swal.showInputError("Bitte eine Antwort auswählen!");
		}
	);
}
*/
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
//		score += failCount * 10;
		console.log("answer correct");
		popResult(true, failCount);
	}
	else{
		failCount--;
		popResult(false, failCount);
	}
	return false;
	
}

function popResult(res, fail) {

	console.log("popresult called, res="+res);
	var $popUp = $("<div/>").popup({
		theme: 'a',
		overlayTheme: 'b',
		transition: "pop",
	});
	if (res == true || fail == 0)
		$popUp.on("popupafterclose", function() {
			$(this).remove();
			$(':mobile-pagecontainer').pagecontainer('change', '#map-page');
		});

	var title = res == true ? "Sieg!" : "Falsch!";
	var text = res == true ? "Herzlichen Glückwunsch! Du hast es geschafft." : "Leider nicht korrekt.";

	$("<div/>", {
		'data-role': "header",
		'data-theme': "a"
	}).append($("<h1>", {text:title})).appendTo($popUp);
	
	if (res == false)
		if (failCount == 1)
			text += " Noch 1 Versuch übri.";
		else if (failCount == 0)
			text += " Diese Aufgabe bringt dir keine Punkte.";
		else
			text += " Noch "+failCount+" Versuche übrig.";
				
	$("<p/>", { text : text }).appendTo($popUp);
	$popUp.popup("open", {overlayTheme: "a"}).trigger("create");
}


// circle js code
$('xp-circle').circleProgress({
    value: 0.6
}).on('circle-animation-progress', function(event, progress) {
    $(this).find('strong').html(parseInt(100 * progress) + '<i>%</i>');
});
