(function ($) {
    module('DomBoard');
    var Board = wordgame.require('common').Board, 
        DomBoard = wordgame.require('client').DomBoard;

    test('Board and DomBoad are loaded properly', function () {
        expect(2);
        ok(typeof Board === 'function');
        ok(typeof DomBoard === 'function');
    });
    
    test('DomBoard creates board size^2 divs', function () {
        expect(3);
        var board = new Board('2');
        board.set(0, 0, 'A').set(1, 0, 'B').set(0, 1, 'C').set(1, 1, 'D');
        var domBoad = new DomBoard('#wordgame', board);
        equals($('#wordgame-board div').size(), 4);
        equals($('#wordgame-board div').html(), 'A');
        equals($('#wordgame-board div:eq(2)').html(), 'C');
    });
    /*test('Dropping tiles on board fires an event', function () {
        var Board = wordgame.require('common/board').Board,
            board = new Board('2'),
            DomBoard = wordgame.require('client/domboard').DomBoard,
            domBoad = new DomBoard('#wordgame', board);
    });*/
})(jQuery);
