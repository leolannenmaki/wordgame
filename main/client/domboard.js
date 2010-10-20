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
                $(this).css('border-color', 'red');
            }
       }));
    });
}
exports.DomBoard = DomBoard;
