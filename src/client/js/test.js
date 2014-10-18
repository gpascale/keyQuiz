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
};