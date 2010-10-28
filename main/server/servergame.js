var path = require('path'),
    common = require(path.normalize(__dirname + '/../common')),
    Game = common.Game,
    TileSet = common.TileSet,
    wordValidator = require('./wordValidator').wordValidator;

function ServerGame(players) {
    this.boardSize = 10;
    this.game = new Game(this.boardSize, wordValidator, new TileSet());
    this.playerData = players;
    this.playerNames = [];
    this.playerData.forEach(function(pd) {
        pd.serverGame = this;
        this.playerNames.push(pd.player.getName());
        this.game.addPlayer(pd.player);
    }.bind(this));
    var tileSet = new TileSet();
    this.game.startGame();
    console.log(this.game.whosTurn().getName());
    console.log(this.playerData[0].player.getName());

    this.playerData.forEach(function(pdm, i) {
       pdm.client.gameEvent('wordgame.newGame', this.boardSize);
       if (i === 0) {
           pdm.client.gameEvent('wordgame.addPlayer', pdm.player.toJson());
       }
       this.playerData.forEach(function(pds, j) {
           if (i !== j) {
                pdm.client.gameEvent('wordgame.addOpponent',
                    pds.player.getName());
           }
       });
       if (i !== 0) {
           pdm.client.gameEvent('wordgame.addPlayer', pdm.player.toJson());
       }
       pdm.client.gameEvent('wordgame.startGame');
    }.bind(this));
}
/**
 * @param {string} name The name of the game event.
 */
ServerGame.prototype.gameEvent = function(name) {
    console.log('Event name: ', name);
    var params = Array.prototype.slice.call(arguments, 1);
    console.log('Params: ', params);

    var methodName = name.split('.')[1];
    if (typeof this.game[methodName] === 'function') {
        console.log('valid method', methodName);
        var returnValue = this.game[methodName].apply(this.game, params);
        if (methodName === 'endTurn') {
            var client = this.playerData[this.game.inTurn].client;
            console.log('client');
            returnValue.forEach(function(placement) {
                console.log(placement);
                client.gameEvent('wordgame.setTile',
                    placement.x, placement.y, placement.c);
            });
            client.gameEvent('wordgame.endTurn');
        }
    }
};
/**
 * @constructor
 * @param {Array.<Player>} players The players.
 */
exports.ServerGame = ServerGame;
