(function ($) {
    module('DomBoard');
    
    test('Board and DomBoad are loaded properly', function () {
        expect(2);
        ok(typeof wordgame.require('common/board').Board === 'function');
        ok(typeof wordgame.require('client/domboard').DomBoard === 'function');
    });
    
    test('DomBoard creates board size^2 divs', function () {
        expect(3);
        var Board = wordgame.require('common/board').Board,
            board = new Board('2');
        board.set(0, 0, 'A').set(1, 0, 'B').set(0, 1, 'C').set(1, 1, 'D');
        var DomBoard = wordgame.require('client/domboard').DomBoard,
            domBoad = new DomBoard('#wordgame', board);
        equals($('#wordgame-board div').size(), 4);
        equals($('#wordgame-board div').html(), 'A');
        equals($('#wordgame-board div:eq(2)').html(), 'C');
    });
})(jQuery);
