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



$(document).ready(function() {
    $('#container').append('<div class="helloWorld">Hello, World!</div>');
    exports.test.testAll();
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
    var notes = [ new exports.Note('D'), new exports.Note('G'), new exports.Note('C'), new exports.Note('Bb') ];
    _.each(notes, function(note) {
        var interval = key.intervalTo(note);
        var fn = exports.KeyFunction.fromInterval(interval, 'Minor7');
        console.log(fn.toString());
    });
*/


});