var vows = require('vows'),
    assert = require('assert'),
    TileSet = require('../tileset').TileSet,
    Player = require('../player').Player,
    Tile = require('../tile').Tile;
vows.describe('TileSet').addBatch({
    'A TileSet can be used to start a game': {
        topic: new TileSet(),
       'gives starting tiles': function (topic) {
            var players = [new Player('Leo'), new Player('Ninni'), new Player('Kalle')];
            assert.equal(topic.tilesLeft(), 100);
            topic.giveStartingTilesTo(players);
            assert.equal(players[0].getTiles().length, 7);
            assert.equal(players[1].getTiles().length, 7);
            assert.equal(players[2].getTiles().length, 7);
            assert.equal(topic.tilesLeft(), 79);
        }
    },
    'TileSet has 100 tiles': {
        topic: new TileSet(),
        'has 100 tiles': function (topic) {
            assert.equal(topic.tilesLeft(), 100);
        },
        'contains two letters F with value 4': function (topic) {
            var found = topic.getTiles().reduce(function(sum, tile) {
                return tile.getLetter() === 'F' ? sum + 1 : sum;
            }, 0);
            assert.equal(found, 2);
        },
        'returns random tiles when asked to': function(topic) {
            var tiles = [];
            for (var i = 0; i < 100; i++) {
                var tile = topic.getRandomTile();
                assert.instanceOf(tile, Tile);
                tiles.push(tile);
            }
            assert.equal(tiles.length, 100);
            assert.equal(topic.tilesLeft(), 0);
            assert.throws(function() {topic.getRandomTile();});
        }
    }
}).export(module);
