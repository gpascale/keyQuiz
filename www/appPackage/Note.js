// ##IFDEF NODE
if (typeof _ === 'undefined') {
    _ = require('underscore');
}
// #ENDIF

var Note = exports.Note = function(letter, accidental) {
    if (!letter) {
        throw "Invalid note. Must contain a letter";
    }
    if (letter.length > 2) {
        throw "Invalid note: Must contain a letter in the range A - G and optional accidental (# or b)";
    }
    if (!/[A-G]/.test(letter[0].toUpperCase())) {
        throw "Invalid note. Letter must be in the range A - G";
    }
    if (letter.length == 2) {
        if (letter[1] != '#' && letter[1] != 'b') 
            throw "Invalid accidental symbol: Must be # or b";
        this.letter = letter[0].toUpperCase();
        this.accidental = letter[1] == '#' ? 1 : -1
    }
    else {
        this.letter = letter[0].toUpperCase();
        this.accidental = accidental || 0;
    }

    this.add = function(interval) {
        var steps = interval.steps;
        var curLetter = this.letter;
        for (var i = 0; i < interval.letterSteps; ++i) {
            if (curLetter == 'B' || curLetter == 'E')
                steps--;
            else
                steps -= 2;
            curLetter = nextLetter(curLetter);
        }
        return new exports.Note(curLetter, this.accidental + steps);
    };

    this.intervalTo = function(otherNote) {
        var ret = [ 0, 0 ];
        var curLetter = this.letter
        while(curLetter != otherNote.letter) {
            ret[0] += 1;
            ret[1] += stepsToNextLetter(curLetter);
            curLetter = nextLetter(curLetter);
        }
        return new exports.Interval(ret[0], ret[1] - this.accidental + otherNote.accidental);
    }

    this.equals = function(otherNote) {
        return this.letter == otherNote.letter &&
               this.accidental == otherNote.accidental;
    }

    this.toString = function() {
        var accString = '';
        if (this.accidental < 0)
            for (var i = 0; i > this.accidental; --i)
                accString += 'b';
        else
            for (var i = 0; i < this.accidental; ++i)
                accString += '#';
        return this.letter + accString;
    }
};

Note.random = function() {
    var name = _.sample(['Ab', 'A', 'A#', 'Bb', 'B', 'C', 'C#', 'Db', 
                         'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'G#']);
    return new Note(name);
};

// Helpers

function nextLetter(letter) {
    if (letter == 'G')
        return 'A';
    else if (letter == 'A')
        return 'B';
    else if (letter == 'B')
        return 'C';
    else if (letter == 'C')
        return 'D';
    else if (letter == 'D')
        return 'E';
    else if (letter == 'E')
        return 'F';
    else if (letter == 'F')
        return 'G';
    return 'X';
}

function stepsToNextLetter(letter) {
    var steppage = {
        'A': 2,
        'B': 1,
        'C': 2,
        'D': 2,
        'E': 1,
        'F': 2,
        'G': 2
    };
    return steppage[letter] ? steppage[letter] : 0;
}