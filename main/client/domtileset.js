var DomTileSet = function (container, tileset) {
    var frame = $('<div id="wordgame-tileset"></div>').appendTo(container); //.css('position', 'relative');
    var selected = null;
    tileset.getTiles().forEach(function (tile, index) {
       $(frame).append($('<div>' + tile.getLetter() + ' ' + tile.getValue() + '</div>').width(30).height(30).css({
            //'position': 'absolute',
            //'top': 100 + index * 25 + 'px', 
            //'left': x * 25 + 'px',
            'border': '1px solid black',
            'text-align': 'center',
            'float': 'left'
       }).click(function () {
           selected = {tile: tile, el: this};
       })); 
    });
}
exports.DomTileSet = DomTileSet;

