var vows = require('vows'),
    assert = require('assert'),
    Tile = require('../tile.js').Tile,
    Player = require('../player.js').Player;

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

       }
   }
}).export(module);

