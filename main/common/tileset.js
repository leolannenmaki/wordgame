var Tile = require('./tile').Tile;
/**
 * @constructor
 * @param {string=} language
 */
function TileSet (language) {
    this.language = language || 'en';
    this.tiles = this.createSet();
}
TileSet.prototype = {
    tiles: {
        'en': {
            '0': {
                ' ': 2
           },
            '1': {
                'E': 12,
                'A': 9,
                'I': 9,
                'O': 8,
                'N': 6,
                'R': 6,
                'T': 6,
                'L': 4,
                'S': 4,
                'U': 4
            },
            '2': {
                'D': 4,
                'G': 3
            },
            '3': {
                'B': 2,
                'C': 2,
                'M': 2,
                'P': 2
            },
            '4': {
                'F': 2,
                'H': 2,
                'V': 2,
                'W': 2,
                'Y': 2
            },
            '5': {
                'K': 1
            },
            '8': {
                'J': 1,
                'X': 1
            },
            '10': {
                'Q': 1,
                'Z': 1
            }
        }
    },
    createSet: function() {
        var tiles = [];
        for (var value in this.tiles[this.language]) {
            for (var letter in this.tiles[this.language][value]) {
                for (var i = 0; i < this.tiles[this.language][value][letter]; i++) {
                    tiles.push(new Tile(letter, value));
                }
            }
        }
        return tiles;
    },
    getTiles: function () {
        return this.tiles;
    },
    tilesLeft: function () {
       return this.tiles.length; 
    },
    getRandomTile: function() {
        if (this.tilesLeft() === 0) {
            throw {
                name: 'Error',
                message: 'No tiles left'
            };
        }
        var tile = this.tiles.splice(Math.round(Math.random() * (this.tilesLeft() - 1)), 1)[0];
        return tile;
    },
    /**
     * @param {array.<Player>} players
     */
    giveStartingTilesTo: function (players) {
        for (var i = 0; i < players.length * 7; i++) {
             players[i % players.length].addTile(this.getRandomTile());
        }
    }
};

exports.TileSet = TileSet;

