var wordgame = (function(globals,undefined){

  var jsbuild = (function(){

    var cache = {};

    function Module(){
      this.exports = null;
      this.fileName = null;
      this.id = null;
      this.workingDir = null;
      this.wrapper = null;
    };

    Module.prototype.call = function(){
      this.exports = {};
      return this.wrapper.call(null, this.exports, this, partial(require, [ this.workingDir ], null), globals);
    };

    function defineModule(path,modwrapper){
      var module = new Module();
      module.wrapper = modwrapper;
      module.fileName = path;
      module.id = getId( module.fileName );
      module.workingDir = getDir( module.fileName ); 

      cache[module.fileName] = module;

      return module;
    };

    function getDir(path){
      return path.replace(/\/?[^\/]*$/,"");
    }

    function getId(path){
      var name = path.match(/\/?([\w_-]+)\.js$/);
      name && ( name = name[1] );
      return name;
    };

    function getModuleByFilename(filename){
      return cache[filename];
    }

    function partial(fn,init_args,scope){
      !init_args && ( init_args = [] );
      return function(){
        var args = Array.prototype.slice.call(init_args,0);
        Array.prototype.push.apply(args,arguments);
        return fn.apply(scope,args);
      };
    };

    function resolvePath(path,wd){
      if(path.substring(0,1) == '/' || /^\w+\:\/\//.test(path)) return path;

      /\/$/.test(wd) && ( wd = wd.substring(0,wd.length-1) );
      /^\.\//.test(path) && ( path = path.substring(2,path.length) );

      if(path.substring(0,3)=='../'){
        var lvl = path.match(/^(?:\.\.\/)+/)[0].match(/\//g).length;
        wd = wd.replace(new RegExp("(\\/?\\w+){"+lvl+"}$"),'');
        path = path.replace(new RegExp("(\\.\\.\\/){"+lvl+"}"),'');
      };
       
      return ( wd && wd+'/' || '' )+path;
    };

    function require(workingDir,path){

      !/\.js(\?.*)?$/.test(path) && ( path = path+'.js' );

      var uri = resolvePath(path,workingDir), mod = cache[uri];

      if(!mod) throw new Error('Cannot find module "'+path+'". (Working Dir:'+workingDir+', URI:'+uri+' )')

      mod.exports==null && mod.call();

      return mod.exports;
    };

    return {
      "Module":Module,
      "cache":cache,
      "defineModule":defineModule,
      "getDir":getDir,
      "getId":getId,
      "getModuleByFilename":getModuleByFilename,
      "partial":partial,
      "resolvePath":resolvePath,
      "require":require
    };

  })();

  return {
    '_jsbuild_':jsbuild,
    'require':jsbuild.partial(jsbuild.require,[''])
  };

})(this); 

wordgame._jsbuild_.defineModule("common/board.js",function(exports,module,require,globals,undefined){
 var Board = function (size, wordValidator) {
    this.size = size;
    this.xy = [];
    this.yx = [];
    this.wordValidator = wordValidator || function (word) { return true; };
    for (var i = 0; i < size; i += 1) {
       this.xy[i] = [];
       this.yx[i] = [];
       for (var j = 0; j < size; j += 1) {
            this.xy[i][j] = this.yx[i][j] = ' ';
       }
    }
}
Board.prototype = {
    getSize: function() {
        return this.size;
    },
    set: function (x, y, c) {
       if (x < this.size && y < this.size && isString(c) && c.length == 1) { 
           this.xy[y][x] = this.yx[x][y] = c;
           return this;
       }
       throw {
           name: 'Error',
           message: 'Out of bounds or invalid type'
       };
    },
    isValid: function () {
        var self = this;
        return isValid(this.xy) && isValid(this.yx);
        function isValid(board) {
            return board.map(function (row) {
            return row.join('').trim();
            }).filter(function (word) {
                return word.length > 1;
            }).every(function (word) {
                return self.wordValidator(word);
            });
        }

    },
    toString: function () {
        var y = 0, ret = '';
        for (; y < this.size; y += 1) {
            ret += '[' + this.xy[y].join('') + ']\n';
        }
        return ret;
    },
    eachTile: function (fn) {
        var x = 0, y = 0, ret = '';
        for (; y < this.size; y += 1) {
            for (x = 0; x < this.size; x += 1) {
                fn(x, y, this.xy[y][x]);
            }
        }
    }
};

function isString(s) {
	return typeof s === "string" || s instanceof String;
}
exports.Board = Board;

 
});

wordgame._jsbuild_.defineModule("common/game.js",function(exports,module,require,globals,undefined){
 var Board = require('./board').Board,
    TileSet = require('./tileset').TileSet;
var Game = function (size) {
    this.size = size;
    // TODO: set the wordvalidator on server
    this.board = new Board(this.size);
    this.players = [];
    this.inTurn = 0;
    this.turnBuffer = [];
    this.tileSet = new TileSet();
}
Game.prototype = {
    /**
     * @param {Player} player
     */
    addPlayer: function (player) {
        this.players.push(player);
        return this;
    },
    start: function () {
        if (this.players < 2) {
            throw {
                name: 'Error',
                message: 'Not enough players'
            };
        }
        this.tileSet.giveStartingTilesTo(this.players);
        return this;
    },
    whosTurn: function () {
        return this.players[this.inTurn]; 
    },
    set: function (player, x, y, c) {
        var name = isString(player) ? player : player.getName();
        if (player !== this.whosTurn().getName()) {
            throw {
                name: 'Error',
                message: 'Invalid player'
            };
        }
        this.turnBuffer.push({
            x: x,
            y: y,
            c: (c || ' ').toUpperCase()
        });
        return this;
    },
    endTurn: function () {
        var self = this,
            points = this.turnBuffer.reduce(function (sum, placement) {
                self.board.set(placement.x, placement.y, placement.c);
                return sum += self.whosTurn().removeTile(placement.c).getValue();
           }, 0);
        this.whosTurn().addPoints(points);
        if (this.inTurn + 1 === this.players.length) {
            this.inTurn = 0;
        } else {
            this.inTurn++;
        }
    },
   toString: function () {
        return this.board.toString();
    }
};
function isString(s) {
	return typeof s === "string" || s instanceof String;
}

exports.Game = Game;
 
});

wordgame._jsbuild_.defineModule("common/player.js",function(exports,module,require,globals,undefined){
 function Player(name) {
   this.name = name;
   this.tiles = [];
   this.points = 0;
}
Player.prototype = {
    getName: function() {return this.name},
    addTile: function(tile) {
        this.tiles.push(tile);
        return this;
    },
    getTiles: function() {
        return this.tiles;
    },
    removeTile: function(tile) {
        for (var i = 0; i < this.tiles.length; i++) {
            if (this.tiles[i].getLetter() === tile.toUpperCase()) {
                return this.tiles.splice(i, 1)[0];
            }
        };
        throw {
          name: 'Error',
          message: 'Player doesn\'t have that tile anymore'
        };
    },
    getPoints: function() {
        return this.points;
    },
    addPoints: function(points) {
        return this.points += points;
    }
};
exports.Player = Player;
 
});

wordgame._jsbuild_.defineModule("common/tile.js",function(exports,module,require,globals,undefined){
 /**
 * A tile
 * @constructor
 * @param {string} letter
 * @param {number} value
 */
function Tile(letter, value) {
    this.letter = (letter || ' ').toUpperCase();
    this.value = value || 0;
}
Tile.prototype = {
    /**
     * @return {number} The value
     */
    getValue: function() {return this.value;},
    /**
     * @return {string} The letter
     */
    getLetter: function() {return this.letter;}
};

exports.Tile = Tile;
 
});

wordgame._jsbuild_.defineModule("common/tileset.js",function(exports,module,require,globals,undefined){
 var Tile = require('./tile').Tile;
/**
 * @constructor
 * @param {string=} language
 */
function TileSet (language) {
    this.language = language || 'en';
    this.tiles = this.createSet();
}
TileSet.prototype = {
    tiles: {
        'en': {
            '0': {
                ' ': 2
           },
            '1': {
                'E': 12,
                'A': 9,
                'I': 9,
                'O': 8,
                'N': 6,
                'R': 6,
                'T': 6,
                'L': 4,
                'S': 4,
                'U': 4
            },
            '2': {
                'D': 4,
                'G': 3
            },
            '3': {
                'B': 2,
                'C': 2,
                'M': 2,
                'P': 2
            },
            '4': {
                'F': 2,
                'H': 2,
                'V': 2,
                'W': 2,
                'Y': 2
            },
            '5': {
                'K': 1
            },
            '8': {
                'J': 1,
                'X': 1
            },
            '10': {
                'Q': 1,
                'Z': 1
            }
        }
    },
    createSet: function() {
        var tiles = [];
        for (var value in this.tiles[this.language]) {
            for (var letter in this.tiles[this.language][value]) {
                for (var i = 0; i < this.tiles[this.language][value][letter]; i++) {
                    tiles.push(new Tile(letter, value));
                }
            }
        }
        return tiles;
    },
    getTiles: function () {
        return this.tiles;
    },
    tilesLeft: function () {
       return this.tiles.length; 
    },
    getRandomTile: function() {
        if (this.tilesLeft() === 0) {
            throw {
                name: 'Error',
                message: 'No tiles left'
            };
        }
        var tile = this.tiles.splice(Math.round(Math.random() * (this.tilesLeft() - 1)), 1)[0];
        return tile;
    },
    /**
     * @param {array.<Player>} players
     */
    giveStartingTilesTo: function (players) {
        for (var i = 0; i < players.length * 7; i++) {
             players[i % players.length].addTile(this.getRandomTile());
        }
    }
};

exports.TileSet = TileSet;

 
});

wordgame._jsbuild_.defineModule("common.js",function(exports,module,require,globals,undefined){
 exports.Board = require("./common/board").Board;
exports.Game = require("./common/game").Game;
exports.Player = require("./common/player").Player;
exports.Tile = require("./common/tile").Tile;
exports.TileSet = require("./common/tileset").TileSet;

 
});

wordgame._jsbuild_.defineModule("client/domboard.js",function(exports,module,require,globals,undefined){
 var DomBoard = function (container, board) {
    var frame = $('<div id="wordgame-board"></div>').appendTo(container).css('position', 'relative');
    var inputField = $('<input id=wordgame-board-input-field type="text" />').hide().appendTo(frame);
    var inputSubmit = $('<input id=wordgame-board-input-submit type="button" value="OK"/>').hide().click(function () {
        try {
          board.set(selected.x, selected.y, inputField.val());
          $(selected.el).html(inputField.val());
        } catch (e) {
            alert('NO');
            return false;
        }
        inputField.hide();
        inputSubmit.hide();
    }).appendTo(frame);
    var selected = null;
    board.eachTile(function (x, y, c) {
       $(frame).append($('<div>' + c + '</div>').width(25).height(25).css({
            'position': 'absolute',
            'top': 100 + y * 25 + 'px', 
            'left': x * 25 + 'px',
            'border': '1px solid black',
            'text-align': 'center'
       }).click(function () {
           selected = {x: x, y: y, el: this};
           inputField.show();
           inputSubmit.show();
       })); 
    });
}
exports.DomBoard = DomBoard;
 
});

