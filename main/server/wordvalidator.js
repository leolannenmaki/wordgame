var flr = require('./FileLineReader'), 
    dict = {}, 
    reader = new flr.FileLineReader("/usr/share/dict/words"); 
while (reader.hasNextLine()) {
   dict[reader.nextLine()] = true; 
}
exports.wordValidator = function (word) {
    return dict[word] || false;
}
