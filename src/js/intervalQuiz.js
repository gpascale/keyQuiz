var Note = exports.Note;
var Interval = exports.Interval;

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
    interval = Interval.random();
    $('.interval').text(interval.name());
    note = Note.random();
    $('.note.lhs span').text(note.toString());
    $('.note.rhs span').text('');
}
