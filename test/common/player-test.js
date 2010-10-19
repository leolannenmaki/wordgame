var vows = require('vows'),
    assert = require('assert'),
    Tile = require('../../main/common').Tile,
    Player = require('../../main/common').Player;

vows.describe('Player').addBatch({
   'A player': {
       'with the name Leo': {
            topic: new Player('Leo'),
            'returns Leo when asked who\'s he is': function(topic) {
                assert.equal(topic.getName(), 'Leo');
            },
            'can be given tiles': function(topic) {
                assert.equal(topic.getTiles().length, 0);
                topic.addTile(new Tile('C'));
                assert.equal(topic.getTiles().length, 1);
            },
            'tiles can be removed from': function(topic) {
                topic.removeTile('C');
                assert.equal(topic.getTiles().length, 0);
                assert.throws(function() {topic.removeTile('C')});
            }

        },
        'can be constructed from Json': {
            topic: '{ "name": "Leo", "points": "10", "tiles": [{ "letter": "A", "value": "1"}, {"letter": "B", "value": "2"}]}',
            'player has correct values': function (topic) {
                var player = Player.fromJson(topic);
                assert.equal(player.getName(), 'Leo');
                assert.equal(player.getPoints(), 10);
                var tiles = player.getTiles();
                assert.equal(tiles[0].getLetter(), 'A');
            },
            
        }
   }
}).export(module);

