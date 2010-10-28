var Tile = require('./tile').Tile;
/**
 * @constructor
 * @param {string} name The name of the player.
 * @param {Array.<Tile>} tiles The starting tiles for the player.
 * @param {number=} points The starting points for the player.
 */
function Player(name, tiles, points) {
    this.name = name;
    this.tiles = tiles || [];
    this.points = points || 0;
}
/**
 * @param {string|object} json A representation of the player in JSON string or
 * JSON object.
 * @return {Player} A player constructed from the given string or object.
 */
Player.fromJson = function(json) {
    var data = null;
    if (typeof json === 'string') {
        data = JSON.parse(json);
    } else {
        data = json;
    }
    if (data.name !== undefined && data.points !== undefined) {
        var tiles = [];
        if (data.tiles && data.tiles.length) {
            data.tiles.map(function(tile) {
                tiles.push(Tile.fromJson(tile));
            });
        }
        return player = new Player(String(data.name), tiles, Number(data.points));
    }
    throw new Error('Data did not contain name and points');
};
Player.prototype = {
    getName: function() {return this.name},
    addTile: function(tile) {
        console.log(this.name + ' got Tile: ' + tile.getLetter());
        this.tiles.push(tile);
        return this;
    },
    getTiles: function() {
        return this.tiles;
    },
    removeTile: function(character) {
        console.log('From: ' + this.name + ' removing ' + character);
        for (var i = 0; i < this.tiles.length; i++) {
            if (this.tiles[i].getLetter() === String(character)) {
                return this.tiles.splice(i, 1)[0];
            }
        }
        throw new Error('Player doesn\'t have that tile anymore');
    },
    getPoints: function() {
        return this.points;
    },
    addPoints: function(points) {
        return this.points += points;
    },
    toJson: function() {
        return {
            name: this.name,
            tiles: this.tiles.map(function(tile) {
                return tile.toJson();
            }),
            points: this.points
        };
    }
};
/**
 * @see Player
 */
exports.Player = Player;
