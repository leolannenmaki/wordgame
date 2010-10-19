var DNode = require('dnode'),
    path = require('path'),
    common = require(path.normalize(__dirname + '/../common')),
    Player = common.Player,
    httpServer = require('./httpserver').httpServer
    GameInProgress = require('./gameinprogress').GameInProgress;

httpServer.listen(6061);

var waitingPlayers = [],
    games = [],
    numberOfPlayersPerGame = 2;


DNode(function (client) {
    this.register = function () {
        client.getLoginName(function (name) {
            waitingPlayers.push({
                    client: client,
                    player: new Player(name)
            });            
            if (waitingPlayers.length === numberOfPlayersPerGame) {
                var playerData = [];
                for (var i = 0; i < numberOfPlayersPerGame; i++) {
                    playerData.push(waitingPlayers.shift());
                }
                games.push(new GameInProgress(playerData));
                return;
            } 
            client.info('Waiting for other players'); 
        });
    };
}).listen({
    protocol : 'socket.io',
    server : httpServer,
    transports : ['websocket']
});

