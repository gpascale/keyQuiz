var Note = exports.Note;
var Interval = exports.Interval;
var KeyFunction = exports.KeyFunction;

var interval;
var startingNote;
var mode = 0;

$(document).ready(function() {
    var tmpl = exports.Templates.intervalQuiz;
    var $rendered = $(tmpl());
    $('body').append($rendered);

    $('.modeSelector select').change(function() {
        mode = $(this).prop('selectedIndex');
        askOne();
    });

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

var circleOf4ths = [ 'C', 'F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'B', 'E', 'A', 'D', 'G' ];
var circleOf5ths = [ 'C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'G#', 'D#', 'A#', 'F' ];
var key = [ 'Unison', 'Major2nd', 'Major3rd', 'Perfect4th', 'Perfect5th', 'Major6th', 'Major7th' ];

function askOne() {
    switch(mode) {
        case 0:
            note = new Note(_.sample(circleOf4ths));
            interval = Interval.fromName('Perfect4th');
            break;
        case 1: 
            note = new Note(_.sample(circleOf5ths));
            interval = Interval.fromName('Perfect5th');
            break;
        case 2:
            note = new Note('C');
            interval = Interval.fromName(_.sample(key));
            break;
        case 3: {
            var c = new Note('C');
            note = c.add(Interval.fromName(_.sample(key)));
            var note2 = c.add(Interval.fromName(_.sample(key)));
            interval = note.intervalTo(note2);
            break;
        }
    }
    $('.interval').text(interval.name());
    $('.note.lhs span').text(note.toString());
    $('.note.rhs span').text('');
}

/*
    var key = new Note(_.sample([ 'C', 'Gb' ]));//, 'F', 'Bb', 'G', 'D' ]));
    var startingDegree = _.random(0, 6);
    var endingDegree = _.random(0, 6);
    var startingKeyFn = new KeyFunction(startingDegree, 0, 'Major7');
    var endingKeyFn = new KeyFunction(endingDegree, 0, 'Major7');
    interval = Interval.fromName('Perfect4th');//startingKeyFn.intervalTo(endingKeyFn);
*/
//    $('.interval').text(interval.name());
    //note = key.add(startingKeyFn.toInterval());
//    $('.note.lhs span').text(note.toString());
//    $('.note.rhs span').text('');
//}
