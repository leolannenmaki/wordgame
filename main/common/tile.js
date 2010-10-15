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
Tile.prototype = {
    /**
     * @return {number} The value
     */
    getValue: function() {return this.value;},
    /**
     * @return {string} The letter
     */
    getLetter: function() {return this.letter;}
};

exports.Tile = Tile;
