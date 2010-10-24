var DomBoard = function (container, board) {
    var frame = $('<div id="wordgame-board"></div>').appendTo(container).css('position', 'relative');
    board.eachTile(function (x, y, c) {
       $(frame).append($('<div>' + c + '</div>').width(25).height(25).css({
            'position': 'absolute',
            'top': 100 + y * 25 + 'px', 
            'left': x * 25 + 'px',
            'border': '1px solid black',
            'text-align': 'center'
       }).droppable({
            drop: function( event, ui ) {
                // if tile was empty on the turn start and nothing has been
                // added
                if (c === ' ' && $(this).text() === ' ') {
                    $(this).text(ui.draggable.find('span:first').text());
                    ui.draggable.remove().remove();
                    $('body').trigger('tile.set', [x, y, ui.draggable.find('span:first').text()]);
                }
            },
            activate: function (event, ui) {
                $(this).css('border-color', 'green');
            },
            deactivate: function (event, ui) {
                $(this).css('border-color', 'black');
            }
       }));
    });
}
exports.DomBoard = DomBoard;
