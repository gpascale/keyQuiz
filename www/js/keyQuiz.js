;(function(exports) {
this["KeyQuiz"] = this["KeyQuiz"] || {};
this["KeyQuiz"]["Templates"] = this["KeyQuiz"]["Templates"] || {};

this["KeyQuiz"]["Templates"]["intervalQuiz"] = function(data) {var __t, __p = '', __e = _.escape;__p += '<div class="intervalQuiz">\n    <div class="note lhs">\n        <span>\n            Bb\n        </span>\n    </div>\n    <div class="interval">\n        <span>\n            P 5th\n        </span>\n    </div>\n    <div class="note rhs">\n        <span></span>\n    </div>\n    <div class="result">\n    </div>\n</div>';return __p};
})((typeof exports === "undefined") ? (window.KeyQuiz = window.KeyQuiz || { }) : exports);
;(function(exports) {
// ##IFDEF NODE
if (typeof _ === 'undefined') {
    _ = require('underscore');
}
// #ENDIF

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

var Interval = exports.Interval = function(letterSteps, steps) {
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

Interval.random = function() {
    while(1) {
        var intervalName = _.sample(_.values(namedIntervals));
        return Interval.fromName(intervalName);
    }
}
})((typeof exports === "undefined") ? (window.KeyQuiz = window.KeyQuiz || { }) : exports);
;(function(exports) {
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

var KeyFunction = exports.KeyFunction = function(degree, accidental, quality) {
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
        return new exports.Interval(this.degree, steps[this.degree] + this.accidental);
    }

    this.intervalTo = function(otherKeyFn) {
        var scale = [ 2, 2, 1, 2, 2, 2, 1 ];
        var letterSteps = 0;
        var steps = 0;
        var curDegree = this.degree;
        while (curDegree != otherKeyFn.degree) {
            ++letterSteps;
            steps += scale[curDegree];
            curDegree = (curDegree + 1) % 7;
        }
        return new exports.Interval(letterSteps, steps - this.accidental + otherKeyFn.accidental);
    }
};

exports.KeyFunction.fromInterval = function(interval, quality) {
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
})((typeof exports === "undefined") ? (window.KeyQuiz = window.KeyQuiz || { }) : exports);
;(function(exports) {
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
})((typeof exports === "undefined") ? (window.KeyQuiz = window.KeyQuiz || { }) : exports);
;(function(exports) {
var Note = exports.Note;
var Interval = exports.Interval;
var KeyFunction = exports.KeyFunction;

var interval;
var startingNote;

$(document).ready(function() {
    var tmpl = exports.Templates.intervalQuiz;
    var $rendered = $(tmpl());
    $('body').append($rendered);

    $('body').keydown(function(e) {
        if (e.keyCode == 13) {
            try {
                var userResponse = new Note($('.note.rhs span').text().trim());
            }
            catch(e) {
                console.log(e);
                return;
            }
            var correctResponse = note.add(interval);
            if (userResponse.equals(correctResponse)) 
                $('.result').text("CORRECT").removeClass('incorrect').addClass('correct');
            else
                $('.result').text("WRONG").removeClass('correct').addClass('incorrect');
            $('.result').fadeIn(300);
            setTimeout(function() {
                $('.result').fadeOut(300);
            }, 1000);
            setTimeout(function() {
                askOne();
            }, 200);
            return;
        }
        var $textEl = $('.note.rhs span');
        var text = $textEl.text();
        if (!text)
            text = "  ";
        if (e.keyCode == 38) {
            if (text[1] == '#')
                text = text[0] + ' ';
            else
                text = text[0] + '#';
        }
        else if (e.keyCode == 40) {
            if (text[1] == 'b')
                text = text[0] + ' ';
            else
                text = text[0] + 'b';
        }
        else if (e.keyCode >= 65 && e.keyCode <= 71) {
            text = String.fromCharCode(e.keyCode).toUpperCase() + text[1];
        }
        $textEl.text(text);
    });

    askOne();
});

function askOne() {
    var key = new Note(_.sample([ 'C', 'F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb' ]));//, 'F', 'Bb', 'G', 'D' ]));
    var startingDegree = _.random(0, 6);
    var endingDegree = _.random(0, 6);
    var startingKeyFn = new KeyFunction(startingDegree, 0, 'Major7');
    var endingKeyFn = new KeyFunction(endingDegree, 0, 'Major7');
    interval = Interval.fromName('Perfect4th');//startingKeyFn.intervalTo(endingKeyFn);
    $('.interval').text(interval.name());
    note = key.add(startingKeyFn.toInterval());
    $('.note.lhs span').text(note.toString());
    $('.note.rhs span').text('');
}

})((typeof exports === "undefined") ? (window.KeyQuiz = window.KeyQuiz || { }) : exports);
;(function(exports) {
exports.ChordQuality = {
    Major: 'Major',
    Minor: 'Minor',
    Diminished: 'Diminished',
    Major7: 'Major7',
    Minor7: 'Minor7',
    Dominant7: 'Dominant7',
    Minor7Flat5: 'Minor7Flat5'
};


/*
exports.ChordFunction = {
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


/*
$(document).ready(function() {
    $('#container').append('<div class="helloWorld">Hello, World!</div>');
    exports.test.testAll();
    var majorKey = [
        Interval.Unison,
        Interval.Major2nd,
        Interval.Minor3rd,
        Interval.Perfect4th,
        Interval.Perfect5th,
        Interval.Major6th,
        Interval.Major7th
    ];
    

    var notes = [ new exports.Note('D'), new exports.Note('G'), new exports.Note('C'), new exports.Note('Bb') ];
    _.each(notes, function(note) {
        var interval = key.intervalTo(note);
        var fn = exports.KeyFunction.fromInterval(interval, 'Minor7');
        console.log(fn.toString());
    });
});
*/
})((typeof exports === "undefined") ? (window.KeyQuiz = window.KeyQuiz || { }) : exports);
;(function(exports) {
var fileVersion = 1;

exports.Progression = Backbone.Model.extend({
    defaults: function() {
        return { 
            key: 'A',
            chords: [ ]
        };
    }
});
})((typeof exports === "undefined") ? (window.KeyQuiz = window.KeyQuiz || { }) : exports);
;(function(exports) {
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
};})((typeof exports === "undefined") ? (window.KeyQuiz = window.KeyQuiz || { }) : exports);
