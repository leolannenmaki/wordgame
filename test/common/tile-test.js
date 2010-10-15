var vows = require('vows'), assert = require('assert');
var Tile = require('../tile').Tile;

vows.describe('Tile').addBatch({
   'A tile': {
       'should have be a combination of a letter and a value': {
            topic: new Tile('A', 1),
            'returns 1 when asked for value': function (topic) {
                assert.equal(topic.getValue(), 1);
            },
            'returns A when asked for letter': function (topic) {
                assert.equal(topic.getLetter(), 'A');
            }
       },
        'should default to blank tile, if no parameters given': {
            topic: new Tile(),
            'returns 0 when asked for value': function (topic) {
                assert.equal(topic.getValue(), 0);
            },
            'returns blank when asked for letter': function (topic) {
                assert.equal(topic.getLetter(), ' ');
            }
        }
   }
}).export(module);


