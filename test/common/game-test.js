var vows = require('vows'), assert = require('assert');
var Game = require('../game').Game,
    Player = require('../player').Player,
    Tile = require('../tile').Tile;

vows.describe('Game').addBatch({
   'A game': {
       'size 3x3 where Leo and Ninni play': {
            topic: function () {
                return new Game(3).addPlayer(new Player('Leo')).addPlayer(new Player('Ninni')).start();
            },
            'returns Leo when asked who\'s turn it is': function (topic) {
                assert.equal(topic.whosTurn().getName(), 'Leo');
            },
            'Leo has 7 tiles': function(topic) {
                assert.equal(topic.whosTurn().getTiles().length, 7);
            },
            'throws if invalid player tries to set': function (topic) {
                assert.throws(function () {topi.set('Ninni', 0, 0, 'a');});
            },
            'sets the board corretly when Leo plays': function (topic) {
                var leo = topic.whosTurn();
                leo.addTile(new Tile('C', 1)).addTile(new Tile('A', 1)).addTile(new Tile('R', 1));
                assert.equal(
                    topic.toString(),
                    '[   ]\n' +
                    '[   ]\n' +
                    '[   ]\n');
                topic.set('Leo', 0, 1, 'C').set('Leo', 1, 1, 'A').set('Leo', 2, 1, 'R');                            assert.equal(
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

