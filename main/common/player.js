function Player(name) {
   this.name = name;
   this.tiles = [];
   this.points = 0;
}
Player.prototype = {
    getName: function() {return this.name},
    addTile: function(tile) {
        this.tiles.push(tile);
        return this;
    },
    getTiles: function() {
        return this.tiles;
    },
    removeTile: function(tile) {
        for (var i = 0; i < this.tiles.length; i++) {
            if (this.tiles[i].getLetter() === tile.toUpperCase()) {
                return this.tiles.splice(i, 1)[0];
            }
        };
        throw {
          name: 'Error',
          message: 'Player doesn\'t have that tile anymore'
        };
    },
    getPoints: function() {
        return this.points;
    },
    addPoints: function(points) {
        return this.points += points;
    }
};
exports.Player = Player;
