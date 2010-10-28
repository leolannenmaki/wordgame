var Board = require('./board').Board,
    TileSet = require('./tileset').TileSet;
/**
 * @constructor
 * @param {number} size The length of the board's sides.
 * @param {function(string):boolean} wordValidator The validator used to
 * validate played words.
 * words on the board.
 * @param {TileSet=} tileSet The tiles used for the game.
 */
function Game(size, wordValidator, tileSet) {
    this.size = size;
    this.board = new Board(this.size, wordValidator);
    this.players = [];
    this.inTurn = 0;
    this.turnBuffer = [];
    // on the client side game doesn't control tileset
    this.tileSet = tileSet || null;
}
Game.prototype = {
    addPlayer: function(player) {
        this.players.push(player);
        return this;
    },
    startGame: function() {
        if (this.players < 2) {
            throw new Error('Not enough players');
        }
        if (this.tileSet !== null) {
            this.tileSet.giveStartingTilesTo(this.players);
        }
        return this;
    },
    whosTurn: function() {
        return this.players[this.inTurn];
    },
    setTile: function(x, y, c) {
        console.log('Setting:', x, y, c);
        this.turnBuffer.push({
            x: x,
            y: y,
            c: (c || ' ').toUpperCase()
        });
        return this;
    },
    endTurn: function() {
        console.log('Ending ' + this.whosTurn().getName());
        var self = this,
            points = this.turnBuffer.reduce(function(sum, placement) {
                self.board.set(placement.x, placement.y, placement.c);
                return sum += Number(
                    self.whosTurn().removeTile(placement.c).getValue());
           }, 0);
        this.whosTurn().addPoints(points);
        if (this.inTurn + 1 === this.players.length) {
            this.inTurn = 0;
        } else {
            this.inTurn++;
        }
       var tempTurnBuffer = this.turnBuffer;
       this.turnBuffer = [];
       return tempTurnBuffer;
    },
    getBoard: function() {
        return this.board;
    },
    toString: function() {
        return this.board.toString();
    }
};
/**
 * @see Game
 */
exports.Game = Game;
