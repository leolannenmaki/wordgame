// Module: FileLineReader
// Constructor: FileLineReader(filename, bufferSize = 8192)
// Methods: hasNextLine() -> boolean
//          nextLine() -> String
//
//
var fs = require('fs');
var sys = require('sys');

/**
 * @constructor
 * @param {string} filename The name of the file.
 * @param {number=} bufferSize The size of the buffer. Default 8192.
 */
exports.FileLineReader = function(filename, bufferSize) {

    if (!bufferSize) {
        bufferSize = 8192;
    }

    //private:
    var currentPositionInFile = 0;
    var buffer = '';
    var fd = fs.openSync(filename, 'r');


    // return -1
    // when EOF reached
    // fills buffer with next 8192 or less bytes
    var fillBuffer = function(position) {

        var res = fs.readSync(fd, bufferSize, position, 'ascii');

        buffer += res[0];
        if (res[1] == 0) {
            return -1;
        }
        return position + res[1];

    };

    currentPositionInFile = fillBuffer(0);

    //public
    /**
     * @return {boolean} Does the file have next line?
     */
    this.hasNextLine = function() {
        while (buffer.indexOf('\n') == -1) {
            currentPositionInFile = fillBuffer(currentPositionInFile);
            if (currentPositionInFile == -1) {
                return false;
            }
        }

        if (buffer.indexOf('\n') > -1) {

            return true;
        }
        return false;
    };

    //public
    /**
     * @return {string} The next line.
     */
    this.nextLine = function() {
        var lineEnd = buffer.indexOf('\n');
        var result = buffer.substring(0, lineEnd);

        buffer = buffer.substring(result.length + 1, buffer.length);
        return result;
    };

    return this;
};



