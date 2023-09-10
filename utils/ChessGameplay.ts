import { generateLegalMoves } from "./ChessMoves"

type Piece = string | null

type Board = Piece[][]

export function getPiece(pieceWithColor: string) {
  const [pieceName, color] = pieceWithColor.split('-')
  return { pieceName, color }
}

// Function to check if a king is in check
export function isKingInCheck(board: Board, kingColor: string): boolean {
  let kingRow = -1
  let kingCol = -1

  // Find the position of the king
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 5; col++) {
      const currentPiece = board[row][col]

      if (!currentPiece) continue
      const { pieceName: piece, color } = getPiece(currentPiece)

      if (piece?.includes('king') && color === kingColor) {
        kingRow = row
        kingCol = col
        break
      }
    }
  }

  if (kingRow === -1 || kingCol === -1) {
    return true // King not found
  }

  // Check for threats to the king
  const opponentColor = kingColor === 'white' ? 'black' : 'white'
  const opponentMoves = generateAllLegalMoves(board, opponentColor)

  for (const [targetRow, targetCol] of opponentMoves) {
    if (targetRow === kingRow && targetCol === kingCol) {
      return true // King is in check
    }
  }

  return false // King is not in check
}

// Function to check for checkmate
export function isCheckmate(board: Board, kingColor: string): boolean {
  if (!isKingInCheck(board, kingColor)) {
    return false // The king is not in check, so it's not checkmate
  }

  // Try all possible moves to see if any move can get the king out of check
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 5; col++) {
      const currentPiece = board[row][col]
      if(!currentPiece) continue

      const { pieceName: piece, color } = getPiece(currentPiece)

      if (piece && color === kingColor) {
        const legalMoves = generateLegalMoves(currentPiece, board, row, col)

        for (const [newRow, newCol] of legalMoves) {
          const tempBoard = [...board.map((row) => [...row])]
          tempBoard[newRow][newCol] = piece
          tempBoard[row][col] = null // Move the piece

          if (!isKingInCheck(tempBoard, kingColor))
            return false // There's a legal move to get out of check
        }
      }
    }
  }

  return true // No legal moves to get out of check; it's checkmate
}

// Function to check for checkmate
export function isStalemate(board: Board, playerColor: string): boolean {
  if (isKingInCheck(board, playerColor)) {
    return false // The king is not in check, so it's not checkmate
  }

  // Try all possible moves to see if any move can get the king out of check
  // Check if the player has any legal moves left
  const legalMoves = generateAllLegalMoves(board, playerColor);

  // If there are no legal moves, it's a stalemate
  return legalMoves.length === 0;
}

// Function to generate all legal moves for a player
export function generateAllLegalMoves(board: Board, playerColor: string): [number, number][] {
  const legalMoves: [number, number][] = []

  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 5; col++) {
      const currentPiece = board[row][col]
      if (!currentPiece) continue

      const { pieceName: piece, color } = getPiece(currentPiece)

      let pieceMoves: [number, number][] = []
      if (piece && color === playerColor)
        pieceMoves = generateLegalMoves(currentPiece, board, row, col)

      // Add the generated moves to the list of legal moves
      legalMoves.push(...pieceMoves);
    }
  }

  return legalMoves;
}

// Function to check if a move is Valid i.e. if it handles if the king is in check or if the move is going to put the king in check
export function validateMoves(board: Board, legalMoves: [number, number][], row: number, col: number): [number, number][] {
  // iterate over each move in legalMoves and check if the move is valid
  const validMoves: [number, number][] = []
  const color = getPiece(board[row][col]!).color

  for (const [newRow, newCol] of legalMoves) {
    const tempBoard = [...board.map((row) => [...row])]
    tempBoard[newRow][newCol] = tempBoard[row][col]
    tempBoard[row][col] = null // Move the piece

    if (!isKingInCheck(tempBoard, color)) {
      validMoves.push([newRow, newCol])
    }
  }
  
  return validMoves
}