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