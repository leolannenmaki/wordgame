/**
 * @constructor
 * @param {string|jQuery} container The DOM element where to append the
 * board.
 * @param {Board} board The board to use.
 */
function DomBoard(container, board) {
    this.active = false;
    var frame = $('<div id="wordgame-board"></div>')
        .appendTo(container);
    var self = this;
    var tiles = [];
    this.tiles = tiles;
    board.eachTile(function(x, y, c) {
       var tile = $('<div>' + c + '</div>')
            .css({
                'top': 100 + y * 30 + 'px',
                'left': x * 30 + 'px'
            }).droppable({
            drop: function(event, ui) {
                // if tile was empty on the turn start and nothing has been
                // added
                if (self.active) {
                    var character = ui.draggable.find('span:first').text();
                    console.log('dropped ' + character);
                    ui.draggable.remove();
                    $('#wordgame').trigger('wordgame.setTile',
                        [x, y, character]);
                }
            },
            activate: function(event, ui) {
                $(this).css('border-color', 'green');
            },
            deactivate: function(event, ui) {
                $(this).css('border-color', 'black');
            }
       }).appendTo(frame);
       if (tiles.length === x) {
           tiles.push([]);
       }
       tiles[x].push(tile);
    });
}
/**
 * Set value of given coordinates to given value.
 * @param {number} x The x-coordinate.
 * @param {number} y The y-coordinate.
 * @param {string} c The character.
 */
DomBoard.prototype.setTile = function(x, y, c) {
    var tile = this.tiles[x][y];
    if (tile.text().trim().length === 0) {
       tile.text(c.trim().length > 0 ? c : '?');
    }
};
/**
 * Deactive the board so that tiles cannot be dropped on it.
 */
DomBoard.prototype.deactivate = function() {
    this.active = false;
};
/**
 * Active the board so that tiles can be dropped on it.
 */
DomBoard.prototype.activate = function() {
    this.active = true;
};
/**
 * @see DomBoard
 */
exports.DomBoard = DomBoard;
