var flr = require('./FileLineReader'),
    dict = {},
    reader = new flr.FileLineReader('/usr/share/dict/words');

while (reader.hasNextLine()) {
   dict[reader.nextLine()] = true;
}
/**
 * @param {string} word The word to be validated.
 * @return {boolean} Is the word a valid word?
 */
exports.wordValidator = function(word) {
    return dict[word] || false;
};
