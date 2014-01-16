// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function(){

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (typeof params == "undefined" || params == null) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;','color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;','color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function(){
      return _(_.range(this.get('n'))).map(function(rowIndex){
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex){
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex){
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex){
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function(){
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex){
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function(){
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex){
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


/*
         _             _     _                     
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _ 
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_ 
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)
                                                   
 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    // 
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex){
      var row = this.get(rowIndex);
      var count = 0;
      for(var i = 0; i < row.length; i++) {
        count += row[i] || 0;
      }
      return (count > 1);
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function(){
      var length = this.get(0).length;
      for(var row = 0; row < length; row++) {
        if(this.hasRowConflictAt(row)){
          return true;
        }
      }
      return false;
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    // 
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex){
      var length = this.get('n');
      var count = 0;
      if(!(this._isInBounds(0, colIndex)) ) return;
      for(var row=0; row < length; row++) {
        count+=this.get(row)[colIndex] || 0;
      }
      return count > 1; // fixme
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function(){
      var length = this.get(0).length;
      for(var col = 0; col < length; col++) {
        if(this.hasColConflictAt(col)){
          return true;
        }
      }
      return false;
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    // 
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow){
      var rowIndex = 0;
      var colIndex = majorDiagonalColumnIndexAtFirstRow;
      var length = this.get(0).length;

      while(colIndex < 0) {
        rowIndex++;
        colIndex++;
      }

      var count = 0;
      //step down the cheseboard down/right at each step
      // debugger;
      for(rowIndex; rowIndex < length && colIndex < length; rowIndex++, colIndex++) {
        count += this.get(rowIndex)[colIndex] || 0;
      }
      return count > 1;
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function(){
      var length = this.get(0).length;
      var start = length * -1 +1;
      for(var i = start; i < length; i++) {
        if(this.hasMajorDiagonalConflictAt(i)) {
          return true;
        }
      }
      return false;
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow){
      var rowIndex = 0;
      var colIndex = minorDiagonalColumnIndexAtFirstRow;
      var length = this.get(0).length;

      while(colIndex > length-1) {
        rowIndex++;
        colIndex--;
      }

      var count = 0;
      //step down the chessboard down/right at each step
      for(rowIndex; rowIndex < length && colIndex >= 0 ; rowIndex++, colIndex--) {
        count += this.get(rowIndex)[colIndex] || 0;
      }
      return count > 1;
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function(){
      var length = this.get(0).length;
      for(var i = 0; i < 2*length-1; i++) {
        if(this.hasMinorDiagonalConflictAt(i)) {
          return true;
        }
      }
      return false;
    },

    addRook: function(rowIndex, colIndex, openSpaces) {
      // usage: openSpaces = board.addRook(row, col, openSpaces)
      if(!(this._isInBounds(rowIndex, colIndex))) {
        throw( 'Rook Location Out of Bounds');
      }
      if(this.get(rowIndex)[colIndex]) {
        throw( 'Rook Location Already Occupied');
      }
      this.get(rowIndex)[colIndex] = 1;
      var length = this.get(0).length;

      for(var i=0; i<length; i++) {
        openSpaces.get(rowIndex)[i] = 1;
        openSpaces.get(i)[colIndex] = 1;
      }

      return openSpaces;
    },

    addQueen: function(rowIndex, colIndex, openSpaces) {
      if(!(this._isInBounds(rowIndex, colIndex))) {
        throw( 'Queen Location Out of Bounds');
      }
      if(this.get(rowIndex)[colIndex]) {
        throw( 'Queen Location Already Occupied');
      }

      this.get(rowIndex)[colIndex] = 1;
      var length = this.get(0).length;
      for(var i=0; i<length; i++) {
        //clear horizontal and vertical open space
        openSpaces.get(rowIndex)[i] = 1;
        openSpaces.get(i)[colIndex] = 1;

        //check top/right
        if(this._isInBounds(rowIndex-i, colIndex+i)) {
          openSpaces.get(rowIndex-i)[colIndex+i] = 1;
        }

        //check top/left
        if(this._isInBounds(rowIndex-i, colIndex-i)) {
          openSpaces.get(rowIndex-i)[colIndex-i] = 1;
        }

        //check bottom/right
        if(this._isInBounds(rowIndex+i, colIndex+i)) {
          openSpaces.get(rowIndex+i)[colIndex+i] = 1;
        }

        //check bottom/left
        if(this._isInBounds(rowIndex+i, colIndex-i)) {
          openSpaces.get(rowIndex+i)[colIndex-i] = 1;
        }
      }

      return openSpaces;
    },

    copySelf: function() {
      var length = this.get(0).length;
      var newBoard = new Board({n: length});
      // newBoard['n'] = this.get('n')
      for(var i = 0; i < length; i++) {
        newBoard.attributes[i] = this.get(i).slice(0);
      }
      return newBoard;
    },

    formatResult: function(toString) {
      toString = toString || false;

      var length = this.get(0).length;
      var result = [];
      for(var n=0; n<length; n++) {
        if(toString) {
          result.push( this.get(n).join(''));
        } else {
          result.push( this.get(n) );
        }
      }
      return result;
    }
    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n){
    return _(_.range(n)).map(function(){
      return _(_.range(n)).map(function(){
        return 0;
      });
    });
  };

}());
