var Board = require('./board').Board,
    TileSet = require('./tileset').TileSet;
/**
 * @constructor
 * @param {number} size
 * @param {string=} uuid
 */
var Game = function (size, uuid) {
    this.size = size;
    this.uuid = uuid || 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
    // TODO: set the wordvalidator on server
    this.board = new Board(this.size);
    this.players = [];
    this.inTurn = 0;
    this.turnBuffer = [];
    this.tileSet = new TileSet();
}
Game.prototype = {
    /**
     * @param {Player} player
     */
    addPlayer: function (player) {
        this.players.push(player);
        return this;
    },
    start: function () {
        if (this.players < 2) {
            throw {
                name: 'Error',
                message: 'Not enough players'
            };
        }
        this.tileSet.giveStartingTilesTo(this.players);
        return this;
    },
    whosTurn: function () {
        return this.players[this.inTurn]; 
    },
    set: function (player, x, y, c) {
        var name = isString(player) ? player : player.getName();
        if (name !== this.whosTurn().getName()) {
            throw {
                name: 'Error',
                message: 'Invalid player'
            };
        }
        this.turnBuffer.push({
            x: x,
            y: y,
            c: (c || ' ').toUpperCase()
        });
        return this;
    },
    endTurn: function () {
        var self = this,
            points = this.turnBuffer.reduce(function (sum, placement) {
                self.board.set(placement.x, placement.y, placement.c);
                return sum += self.whosTurn().removeTile(placement.c).getValue();
           }, 0);
        this.whosTurn().addPoints(points);
        if (this.inTurn + 1 === this.players.length) {
            this.inTurn = 0;
        } else {
            this.inTurn++;
        }
    },
   toString: function () {
        return this.board.toString();
    }
};
function isString(s) {
	return typeof s === "string" || s instanceof String;
}

exports.Game = Game;
