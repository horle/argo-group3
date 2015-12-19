var failCount;

function popQuestion(id) {
	
	//get question by id
	var q = questions.questions[id];
	
	//create divs for quest overlay
	var quest = document.createElement("div");
	quest.setAttribute("id",'quest-ol');
	var header = document.createElement("h2");
	header.setAttribute("id", 'quest-head');
	var text = document.createElement("p");
	text.setAttribute("id", 'quest-text');
	var answers = document.createElement("form");
	answers.setAttribute("id", "quest-answers");

	document.body.appendChild(quest);
	quest.appendChild(header);
	quest.appendChild(text);
	quest.appendChild(answers);
	
	//fill divs with content
	quest.style.display = "block";
	header.innerHTML = q.title;
	text.innerHTML = q.text;

	//counter for wrong answers. one less than number of possibilities
	failCount = q.answers.length - 1;
	
	//create radio buttons for answers	
	for (var i = 0; i < q.answers.length; i++) {
		
		var input = document.createElement("input");
		input.setAttribute("type", "radio");
		input.setAttribute("name", "radios");
		input.setAttribute("value", q.answers[i].correct);
		answers.appendChild(input);
		answers.appendChild(document.createTextNode(q.answers[i].text));
		answers.appendChild(document.createElement("br"));
	
		if (i == q.answers.length -1) {
			var check = document.createElement("button");
			check.setAttribute("type", "button");
			check.innerHTML = "Prüfen!";
			check.setAttribute("onClick", "check()");
			answers.appendChild(check);
		}
	}
}

function check(){ 
	//get checked radio button value
	var res = document.querySelector('input[name="radios"]:checked').value;
	
	if (res == "true"){
		swal("Richtig!", "Gut gemacht. Auf zu neuen Aufgaben ...", "success");
		closeQuestion();
	} else {
		failCount--;
		swal("Leider falsch!", "Noch "+failCount+" Versuche übrig.", "error");
		
		if (failCount == 0)
			closeQuestion();
	}
}

function closeQuestion(){
	var element = document.getElementById("quest-ol");
	element.parentNode.removeChild(element);
}
