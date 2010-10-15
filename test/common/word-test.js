var vows = require('vows'), assert = require('assert');
var word = require('../word');

vows.describe('Validating words').addBatch({
    'A word': {
        'that is valid': {
            topic: 'car',
            'returns true when validated': function (topic) {
                assert.isTrue(word.isValid(topic));
            }
        },
        'that is invalid': {
            topic: 'asdfsdf',
            'return false when validated': function (topic) {
                assert.isFalse(word.isValid(topic));
            }
        }
    }
}).export(module);

