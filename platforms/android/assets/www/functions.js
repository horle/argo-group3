var failCount;

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

function check(){ 
	//get checked radio button value
	var res = document.querySelector('input[name="question"]:checked')
	if (res === null){
		return null;
	}
	else
		res = res.value;
	
	if (res == "true"){
//		score += failCount * 10;
		swal("Richtig!", "Gut gemacht. Auf zu neuen Aufgaben ...", "success");

	} else {

		failCount--;
		if (failCount == 0){
			swal("Vergeigt!", "Für diese Aufgabe gibt es leider keine Punkte.", "error");
		}
		return false;
	}
}
