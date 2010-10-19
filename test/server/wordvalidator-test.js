var vows = require('vows'), assert = require('assert');
var isValid = require('../../main/server').wordValidator;

vows.describe('Validating words').addBatch({
    'A word': {
        'that is valid': {
            topic: 'car',
            'returns true when validated': function (topic) {
                assert.isTrue(isValid(topic));
            }
        },
        'that is invalid': {
            topic: 'asdfsdf',
            'return false when validated': function (topic) {
                assert.isFalse(isValid(topic));
            }
        }
    }
}).export(module);

