var Tile = require('./tile').Tile;
/**
 * @constructor
 * @param {string} name
 * @param {number=} points
 */
function Player(name, points) {
   this.name = name;
   this.tiles = [];
   this.points = points || 0;
}
Player.fromJson = function (json) {
    var data = null;
    if (typeof json === 'string') {
        data = JSON.parse(json);
    } else {
        data = json;
    }
    if (data.name !== undefined && data.points !== undefined) {
        var player = new Player(String(data.name), Number(data.points));
        if (data.tiles && data.tiles.length) {
            data.tiles.map(function (tile) {
                player.addTile(Tile.fromJson(tile));
            });
        }
        return player;
    }
    throw {
        name: 'Error',
        message: 'Data did not contain name and points'
    };
};
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
    },
    toJson: function () {
        return {
            name: this.name,
            tiles: this.tiles.map(function (tile) {
                return tile.toJson();
            }),
            points: this.points
        };
    }
};
exports.Player = Player;
