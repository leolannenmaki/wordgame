var DNode = require('dnode'),
    path = require('path'),
    common = require(path.normalize(__dirname + '/../common')),
    Player = common.Player,
    httpServer = require('./httpserver').httpServer,
    ServerGame = require('./servergame').ServerGame;

httpServer.listen(6061);

var waitingPlayers = [],
    games = [],
    numberOfPlayersPerGame = 2;


DNode(function(client) {
    var playerData;
    this.register = function(name) {
        playerData = {
            serverGame: null,
            name: name,
            client: client,
            player: new Player(name)
        };
        waitingPlayers.push(playerData);

        if (waitingPlayers.length === numberOfPlayersPerGame) {
            games.push(new ServerGame(waitingPlayers));
            waitingPlayers = [];
            return;
        }
        client.info('Waiting for other players');
    };
    this.gameEvent = function() {
        playerData.serverGame.gameEvent.apply(playerData.serverGame, arguments);
    };
}).listen({
    protocol: 'socket.io',
    server: httpServer,
    transports: ['websocket']
});

