var score = 0;

function judge() {
 var degree;
	console.log(score);
// score = prompt("Wie viel hast du bekommt?");
 if (score > 100){
 degree = 'Verarschst du mich?';
 }
 else{
 switch (parseInt(score / 10)) {
 case 0:
 case 1:
 case 2:
 case 3:
 case 4:
 case 5:
 degree = "Herzlichen Glückwunsch! Bestehst du nicht...";
 break;
 case 6:
 degree = "knapp ausreichen";
 break;
 case 7:
 degree = "so la la"
 break;
 case 8:
 degree = "gut";
 break;
 case 9:
 case 10:
 degree = "Sehr gut!";
 }
 }
 alert(degree);
 }
