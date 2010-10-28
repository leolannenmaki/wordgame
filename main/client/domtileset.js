/**
 * @constructor
 * @param {string|jQuery} container The container where to append the tile set.
 * @param {Array.<Tile>} tiles The tiles to use in the set.
 */
function DomTileSet(container, tiles) {
    var frame = $('<div id="wordgame-tileset"></div>').appendTo(container);
    var selected = null;
    tiles.forEach(function(tile, index) {
       $(frame).append(
           $('<div>' +
               '<span class="letter">' + tile.getLetter() + '</span>' +
               '<span class="value">' + tile.getValue() + '</span>' +
               '</div>')
            .click(function() {
                selected = {tile: tile, el: this};
            }).draggable({'revert': true}));
    });
}
/**
 * @see DomTileSet
 */
exports.DomTileSet = DomTileSet;

