var vows = require('vows'),
    assert = require('assert'),
    Board = require('../../main/common').Board
    wordValidator = require('../../main/server').wordValidator;

vows.describe('Board').addBatch({
   'A board': {
       '2x2': {
           topic: new Board(2, wordValidator).set(0, 0, 'o').set(0, 1, 'n').set(1, 0, 'o'),
            
            'return false when validated': function (topic) {
                assert.isFalse(topic.isValid());
            },
            'throws if trying to set character out of bounds': function (topic) {
                assert.throws(function () { topic.set(2, 0, 'a');});
            },
            'throws if trying to set a non character': function (topic) {
                assert.throws(function () { topic.set(0, 0, 1);});
            },
            'returns size when asked to': function(topic) {
                assert.equal(topic.getSize(), 2);
            }

       },
       '3x3': {
            topic: new Board(3).set(1, 0, 'c').set(1, 1, 'a').set(1, 2, 'r').set(0, 1, 'c').set(2, 1, 'r'),
            'returns true when validated': function (topic) {
                assert.isTrue(topic.isValid());
            },
            'returns it\'s representation when toString is called': function (topic) {
                assert.equal(
                    topic.toString(),
                    '[ c ]\n' +
                    '[car]\n' +
                    '[ r ]\n');
            }
       }
   }
}).export(module);

