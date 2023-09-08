import { generateLegalMoves } from "./ChessMoves"

type Piece = string | null

type Board = Piece[][]

function getPiece(pieceWithColor: string) {
  const [pieceName, color] = pieceWithColor.split('-')
  return { pieceName, color }
}

// Function to check if a king is in check
export function isKingInCheck(board: Board, kingColor: string): boolean {
  let kingRow = -1;
  let kingCol = -1;

  // Find the position of the king
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 5; col++) {
      const currentPiece = board[row][col];
      
      if (!currentPiece) continue;
      const { pieceName: piece, color } = getPiece(currentPiece)
      
      if (piece?.includes('king') && color === kingColor) {
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
  const opponentMoves = generateAllLegalMoves(board, opponentColor);

  for (const [targetRow, targetCol] of opponentMoves) {
    if (targetRow === kingRow && targetCol === kingCol) {
      return true; // King is in check
    }
  }

  return false; // King is not in check
}

// Function to generate all legal moves for a player
function generateAllLegalMoves(board: Board, playerColor: string): [number, number][] {
  const legalMoves: [number, number][] = [];

  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 5; col++) {
      const currentPiece = board[row][col];
      if (!currentPiece) continue;

      const { pieceName: piece, color } = getPiece(currentPiece!)

      let pieceMoves: [number, number][] = [];
      if (piece && color === playerColor)
        pieceMoves = generateLegalMoves(currentPiece, board, row, col)

      // Add the generated moves to the list of legal moves
      legalMoves.push(...pieceMoves);
    }
  }

  return legalMoves;
}