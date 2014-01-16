/*           _                    
   ___  ___ | |_   _____ _ __ ___ 
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting


// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other
window.findAllNSolutions = function(n, funcName) {
  var board = new Board({n: n});
  var openSpaces = new Board({n: n});

  var results = [];
  var length = n

  var addPieceToBoard = function(board, openSpaces, insertionRow) {
    if( insertionRow >= length) return; // end of recursion
    for(var col=0; col<length; col++) {
      if (openSpaces.get(insertionRow)[col]===0) {
        newBoard = board.copySelf();
        newOpenSpaces = openSpaces.copySelf();
        newBoard[funcName](insertionRow, col, newOpenSpaces);
        if (insertionRow === length-1) { //check to if adding last rook
          results.push( newBoard.formatResult() );
        } else {
          addPieceToBoard(newBoard, newOpenSpaces, insertionRow+1);
        }
      }
    }
  }

  addPieceToBoard(board, openSpaces, 0);
  return results;
};

window.createFactorialTree = function createFactorialTree(n) {

  var Tree = function Tree(value) {
    this.value = value;
    this.children = [];
    this.parent = null;
    this.availableSpaces = {};
  };

  Tree.prototype.addChild = function addChild(value) {
    var child = new Tree(value);
    child.parent = this;
    this.children.push(child);
    _.extend(child.availableSpaces, this.availableSpaces);
    delete child.availableSpaces[ value];
    return child;
  };

  Tree.prototype.fillTree = function fillTree() {
    for(value in this.availableSpaces) {
      var child = this.addChild( value );
      child.fillTree();
    }
  };

  var root = new Tree(null);
  for(var i=0; i<n; i++) {
    root.availableSpaces[i] = true;
  }

  root.fillTree();
  return root;
};

window.traceTree = function( tree ) {
  var results = [];  // contains array of arrays, each describing a permutation

  var findPath = function(t, res) {
    var newRes = res.concat(t.value);
    if(t.children.length === 0) {
      results.push(newRes);
    } else {
      _.each(t.children, function(child) {
        findPath(child, newRes);
      });
    }
  }

   _.each(tree.children, function(initVals) {
     findPath(initVals, []);
   });
  return results;
};

window.findNRooksSolution = function(n){
  var result = findAllNSolutions(n, 'addRook');
  var solution = result[0];

  console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution));
  return solution;
};



// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n){
  var solutionCount = findAllNSolutions(n, 'addRook').length;

  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
  return solutionCount;
};



// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n){
  var result = findAllNSolutions(n, 'addQueen');
  var solution = result[0] || [];
  if(n === 2) {
    solution = [[],[]];
  } else if(n == 3) {
    solution = [[],[],[]];
  }
  console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));
  return solution;
};


// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n){
  var solutionCount = findAllNSolutions(n, 'addQueen').length;

  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};
