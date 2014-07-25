var app = window.KeyQuiz = window.KeyQuiz || { };

app.ChordQuality = {
    Major: 'Major',
    Minor: 'Minor',
    Diminished: 'Diminished',
    Major7: 'Major7',
    Minor7: 'Minor7',
    Dominant7: 'Dominant7',
    Minor7Flat5: 'Minor7Flat5'
};


/*
app.ChordFunction = {
    I: Interval.Unison,
    bII: Interval.Minor2nd,
    II: Interval.Major2nd,
    bIII: Interval.Minor3rd,
    III: Interval.Major3rd,
    IV: Interval.Perfect4th,
    '#IV': Interval.Augmented4th,
    bV: Interval.Diminished5th,
    V: Interval.Perfect5th,
    bVI: Interval.Minor6th,
    VI: Interval.Major6th,
    bVII: Interval.Minor7th,
    VII: Interval.Major7th
};
*/

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
    return steppage[letter];
}

app.Note = function(letter, accidental) {
    if (letter.length > 2)
        throw "Invalid letter: " + letter;
    if (letter.length == 2) {
        if (letter[1] != '#' && letter[1] != 'b') 
            throw "Invalid note: " + letter;
        this.letter = letter[0];
        this.accidental = letter[1] == '#' ? 1 : -1
    }
    else {
        this.letter = letter;
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
        return new app.Note(curLetter, this.accidental + steps);
    };

    this.intervalTo = function(otherNote) {
        var ret = [ 0, 0 ];
        var curLetter = this.letter
        while(curLetter != otherNote.letter) {
            ret[0] += 1;
            ret[1] += stepsToNextLetter(curLetter);
            curLetter = nextLetter(curLetter);
        }
        return new app.Interval(ret[0], ret[1] - this.accidental + otherNote.accidental);
    }

    this.equals = function(otherNote) {
        return this.letter == otherNote.letter &&
               this.accidental == otherNote.letter;
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
}

$(document).ready(function() {
    $('#container').append('<div class="helloWorld">Hello, World!</div>');
    app.test.testAll();
    /*var majorKey = [
        Interval.Unison,
        Interval.Major2nd,
        Interval.Minor3rd,
        Interval.Perfect4th,
        Interval.Perfect5th,
        Interval.Major6th,
        Interval.Major7th
    ];*/
    
/*
    var notes = [ new app.Note('D'), new app.Note('G'), new app.Note('C'), new app.Note('Bb') ];
    _.each(notes, function(note) {
        var interval = key.intervalTo(note);
        var fn = app.KeyFunction.fromInterval(interval, 'Minor7');
        console.log(fn.toString());
    });
*/


});