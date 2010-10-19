/**
 * A tile
 * @constructor
 * @param {string} letter
 * @param {number} value
 */
function Tile(letter, value) {
    this.letter = (letter || ' ').toUpperCase();
    this.value = value || 0;
}
Tile.fromJson = function (json) {
    var data = null;
    if (typeof json === 'string') {
        data = JSON.parse(json);
    } else {
        data = json;
    }
    if (data.letter !== undefined && data.value !== undefined) {
        return new Tile(String(data.letter), Number(data.value));
    }
    throw {
        name: 'Error',
        message: 'Data did not contain letter and value'
    };
};
Tile.prototype = {
    /**
     * @return {number} The value
     */
    getValue: function() {
        return this.value;
    },
    /**
     * @return {string} The letter
     */
    getLetter: function() {
        return this.letter;
    },
    toJson: function () {
        return {
            letter: this.getLetter(),
            value: this.getValue()
        };
    }
};

exports.Tile = Tile;
