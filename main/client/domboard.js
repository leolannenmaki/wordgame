var DomBoard = function (container, board) {
    var frame = $('<div id="wordgame-board"></div>').appendTo(container).css('position', 'relative');
    var inputField = $('<input id=wordgame-board-input-field type="text" />').hide().appendTo(frame);
    var inputSubmit = $('<input id=wordgame-board-input-submit type="button" value="OK"/>').hide().click(function () {
        try {
          board.set(selected.x, selected.y, inputField.val());
          $(selected.el).html(inputField.val());
        } catch (e) {
            alert('NO');
            return false;
        }
        inputField.hide();
        inputSubmit.hide();
    }).appendTo(frame);
    var selected = null;
    board.eachTile(function (x, y, c) {
       $(frame).append($('<div>' + c + '</div>').width(25).height(25).css({
            'position': 'absolute',
            'top': 100 + y * 25 + 'px', 
            'left': x * 25 + 'px',
            'border': '1px solid black',
            'text-align': 'center'
       }).click(function () {
           selected = {x: x, y: y, el: this};
           inputField.show();
           inputSubmit.show();
       })); 
    });
}
exports.DomBoard = DomBoard;
