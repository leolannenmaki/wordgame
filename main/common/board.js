/**
 * @constructor
 * @param {number} size The length of board sides.
 * @param {function(string):boolean} wordValidator The validator used to
 * validate played words.
 * on the board.
 */
function Board(size, wordValidator) {
    this.size = size;
    this.xy = [];
    this.yx = [];
    this.wordValidator = wordValidator || function(word) { return true; };
    for (var i = 0; i < size; i += 1) {
       this.xy[i] = [];
       this.yx[i] = [];
       for (var j = 0; j < size; j += 1) {
            this.xy[i][j] = this.yx[i][j] = ' ';
       }
    }
}
Board.prototype = {
    getSize: function() {
        return this.size;
    },
    set: function(x, y, c) {
       if (x < this.size && y < this.size &&
           typeof c === 'string' && c.length == 1) {
           this.xy[y][x] = this.yx[x][y] = c;
           return this;
       }
       throw new Error('Out of bounds or invalid type');
    },
    isValid: function() {
        var self = this;
        return isValid(this.xy) && isValid(this.yx);
        function isValid(board) {
            return board.map(function(row) {
            return row.join('').trim();
            }).filter(function(word) {
                return word.length > 1;
            }).every(function(word) {
                return self.wordValidator(word);
            });
        }

    },
    toString: function() {
        var y = 0, ret = '';
        for (; y < this.size; y += 1) {
            ret += '[' + this.xy[y].join('') + ']\n';
        }
        return ret;
    },
    eachTile: function(fn) {
        var x = 0, y = 0, ret = '';
        for (; y < this.size; y += 1) {
            for (x = 0; x < this.size; x += 1) {
                fn(x, y, this.xy[y][x]);
            }
        }
    }
};
/**
 * @see Board
 */
exports.Board = Board;

