var fileVersion = 1;

exports.Progression = Backbone.Model.extend({
    defaults: function() {
        return { 
            key: 'A',
            chords: [ ]
        };
    }
});