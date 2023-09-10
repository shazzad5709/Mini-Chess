// Define the QuickChess board and pieces
type Piece = {
  type: string; // Piece type: 'pawn', 'knight', 'bishop', 'rook', 'queen', 'king'
  color: string; // Piece color: 'white' or 'black'
};

const EMPTY_SQUARE: Piece = {
  type: 'empty',
  color: 'none', // You can choose any value to represent empty
};

type Board = Piece[][];

// Initialize the QuickChess board with an empty state
const initialBoard: Board = [
  [{ type: 'rook', color: 'white' }, { type: 'knight', color: 'white' }, { type: 'bishop', color: 'white' }, { type: 'queen', color: 'white' }, { type: 'king', color: 'white' }],
  [{ type: 'pawn', color: 'white' }, { type: 'pawn', color: 'white' }, { type: 'pawn', color: 'white' }, { type: 'pawn', color: 'white' }, { type: 'pawn', color: 'white' }],
  [{ type: 'pawn', color: 'black' }, { type: 'pawn', color: 'black' }, { type: 'pawn', color: 'black' }, { type: 'pawn', color: 'black' }, { type: 'pawn', color: 'black' }],
  [{ type: 'king', color: 'black' }, { type: 'queen', color: 'black' }, { type: 'bishop', color: 'black' }, { type: 'knight', color: 'black' }, { type: 'rook', color: 'black' }]
];



// Function to check if a move is within the bounds of the board
function isWithinBounds(row: number, col: number): boolean {
  return row >= 0 && row < 6 && col >= 0 && col < 5;
}

// Function to generate legal moves for a pawn
function generatePawnMoves(board: Board, row: number, col: number): [number, number][] {
  const moves: [number, number][] = [];
  const piece = board[row][col];
  const direction = piece.color === 'white' ? 1 : -1; // White moves down, black moves up

  // Pawn can move one square forward
  const newRow = row + direction;
  if (isWithinBounds(newRow, col) && !board[newRow][col]) {
    moves.push([newRow, col]);

    // Pawn can move two squares forward from its starting position
    if ((piece.color === 'white' && row === 1) || (piece.color === 'black' && row === 4)) {
      const doubleRow = row + 2 * direction;
      if (isWithinBounds(doubleRow, col) && !board[doubleRow][col]) {
        moves.push([doubleRow, col]);
      }
    }
  }

  // Pawn can capture diagonally
  const captureCols = [col - 1, col + 1];
  for (const captureCol of captureCols) {
    if (isWithinBounds(newRow, captureCol)) {
      const targetPiece = board[newRow][captureCol];
      if (targetPiece && targetPiece.color !== piece.color) {
        moves.push([newRow, captureCol]);
      }
    }
  }

  return moves;
}

// Function to generate legal moves for a knight
function generateKnightMoves(board: Board, row: number, col: number): [number, number][] {
  const moves: [number, number][] = [];
  const piece = board[row][col];
  const knightMoves: [number, number][] = [
    [row + 1, col + 2], [row + 1, col - 2],
    [row - 1, col + 2], [row - 1, col - 2],
    [row + 2, col + 1], [row + 2, col - 1],
    [row - 2, col + 1], [row - 2, col - 1],
  ];

  for (const [newRow, newCol] of knightMoves) {
    if (isWithinBounds(newRow, newCol) && (!board[newRow][newCol] || board[newRow][newCol].color !== piece.color)) {
      moves.push([newRow, newCol]);
    }
  }

  return moves;
}

// Function to generate legal moves for a bishop
function generateBishopMoves(board: Board, row: number, col: number): [number, number][] {
  const moves: [number, number][] = [];
  const piece = board[row][col];
  const directions: [number, number][] = [
    [-1, -1], [-1, 1], [1, -1], [1, 1],
  ];

  for (const [rowDelta, colDelta] of directions) {
    let newRow = row + rowDelta;
    let newCol = col + colDelta;

    while (isWithinBounds(newRow, newCol)) {
      const targetPiece = board[newRow][newCol];

      if (!targetPiece) {
        moves.push([newRow, newCol]);
      } else if (targetPiece.color !== piece.color) {
        moves.push([newRow, newCol]);
        break;
      } else {
        break; // Blocked by own piece
      }

      newRow += rowDelta;
      newCol += colDelta;
    }
  }

  return moves;
}

// Function to generate legal moves for a rook
function generateRookMoves(board: Board, row: number, col: number): [number, number][] {
  const moves: [number, number][] = [];
  const piece = board[row][col];
  const directions: [number, number][] = [
    [-1, 0], [1, 0], [0, -1], [0, 1],
  ];

  for (const [rowDelta, colDelta] of directions) {
    let newRow = row + rowDelta;
    let newCol = col + colDelta;

    while (isWithinBounds(newRow, newCol)) {
      const targetPiece = board[newRow][newCol];

      if (!targetPiece) {
        moves.push([newRow, newCol]);
      } else if (targetPiece.color !== piece.color) {
        moves.push([newRow, newCol]);
        break;
      } else {
        break; // Blocked by own piece
      }

      newRow += rowDelta;
      newCol += colDelta;
    }
  }

  return moves;
}

// Function to generate legal moves for a queen
function generateQueenMoves(board: Board, row: number, col: number): [number, number][] {
  const bishopMoves = generateBishopMoves(board, row, col);
  const rookMoves = generateRookMoves(board, row, col);
  return [...bishopMoves, ...rookMoves];
}

// Function to generate legal moves for a king
function generateKingMoves(board: Board, row: number, col: number): [number, number][] {
  const moves: [number, number][] = [];
  const piece = board[row][col];
  const directions: [number, number][] = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1], [0, 1],
    [1, -1], [1, 0], [1, 1],
  ];

  for (const [rowDelta, colDelta] of directions) {
    const newRow = row + rowDelta;
    const newCol = col + colDelta;

    if (isWithinBounds(newRow, newCol)) {
      const targetPiece = board[newRow][newCol];

      if (!targetPiece || targetPiece.color !== piece.color) {
        moves.push([newRow, newCol]);
      }
    }
  }

  return moves;
}

// Function to generate all legal moves for a player
export function generateLegalMoves(board: Board, playerColor: string): [number, number][] {
  const legalMoves: [number, number][] = [];

  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 5; col++) {
      const piece = board[row][col];
      if (piece && piece.color === playerColor) {
        let pieceMoves: [number, number][] = [];

        // Generate moves based on the piece type
        switch (piece.type) {
          case 'pawn':
            pieceMoves = generatePawnMoves(board, row, col);
            break;
          case 'knight':
            pieceMoves = generateKnightMoves(board, row, col);
            break;
          // Add cases for other piece types (bishop, rook, queen, king)
        }

        // Add the generated moves to the list of legal moves
        legalMoves.push(...pieceMoves);
      }
    }
  }

  return legalMoves;
}

// Function to check if a move is valid based on QuickChess rules
export function isValidMove(board: Board, startRow: number, startCol: number, endRow: number, endCol: number): boolean {
  const piece = board[startRow][startCol];

  if (!piece) {
    return false; // No piece to move
  }

  const legalMoves = generateLegalMoves(board, piece.color);

  for (const [row, col] of legalMoves) {
    if (row === endRow && col === endCol) {
      return true; // Move is in the list of legal moves
    }
  }

  return false; // Move is not valid
}

// Function to check if a king is in check
export function isKingInCheck(board: Board, kingColor: string): boolean {
  let kingRow = -1;
  let kingCol = -1;

  // Find the position of the king
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 5; col++) {
      const piece = board[row][col];
      if (piece?.type === 'king' && piece.color === kingColor) {
        kingRow = row;
        kingCol = col;
        break;
      }
    }
  }

  if (kingRow === -1 || kingCol === -1) {
    return false; // King not found
  }

  // Check for threats to the king
  const opponentColor = kingColor === 'white' ? 'black' : 'white';
  const opponentMoves = generateLegalMoves(board, opponentColor);

  for (const [targetRow, targetCol] of opponentMoves) {
    if (targetRow === kingRow && targetCol === kingCol) {
      return true; // King is in check
    }
  }

  return false; // King is not in check
}

// Function to check for checkmate
export function isCheckmate(board: Board, kingColor: string): boolean {
  if (!isKingInCheck(board, kingColor)) {
    return false; // The king is not in check, so it's not checkmate
  }

  // Try all possible moves to see if any move can get the king out of check
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 5; col++) {
      const piece = board[row][col];
      if (piece && piece.color === kingColor) {
        const legalMoves = generateLegalMoves(board, kingColor);

        for (const [newRow, newCol] of legalMoves) {
          const tempBoard = [...board.map((row) => [...row])];
          tempBoard[newRow][newCol] = piece;
          tempBoard[row][col] = EMPTY_SQUARE; // Move the piece

          if (!isKingInCheck(tempBoard, kingColor)) {
            return false; // There's a legal move to get out of check
          }
        }
      }
    }
  }

  return true; // No legal moves to get out of check; it's checkmate
}

