// A simple CLI program for interacting with notes and stuff
var readline = require('readline');
var Note = require('./src/js/Note.js').Note;
var Interval = require('./src/js/Interval.js').Interval;

var rl = readline.createInterface({
  	input: process.stdin,
  	output: process.stdout
});


function askOne(callback) {
	var interval = Interval.random();
	var note = Note.random();
	var question = "\nWhat is a " + interval.name() + " above " + note.toString() + "?\n"
	rl.question(question, onResponse);

	// Called when the user types an answer
	function onResponse(answer) {
		try {
  			var userResponse = new Note(answer);
  		} catch (e) {
  			// Invalid response. Repeat the question
  			console.log();
  			rl.question(e + '\n' + question, onResponse);
  			return;
  		}
  		var correctResponse = note.add(interval);
  		if (userResponse.equals(correctResponse)) {
  			console.log("Correct.");
  			callback(true);
  		}
  		else {
  			console.log("Wrong. Correct Answer is " + correctResponse.toString());
  			callback(false);
  		}  		
	}
	
}

// Repeatedly ask questions
function quiz() {
	var nCorrect = 0;
	var nAsked = 0;
	function askOneCallback(answeredCorrectly) {
		++nAsked;
		if (answeredCorrectly)
			++nCorrect;
		console.log ("\nScore: " + nCorrect + " / " + nAsked + " ("  + Math.floor(nCorrect / nAsked * 100) + "%)");
		askOne(askOneCallback);
	}
	askOne(askOneCallback);
}

// Start the quiz
quiz();
