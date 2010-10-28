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
 /**
 * @constructor
 * @param {number} size The length of board sides.
 * @param {function(string):boolean} wordValidator The validator used to
 * validate played words.
 * on the board.
 */
function Board(size, wordValidator) {
    this.size = size;
    this.xy = [];
    this.yx = [];
    this.wordValidator = wordValidator || function(word) { return true; };
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
    set: function(x, y, c) {
       if (x < this.size && y < this.size &&
           typeof c === 'string' && c.length == 1) {
           this.xy[y][x] = this.yx[x][y] = c;
           return this;
       }
       throw new Error('Out of bounds or invalid type');
    },
    isValid: function() {
        var self = this;
        return isValid(this.xy) && isValid(this.yx);
        function isValid(board) {
            return board.map(function(row) {
            return row.join('').trim();
            }).filter(function(word) {
                return word.length > 1;
            }).every(function(word) {
                return self.wordValidator(word);
            });
        }

    },
    toString: function() {
        var y = 0, ret = '';
        for (; y < this.size; y += 1) {
            ret += '[' + this.xy[y].join('') + ']\n';
        }
        return ret;
    },
    eachTile: function(fn) {
        var x = 0, y = 0, ret = '';
        for (; y < this.size; y += 1) {
            for (x = 0; x < this.size; x += 1) {
                fn(x, y, this.xy[y][x]);
            }
        }
    }
};
/**
 * @see Board
 */
exports.Board = Board;

 
});

wordgame._jsbuild_.defineModule("common/game.js",function(exports,module,require,globals,undefined){
 var Board = require('./board').Board,
    TileSet = require('./tileset').TileSet;
/**
 * @constructor
 * @param {number} size The length of the board's sides.
 * @param {function(string):boolean} wordValidator The validator used to
 * validate played words.
 * words on the board.
 * @param {TileSet=} tileSet The tiles used for the game.
 */
function Game(size, wordValidator, tileSet) {
    this.size = size;
    this.board = new Board(this.size, wordValidator);
    this.players = [];
    this.inTurn = 0;
    this.turnBuffer = [];
    // on the client side game doesn't control tileset
    this.tileSet = tileSet || null;
}
Game.prototype = {
    addPlayer: function(player) {
        this.players.push(player);
        return this;
    },
    startGame: function() {
        if (this.players < 2) {
            throw new Error('Not enough players');
        }
        if (this.tileSet !== null) {
            this.tileSet.giveStartingTilesTo(this.players);
        }
        return this;
    },
    whosTurn: function() {
        return this.players[this.inTurn];
    },
    setTile: function(x, y, c) {
        console.log('Setting:', x, y, c);
        this.turnBuffer.push({
            x: x,
            y: y,
            c: (c || ' ').toUpperCase()
        });
        return this;
    },
    endTurn: function() {
        console.log('Ending ' + this.whosTurn().getName());
        var self = this,
            points = this.turnBuffer.reduce(function(sum, placement) {
                self.board.set(placement.x, placement.y, placement.c);
                return sum += Number(
                    self.whosTurn().removeTile(placement.c).getValue());
           }, 0);
        this.whosTurn().addPoints(points);
        if (this.inTurn + 1 === this.players.length) {
            this.inTurn = 0;
        } else {
            this.inTurn++;
        }
       var tempTurnBuffer = this.turnBuffer;
       this.turnBuffer = [];
       return tempTurnBuffer;
    },
    getBoard: function() {
        return this.board;
    },
    toString: function() {
        return this.board.toString();
    }
};
/**
 * @see Game
 */
exports.Game = Game;
 
});

wordgame._jsbuild_.defineModule("common/player.js",function(exports,module,require,globals,undefined){
 var Tile = require('./tile').Tile;
/**
 * @constructor
 * @param {string} name The name of the player.
 * @param {Array.<Tile>} tiles The starting tiles for the player.
 * @param {number=} points The starting points for the player.
 */
function Player(name, tiles, points) {
    this.name = name;
    this.tiles = tiles || [];
    this.points = points || 0;
}
/**
 * @param {string|object} json A representation of the player in JSON string or
 * JSON object.
 * @return {Player} A player constructed from the given string or object.
 */
Player.fromJson = function(json) {
    var data = null;
    if (typeof json === 'string') {
        data = JSON.parse(json);
    } else {
        data = json;
    }
    if (data.name !== undefined && data.points !== undefined) {
        var tiles = [];
        if (data.tiles && data.tiles.length) {
            data.tiles.map(function(tile) {
                tiles.push(Tile.fromJson(tile));
            });
        }
        return player = new Player(String(data.name), tiles, Number(data.points));
    }
    throw new Error('Data did not contain name and points');
};
Player.prototype = {
    getName: function() {return this.name},
    addTile: function(tile) {
        console.log(this.name + ' got Tile: ' + tile.getLetter());
        this.tiles.push(tile);
        return this;
    },
    getTiles: function() {
        return this.tiles;
    },
    removeTile: function(character) {
        console.log('From: ' + this.name + ' removing ' + character);
        for (var i = 0; i < this.tiles.length; i++) {
            if (this.tiles[i].getLetter() === String(character)) {
                return this.tiles.splice(i, 1)[0];
            }
        }
        throw new Error('Player doesn\'t have that tile anymore');
    },
    getPoints: function() {
        return this.points;
    },
    addPoints: function(points) {
        return this.points += points;
    },
    toJson: function() {
        return {
            name: this.name,
            tiles: this.tiles.map(function(tile) {
                return tile.toJson();
            }),
            points: this.points
        };
    }
};
/**
 * @see Player
 */
exports.Player = Player;
 
});

wordgame._jsbuild_.defineModule("common/tile.js",function(exports,module,require,globals,undefined){
 /**
 * A tile
 * @constructor
 * @param {string} letter Tiles letter.
 * @param {number} value Tiles value.
 */
function Tile(letter, value) {
    this.letter = (letter || ' ').toUpperCase();
    this.value = value || 0;
}
/**
 * @param {string|object} json A representation of the tile in JSON string or
 * JSON object.
 * @return {Tile} A tile constructed from the given string or object.
 */

Tile.fromJson = function(json) {
    var data = null;
    if (typeof json === 'string') {
        data = JSON.parse(json);
    } else {
        data = json;
    }
    if (data.letter !== undefined && data.value !== undefined) {
        return new Tile(String(data.letter), Number(data.value));
    }
    throw new Error('Data did not contain letter and value');
};
Tile.prototype = {
    /**
     * @return {number} The value of the tile.
     * @this {Tile}
     */
    getValue: function() {
        return this.value;
    },
    /**
     * @return {string} The letter of the tile.
     * @this {Tile}
     */
    getLetter: function() {
        return this.letter;
    },
    toJson: function() {
        return {
            letter: this.getLetter(),
            value: this.getValue()
        };
    }
};
/**
 * @see Tile
 */
exports.Tile = Tile;
 
});

wordgame._jsbuild_.defineModule("common/tileset.js",function(exports,module,require,globals,undefined){
 var Tile = require('./tile').Tile;
/**
 * @constructor
 * @param {string=} language Which language tileset to use?
 */
function TileSet(language) {
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
                for (var i = 0;
                     i < this.tiles[this.language][value][letter];
                     i++) {
                    tiles.push(new Tile(letter, value));
                }
            }
        }
        return tiles;
    },
    getTiles: function() {
        return this.tiles;
    },
    tilesLeft: function() {
       return this.tiles.length;
    },
    getRandomTile: function() {
        if (this.tilesLeft() === 0) {
            throw new Error('No tiles left');
        }
        var tile = this.tiles.splice(
                Math.round(Math.random() * (this.tilesLeft() - 1)), 1)[0];
        return tile;
    },
    giveStartingTilesTo: function(players) {
        for (var i = 0; i < players.length * 7; i++) {
             players[i % players.length].addTile(this.getRandomTile());
        }
    }
};
/**
 * @see TileSet
 */
exports.TileSet = TileSet;

 
});

wordgame._jsbuild_.defineModule("common.js",function(exports,module,require,globals,undefined){
 exports.Board = require('./common/board').Board;
exports.Game = require('./common/game').Game;
exports.Player = require('./common/player').Player;
exports.Tile = require('./common/tile').Tile;
exports.TileSet = require('./common/tileset').TileSet;
 
});

wordgame._jsbuild_.defineModule("client/domboard.js",function(exports,module,require,globals,undefined){
 /**
 * @constructor
 * @param {string|jQuery} container The DOM element where to append the
 * board.
 * @param {Board} board The board to use.
 */
function DomBoard(container, board) {
    this.active = false;
    var frame = $('<div id="wordgame-board"></div>')
        .appendTo(container);
    var self = this;
    var tiles = [];
    this.tiles = tiles;
    board.eachTile(function(x, y, c) {
       var tile = $('<div>' + c + '</div>')
            .css({
                'top': 100 + y * 30 + 'px',
                'left': x * 30 + 'px'
            }).droppable({
            drop: function(event, ui) {
                // if tile was empty on the turn start and nothing has been
                // added
                if (self.active) {
                    var character = ui.draggable.find('span:first').text();
                    console.log('dropped ' + character);
                    ui.draggable.remove();
                    $('#wordgame').trigger('wordgame.setTile',
                        [x, y, character]);
                }
            },
            activate: function(event, ui) {
                $(this).css('border-color', 'green');
            },
            deactivate: function(event, ui) {
                $(this).css('border-color', 'black');
            }
       }).appendTo(frame);
       if (tiles.length === x) {
           tiles.push([]);
       }
       tiles[x].push(tile);
    });
}
/**
 * Set value of given coordinates to given value.
 * @param {number} x The x-coordinate.
 * @param {number} y The y-coordinate.
 * @param {string} c The character.
 */
DomBoard.prototype.setTile = function(x, y, c) {
    var tile = this.tiles[x][y];
    if (tile.text().trim().length === 0) {
       tile.text(c.trim().length > 0 ? c : '?');
    }
};
/**
 * Deactive the board so that tiles cannot be dropped on it.
 */
DomBoard.prototype.deactivate = function() {
    this.active = false;
};
/**
 * Active the board so that tiles can be dropped on it.
 */
DomBoard.prototype.activate = function() {
    this.active = true;
};
/**
 * @see DomBoard
 */
exports.DomBoard = DomBoard;
 
});

wordgame._jsbuild_.defineModule("client/domtileset.js",function(exports,module,require,globals,undefined){
 /**
 * @constructor
 * @param {string|jQuery} container The container where to append the tile set.
 * @param {Array.<Tile>} tiles The tiles to use in the set.
 */
function DomTileSet(container, tiles) {
    var frame = $('<div id="wordgame-tileset"></div>').appendTo(container);
    var selected = null;
    tiles.forEach(function(tile, index) {
       $(frame).append(
           $('<div>' +
               '<span class="letter">' + tile.getLetter() + '</span>' +
               '<span class="value">' + tile.getValue() + '</span>' +
               '</div>')
            .click(function() {
                selected = {tile: tile, el: this};
            }).draggable({'revert': true}));
    });
}
/**
 * @see DomTileSet
 */
exports.DomTileSet = DomTileSet;

 
});

wordgame._jsbuild_.defineModule("client.js",function(exports,module,require,globals,undefined){
 exports.DomTileSet = require('./client/domtileset').DomTileSet;
exports.DomBoard = require('./client/domboard').DomBoard;
 
});

