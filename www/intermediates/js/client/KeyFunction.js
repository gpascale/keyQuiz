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