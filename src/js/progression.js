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