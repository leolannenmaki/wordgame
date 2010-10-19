var DNode = require('dnode'),
    sys = require('sys'),
    fs = require('fs'),
    http = require('http'),
    path = require('path'),
    common = require(path.normalize(__dirname + '/../common')),
    Player = common.Player,
    Game = common.Game;

// load the html page and the client-side javascript into memory
var html = fs.readFileSync(path.normalize(__dirname + '/../../build/client.html')),
    jquery = fs.readFileSync(path.normalize(__dirname + '/../../build/jquery.js')),
    clientSide = fs.readFileSync(path.normalize(__dirname + '/../../build/wordgame-latest.js')),
    dnode = require('dnode/web').source();


// simple http server to serve pages and for socket.io transport
var httpServer = http.createServer(function (req,res) {
    if (req.url == '/dnode.js') {
        res.writeHead(200, { 'Content-Type' : 'text/javascript' });
        res.end(dnode);
    } else if (req.url == '/jquery.js') {
        res.writeHead(200, { 'Content-Type' : 'text/javascript' });
        res.end(jquery);
    } else if (req.url == '/client.js') {
        res.writeHead(200, { 'Content-Type' : 'text/javascript' });
        res.end(clientSide);
    } else {
        res.writeHead(200, { 'Content-Type' : 'text/html' });
        res.end(html);
    }
});
httpServer.listen(6061);

/**
 * Taken from http://www.broofa.com/Tools/Math.uuid.js
 */
function RFC4122v4UUID () { 
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    }).toUpperCase();
};
var waitingPlayers = [];
var games = [];
var numberOfPlayersPerGame = 2;
function GameInProgress () {
    this.game = new Game(10, RFC4122v4UUID());
    this.playerData = [];
    this.playerNames = []; 
    for (var i = 0; i < numberOfPlayersPerGame; i++) {
        var pd = waitingPlayers.shift();
        this.playerNames.push(pd.player.getName());
        this.game.addPlayer(pd.player); 
        this.playerData.push(pd);
    }
    this.game.start();
    
    // Start first turn 
    this.playerData.forEach(function (pd, index) {
       pd.client.setPlayer(pd.player.toJson());
       pd.client.info('You are playing with: ' + this.playerNames.slice(index - 1, 1).concat(this.playerNames.slice(index + 1, 4)).join(', '));
       if (index === 0) {
           pd.client.yourTurn(this.endTurn.bind(this));
       }
    }.bind(this));
}
GameInProgress.prototype.endTurn = function (data) {
    if (data !== undefined && data.placements !== undefined && data.placements.length) {
        data.placements.forEach(function (placement) {
            this.game.set(this.playerNames[this.game.inTurn], placement.x, placement.y, placement.c);
        }.bind(this));
    }
    try {
        this.game.endTurn();
    } catch (e) {
        // Give turn again to the same player
    }
    this.playerData[this.game.inTurn].client.yourTurn(this.endTurn.bind(this)); 
}
// share an object with DNode over socket.io on top of the http server
DNode(function (client) {
    this.register = function () {
        client.getLoginName(function (name) {
            waitingPlayers.push({
                    client: client,
                    player: new Player(name)
            });            
            if (waitingPlayers.length === 2) {
                games.push(new GameInProgress());
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

