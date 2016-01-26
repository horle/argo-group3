var questions = [
{
	'object': "nordtor",
	"quests": [
		{
			"text": "Wie hie&szlig; der erste r&ouml;mische Kaiser?",
			"type": "mc",
			"answers": [
				{	"text": "Nero",
					"correct": false	},
				{	"text": "Augustus",
					"correct": true	},
				{	"text": "Octavian",
					"correct": false	}
			]
		},{
			"text": "Wann wurde das Nordtor errichtet?",
			"type": "mc",
			"answers": [
				{	"text": "2. JH n. Chr.",
					"correct": true			},
				{	"text": "1. JH v. Chr.",
					"correct": false			},
				{	"text": "3. JH n. Chr.",
					"correct": false			}
			]
		},{ //HIERFUER NOCH EINGABE IMPLEMENTIEREN
			"text": "Nenne den Namen des bekannten Stadttores von Trier!",
			"type": "input",
			"answer": "Porta Nigra"
		},{
			"text": "Welche Funktionen hatten Stadttore au&szlig;er der Funktion eines Einlasses?",
			"type": "mc",
			"answers": [
				{	"text": "Zollamt",
					"correct": false			},
				{	"text": "Warenkontrolle",
					"correct": true			},
				{	"text": "Kultst&auml;tte",
					"correct": false			}
			]
		},{
			"text": "Nenne den lateinischen Schriftzug des Tores (dazu musst du ins RGM gehen). Gesucht ist die Langform.",
			"type": "input",
			"answer": "Colonia Claudia Ara Agrippinensium"
		}
	]
},{
	"object": "dionysos",
	"quests": [
		{// SCHAETZFRAGE IMPLEMENTIEREN
			"text": "Sch&auml;tze! Wie viele Steinchen (<i>tesserae</i>) wurden f&uuml;r das K&ouml;lner Dionysos-Mosaik in etwa aufgewendet?",
			"type": "estimate",
			"answer":
				{	"sol": 1500000,
					"tolerances": [0, 100000, 250000, 1000000]	}
		},{
			"text": "Mit welchem Gott verbindet man den Namen 'Dionysos'?",
			"type": "mc",
			"answers": [
				{	"text": "Gott der Unterwelt",
					"correct": false			},
				{	"text": "Gott der Festlichkeiten und des Weins",
					"correct": true			},
				{	"text": "Gott des Krieges",
					"correct": false			}
			]
		},{
			"text": "Wo und wann traten die ersten Mosaike auf?",
			"type": "mc",
			"answers": [
				{	"text": "&Auml;gypten im 4. JH v. Chr.",
					"correct": false			},
				{	"text": "Kreta im 2. JT v. Chr.",
					"correct": false			},
				{	"text": "Kleinasien im 8. JH",
					"correct": true			}
			]
		},{
			"text": "Was stellt das Mosaik dar?",
			"type": "mc",
			"answers": [
				{	"text": "Szenen um Dionysos, wilde Tiere",
					"correct": true			},
				{	"text": "Szenen von Schlachten",
					"correct": false			},
				{	"text": "Erotische Szenen um Dionysos",
					"correct": false			}
			]
		}
	]
},{
	"object": "deutz",
	"quests": [
		{
			"text": "In welchem K&ouml;lner Stadtteil befindet sich das Kastell Divitia? (Antwort: K&ouml;ln-...)",
			"type": "input",
			"answer": "Deutz"
		},{
			"text": "Zu welchem Zweck errichtete man Kastelle in erster Linie?",
			"type": "mc",
			"answers": [
				{	"text": "Festungen",
					"correct": false			},
				{	"text": "Grenzsicherung",
					"correct": true			},
				{	"text": "Operationsbasen",
					"correct": false			}
			]
		},{
			"text": "Unter welchem r&ouml;mischen Kaiser wurde das Kastell errichtet?",
			"type": "mc",
			"answers": [
				{	"text": "Claudius",
					"correct": false			},
				{	"text": "Valentinian",
					"correct": false			},
				{	"text": "Constantin I.",
					"correct": true			}
			]
		},{// LOESUNG FEHLT NOCH
			"text": "Wo wurden Kastelle i.d.R. errichtet?",
			"type": "mc",
			"answers": [
				{	"text": "in der Provinz",
					"correct": false			},
				{	"text": "in Grenzn&auml;he",
					"correct": false			},
				{	"text": "im Barbaricum",
					"correct": false			}
			]	
		}
	]
},{
	"object": "kapitol",
	"quests": [
		{
			"text": "Welche Gottheiten wurden im Kapitolstempel verehrt?",
			"type": "mc",
			"answers": [
				{	"text": "Jupiter, Juno und Minerva",
					"correct": true			},
				{	"text": "Jupiter, Mars und Minerva",
					"correct": false			},
				{	"text": "Jupiter, Mars und Colonia",
					"correct": false			},
				{	"text": "Mars, Juno und Miverva",
					"correct": false			}
			]
		},{
			"text": "Wie wird die Gruppe der drei hier verehrten Gottheiten auch genannt?",
			"type": "mc",
			"answers": [
				{	"text": "R&ouml;mische Trias",
					"correct": false			},
				{	"text": "Kapitolinische Trias",
					"correct": true			},
				{	"text": "Aggripinensische Trias",
					"correct": false			},
				{	"text": "Ehrw&uuml;rdige Trias",
					"correct": false			}
			]
		},{
			"text": "Um was f&uuml;r einen Tempel-Typ wird es sich mit gro&szlig;er Wahrscheinlichkeit gehandelt haben?",
			"type": "mc",
			"answers": [
				{	"text": "Tempel dorischer Ordnung",
					"correct": false			},
				{	"text": "Gallo-r&ouml;mischer Umgangstempel",
					"correct": false			},
				{	"text": "R&ouml;misch-germanischer Tempel",
					"correct": false			},
				{	"text": "R&ouml;mischer Podiumstempel",
					"correct": true			}
			]
		}
	]
},{
	"object": "praetorium",
	"quests": [
		{
			"text": "Das Praetorium im antiken K&ouml;ln war der Amtssitz der/des r&ouml;mischen ...",
			"type": "mc",
			"answers": [
				{	"text": "Steuereintreibers.",
					"correct": false			},
				{	"text": "Censors.",
					"correct": false			},
				{	"text": "Statthalters.",
					"correct": true			},
				{	"text": "Aedilen",
					"correct": false			}
			]
		},{
			"text": "Das r&ouml;mische K&ouml;ln war Bestandteil welcher r&ouml;mischen Provinz?",
			"type": "mc",
			"answers": [
				{	"text": "Germania Inferior",
					"correct": true			},
				{	"text": "Germania Superior",
					"correct": false			},
				{	"text": "Gallien",
					"correct": false			},
				{	"text": "Raetien",
					"correct": false			}
			]
		},{
			"text": "Urspr&uuml;nglich war das Praetorium ...",
			"type": "mc",
			"answers": [
				{	"text": "die Werkstatt eines Legionslagers.",
					"correct": false			},
				{	"text": "der Verpflegungsbereich eines Legionslagers.",
					"correct": false			},
				{	"text": "das Zelt des Befehlshabers eines Legionslagers.",
					"correct": true			},
				{	"text": "die Waffenkammer eines Legionslagers.",
					"correct": false			}
			]
		}
	]
},{
	"object": "ubier",
	"quests": [
		{
			"text": "Aus welchem Material besteht das Monument?",
			"type": "mc",
			"answers": [
				{	"text": "Marmor",
					"correct": false			},
				{	"text": "Ziegel",
					"correct": false			},
				{	"text": "Tuffstein",
					"correct": true			},
				{	"text": "Schiefer",
					"correct": false			}
			]
		},{
			"text": "Wer oder was ist/sind 'Ubier'?",
			"type": "mc",
			"answers": [
				{	"text": "Kaiser, unter dessen Herrschaft Rom gegr&uuml;ndet wurde",
					"correct": false			},
				{	"text": "In der Gegend um K&ouml;ln lebender Germanenstamm",	
					"correct": true			},
				{	"text": "Ranghohe Offiziere im r&ouml;mischen Heer",
					"correct": false			},
				{	"text": "Zur Kaiserzeit im Rhein heimischer Speisefisch",
					"correct": false			}
			]
		},{
			"text": "In welchem Jahr wurde das Ubiermonument vermutlich errichtet?",
			"type": "mc",
			"answers": [
				{	"text": "4 oder 5 n. Chr.",
					"correct": true			},
				{	"text": "22-20 v. Chr.",
					"correct": false			},
				{	"text": "273 n. Chr.",
					"correct": false			},
				{	"text": "ca. 200 v. Chr.",
					"correct": false			}
			]
		},{
			"text": "Das Fundament des Monuments besteht aus einem Gemisch aus Kalk, Sand und Steinchen, das beim Trocknen erh&auml;rtert. Wie hei&szlig;t ein weiteres, f&uuml;r die Konstruktion r&ouml;mischer Go&szlig;bauten essentielles Material?",
			"type": "mc",
			"answers": [
				{	"text": "Hypokaust",
					"correct": false			},
				{	"text": "Murus Romanus",
					"correct": false			},
				{	"text": "Opus Caementitium",
					"correct": true			},
				{	"text": "Lateres Similiter Imperantur",
					"correct": false			}
			]
		}
	]
},{
	"object": "roemerturm",
	"quests": [
		{
			"text": "Vom Turm aus kann man bis &uuml;ber den Rhein, und damit die Grenze des r&ouml;mischen Reiches sehen. Wie wurde das Land hinter dem Rhein von den R&ouml;mern genannt?",
			"type": "mc",
			"answers": [
				{	"text": "Germania Superior",
					"correct": false			},
				{	"text": "Germania Magna",
					"correct": true			},
				{	"text": "Raetien",
					"correct": false			},
				{	"text": "Belgica",
					"correct": false			}
			]
		},{
			"text": "Der Turm ist in die Stadtmauer eingegliedert und besch&uuml;tzte mit ihr die Stadt vor Eindringlingen. Wie viele solcher T&uuml;rme gibt es insgesamt?",
			"type": "mc",
			"answers": [
				{	"text": "5",
					"correct": true			},
				{	"text": "13",
					"correct": false			},
				{	"text": "19",
					"correct": false			},
				{	"text": "32",
					"correct": false			}
			]
		},{
			"text": "Die Au&szlig;enwand des Turmes ist mit verschiedenfarbigen Steinen reich verziert. Von welchem Material fehlt aber jede Spur?",
			"type": "mc",
			"answers": [
				{	"text": "Kalkstein",
					"correct": false			},
				{	"text": "Sandstein",
					"correct": false			},
				{	"text": "Trachyt",
					"correct": false			},
				{	"text": "Porphyrit",
					"correct": true			}
			]
		}
	]
}
];
