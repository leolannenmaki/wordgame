var common = require(path.normalize(__dirname + '/../common')),
    Game = common.Game,
    generateUuid = common.generateUuid,
    wordValidator = require('./wordValidator').wordValidator;

function GameInProgress (playerData) {
    this.game = new Game(10, generateUuid());
    this.playerData = playerData;
    this.playerNames = []; 
    this.playerData.forEach(function (pd) {
        this.playerNames.push(pd.player.getName());
        this.game.addPlayer(pd.player); 
    }.bind(this));
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
    var player = this.game.whosTurn();
    console.log('Player: ' + player.getName() + ' ended his turn');
    if (data !== undefined && data.placements !== undefined && data.placements.length) {
        console.log('Got placements!');
        data.placements.forEach(function (placement) {
            console.log(placement);
            this.game.set(this.playerNames[this.game.inTurn], placement.x, placement.y, placement.c);
        }.bind(this));
    }
    try {
        this.game.endTurn();
    } catch (e) {
        // Give turn again to the same player
    }
    console.log('Player has now ' + player.getPoints() + ' points');
    this.playerData[this.game.inTurn].client.yourTurn(this.endTurn.bind(this)); 
}
exports.GameInProgress = GameInProgress;
