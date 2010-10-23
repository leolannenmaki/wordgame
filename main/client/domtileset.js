var DomTileSet = function (container, tiles) {
    var frame = $('<div class="wordgame-tileset"></div>').appendTo(container); //.css('position', 'relative');
    var selected = null;
    tiles.forEach(function (tile, index) {
       $(frame).append($('<div><span class="letter">' + tile.getLetter() + '</span><span class="value">' + tile.getValue() + '</span></div>').width(30).height(30).css({
            //'position': 'absolute',
            //'top': 100 + index * 25 + 'px', 
            //'left': x * 25 + 'px',
            'border': '1px solid black',
            'text-align': 'center',
            'float': 'left',
            'cursor': 'pointer'
       }).click(function () {
           selected = {tile: tile, el: this};
       }).draggable({'revert': true})); 
    });
}
exports.DomTileSet = DomTileSet;

