/**
 * From http://www.broofa.com/Tools/Math.uuid.js
 * Licence and copyright information from the original file:
 *
 * Math.uuid.js (v1.4)
 * http://www.broofa.com
 * mailto:robert@broofa.com
 * Copyright (c) 2010 Robert Kieffer
 * Dual licensed under the MIT and GPL licenses.
 * 
 */
// A more compact, but less performant, RFC4122v4 solution:
function RFC4122v4UUID () { 
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    }).toUpperCase();
};
exports.generateUuid = RFC4122v4UUID;
