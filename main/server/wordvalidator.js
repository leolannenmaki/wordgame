var flr = require('./FileLineReader');

var dict = {}, reader = new flr.FileLineReader("/usr/share/dict/words"); 
while (reader.hasNextLine()) {
   dict[reader.nextLine()] = true; 
}
exports.isValid = function (word) {
    return dict[word] || false;
}
