/**
 * A tile
 * @constructor
 * @param {string} letter Tiles letter.
 * @param {number} value Tiles value.
 */
function Tile(letter, value) {
    this.letter = (letter || ' ').toUpperCase();
    this.value = value || 0;
}
/**
 * @param {string|object} json A representation of the tile in JSON string or
 * JSON object.
 * @return {Tile} A tile constructed from the given string or object.
 */

Tile.fromJson = function(json) {
    var data = null;
    if (typeof json === 'string') {
        data = JSON.parse(json);
    } else {
        data = json;
    }
    if (data.letter !== undefined && data.value !== undefined) {
        return new Tile(String(data.letter), Number(data.value));
    }
    throw new Error('Data did not contain letter and value');
};
Tile.prototype = {
    /**
     * @return {number} The value of the tile.
     * @this {Tile}
     */
    getValue: function() {
        return this.value;
    },
    /**
     * @return {string} The letter of the tile.
     * @this {Tile}
     */
    getLetter: function() {
        return this.letter;
    },
    toJson: function() {
        return {
            letter: this.getLetter(),
            value: this.getValue()
        };
    }
};
/**
 * @see Tile
 */
exports.Tile = Tile;
