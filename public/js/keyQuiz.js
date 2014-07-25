;(function() {
var app = window.KeyQuiz = window.KeyQuiz || { };

var namedIntervals = {
    '0_0': 'Unison',
    '1_1': 'Minor2nd',
    '1_2': 'Major2nd',
    '2_3': 'Minor3rd',
    '2_4': 'Major3rd',
    '3_5': 'Perfect4th',
    '3_6': 'Augmented4th',
    '4_6': 'Diminished5th',
    '4_7': 'Perfect5th',
    '4_8': 'Augmented5th',
    '5_8': 'Minor6th',
    '5_9': 'Major6th',
    '6_9': 'Diminished7th',
    '6_10': 'Minor7th',
    '6_11': 'Major7th',
    '7_12': 'Octave'
};
var intervalsByName = { };
_.each(namedIntervals, function(name, intervalKey) {
    intervalsByName[name] = intervalKey;
});

var Interval = app.Interval = function(letterSteps, steps) {
    this.letterSteps = letterSteps;
    this.steps = steps;
    
    this.name = function() {
        var namedIntervalKey = this.letterSteps + '_' + this.steps;
        if (namedIntervals[namedIntervalKey])
            return namedIntervals[namedIntervalKey];
        return namedIntervalKey;
    }
    this.keyFunction = function() {

    }
};

Interval.fromName = function(name) {
    var intervalKey = intervalsByName[name];
    var sep = intervalKey.indexOf('_');
    var letterSteps = parseInt(intervalKey.substr(0, sep));
    var steps = parseInt(intervalKey.substr(sep + 1));
    return new Interval(letterSteps, steps);
};
})();
(function() {
var app = window.KeyQuiz = window.KeyQuiz || { };

var degrees = [
    'I',
    'II',
    'III',
    'IV',
    'V',
    'VI',
    'VII'
];

function isMajory(keyFn) {
    return keyFn.quality == 'Major' || keyFn.quality == 'Major7' || keyFn.quality == 'Dominant7';
}

var KeyFunction = app.KeyFunction = function(degree, accidental, quality) {
    this.degree = degree;
    this.accidental = accidental;
    this.quality = quality;

    this.toString = function() {
        var acc = (this.accidental == -1) ? 'b' : ((this.accidental == 1) ? '#' : '');

        var numeral = degrees[this.degree];
        if (!isMajory(this))
            numeral = numeral.toLowerCase();

        var qual = '';
        if(this.quality == 'Major7')
            qual = '^7';
        else if (this.quality == 'Dominant7')
            qual = '7';
        else if (this.quality == 'Minor7')
            qual = 'm7';
        else if (this.quality == 'Diminished')
            qual = 'dim'
        else if (this.quality == 'Diminished7')
            qual = 'dim7';
        else if (this.quality == 'Minor7Flat5')
            qual = 'm7b5';

        return acc + numeral + qual;
    };

    this.toInterval = function() {
        var steps = [ 0, 2, 4, 5, 7, 9, 11, 12 ];
        return new app.Interval(this.degree, steps[this.degree] + this.accidental);
    }
};

KeyFunction.fromInterval = function(interval, quality) {
    var key = interval.letterSteps + '_' + interval.steps;
    var validIntervals = {
        '0_0': [0, 0],
        '1_1': [1, -1],
        '1_2': [1, 0],
        '1_3': [1, 1],
        '2_3': [2, -1],
        '2_4': [2, 0],
        '3_4': [3, -1],
        '3_5': [3, 0],
        '3_6': [3, 1],
        '4_6': [4, -1],
        '4_7': [4, 0],
        '4_8': [4, 1],
        '5_8': [5, -1],
        '5_9': [5, 0],
        '5_10': [5, 1],
        '6_10': [6, -1],
        '6_11': [6, 0],
        '7_12': [7, 0]
    };
    var d = validIntervals[key];
    return new KeyFunction(d[0], d[1], quality);
}
})();
(function() {
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
})();
(function() {
var app = window.KeyQuiz = (window.KeyQuiz || {});

var fileVersion = 1;

app.Progression = Backbone.Model.extend({
    defaults: function() {
        return { 
            key: 'A',
            chords: [ ]
        };
    }
});
})();
(function() {
var app = window.KeyQuiz = window.KeyQuiz || { };
var test = app.test = app.test || { };

// Print out all the notes in a key
app.test.printKey = function(startingNote, isMajor) {
    var steps = isMajor ? [ 2, 2, 1, 2, 2, 2, 1 ] : [ 2, 1, 2, 2, 1, 2, 2 ];
    var str = startingNote.toString();
    var note = startingNote;
    _.each(steps, function(step) {
        note = note.add(new app.Interval(1, step));
        str += ' ' + note.toString();
    });
    console.log(str);
};

// Print out all the natural major and minor keys in cirle-of-fifths order
app.test.printAllKeys = function() { 
    function printKeys(startingNote, num, keyInterval, isMajor) {
        var note = startingNote;
        for (var i = 0; i < num; ++i) {
            test.printKey(note, isMajor);
            note = note.add(keyInterval);
        }    
    }
    console.log("Major Keys");
    printKeys(new app.Note('C'), 7, new app.Interval(4, 7), 1);
    printKeys(new app.Note('C'), 7, new app.Interval(3, 5), 1);

    console.log("\nMinor Keys:");
    printKeys(new app.Note('A'), 7, new app.Interval(4, 7), 0);
    printKeys(new app.Note('A'), 7, new app.Interval(3, 5), 0);
};

app.test.testIntervals = function() {
    var interval = new app.Interval(4, 6);
    console.log("Converting interval to friendly name gives: " + interval.name());
    var name = "Major6th";
    var interval = app.Interval.fromName(name);
    console.log("Creating interval from name '" + name + "' gives " + JSON.stringify(interval));
};

app.test.test251s = function() {
    var key = new app.Note('C');
    console.log("Printing 251s in a few keys");
    var functions = [
        new app.KeyFunction(1, 0, 'Minor7'),
        new app.KeyFunction(4, 0, 'Dominant7'),
        new app.KeyFunction(0, 0, 'Major7')
    ]
    for (var i = 0; i < 6; ++i) {
        var str = '';
        _.each(functions, function(keyFn) {
            var interval = keyFn.toInterval();
            var note = key.add(interval);
            str += note.toString() + ' ';
        });
        console.log(str);
        key = key.add(new app.Interval(3, 5));
    }
}

app.test.testAll = function() {
    app.test.printAllKeys();
    app.test.testIntervals();
    app.test.test251s();
};})();
