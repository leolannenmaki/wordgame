var vows = require('vows'), assert = require('assert');
var Game = require('../../main/common').Game,
    Player = require('../../main/common').Player,
    Tile = require('../../main/common').Tile,
    TileSet = require('../../main/common').TileSet;

vows.describe('Game').addBatch({
   'A game': {
       'size 3x3 where Leo and Ninni play': {
            topic: function() {
                return new Game(3, undefined, new TileSet())
                           .addPlayer(new Player('Leo'))
                           .addPlayer(new Player('Ninni'))
                           .startGame();
            },
            'returns Leo when asked who\'s turn it is': function(topic) {
                assert.equal(topic.whosTurn().getName(), 'Leo');
            },
            'Leo has 7 tiles': function(topic) {
                assert.equal(topic.whosTurn().getTiles().length, 7);
            },
            'throws if invalid player tries to set': function(topic) {
                assert.throws(function() {
                    topic.set('Ninni', 0, 0, 'a');
                });
            },
            'sets the board corretly when Leo plays': function(topic) {
                var leo = topic.whosTurn();
                leo.tiles = []; // To make certain player has the next tiles with correct values
                leo.addTile(new Tile('C', 1)).addTile(new Tile('A', 1)).addTile(new Tile('R', 1));
                assert.equal(
                    topic.toString(),
                    '[   ]\n' +
                    '[   ]\n' +
                    '[   ]\n');
                topic.setTile(0, 1, 'C').setTile(1, 1, 'A').setTile(2, 1, 'R');                            assert.equal(
                    topic.toString(),
                    '[   ]\n' +
                    '[   ]\n' +
                    '[   ]\n');
                topic.endTurn();
                assert.equal(
                    topic.toString(),
                    '[   ]\n' +
                    '[CAR]\n' +
                    '[   ]\n');
                assert.equal(topic.whosTurn().getName(), 'Ninni');
                assert.equal(leo.getPoints(), 3);
            }
       }
   }
}).export(module);

