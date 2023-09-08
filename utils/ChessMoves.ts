type Piece = string | null

type Board = Piece[][]

export function generateLegalMoves(selectedPiece: string | null, board: Board, row: number, col: number) {
  // Function to check if a position is within the bounds of the board
  let legalMoves: [number, number][] = []
  const piece = board[row][col]

  const { pieceName, color } = getPiece(piece!)

  if (piece && color === 'white') {
    const pieceMoves = generatePieceMoves(selectedPiece, board, row, col)
    legalMoves.push(...pieceMoves)
  }

  return legalMoves
}

// Function to generate legal moves for a piece
function generatePieceMoves(selectedPiece: string | null, board: Board, row: number, col: number) {
  const piece = board[row][col]

  const { pieceName, color } = getPiece(piece!)

  if (pieceName === 'pawn') {
    return generatePawnMoves(board, row, col)
  } else if (pieceName === 'knight') {
    return generateKnightMoves(board, row, col)
  } else if (pieceName === 'bishop') {
    return generateBishopMoves(board, row, col)
  } else if (pieceName === 'rook') {
    return generateRookMoves(board, row, col)
  } else if (pieceName === 'queen') {
    return generateQueenMoves(board, row, col)
  } else if (pieceName === 'king') {
    return generateKingMoves(board, row, col)
  }

  return []


}

function isWithinBounds(row: number, col: number) {
  return row >= 0 && row < 6 && col >= 0 && col < 5
}

// Function to generate legal moves for a pawn
function generatePawnMoves(board: Board, row: number, col: number) {
  const moves: [number, number][] = []
  const piece = board[row][col]

  const directions: [number, number][] = piece === 'pawn-white' ? [[-1, 0]] : [[1, 0]]

  for (const [rowDelta, colDelta] of directions) {
    const newRow = row + rowDelta
    const newCol = col + colDelta

    if (isWithinBounds(newRow, newCol)) {
      const targetPiece = board[newRow][newCol]

      if (!targetPiece) {
        moves.push([newRow, newCol])
      }
    }
  }

  return moves
}

// Function to generate legal moves for a knight
function generateKnightMoves(board: Board, row: number, col: number) {
  const moves: [number, number][] = []
  const piece = board[row][col]
  const directions: [number, number][] = [
    [-2, -1], [-2, 1],
    [-1, -2], [-1, 2],
    [1, -2], [1, 2],
    [2, -1], [2, 1],
  ]

  for (const [rowDelta, colDelta] of directions) {
    const newRow = row + rowDelta
    const newCol = col + colDelta

    if (isWithinBounds(newRow, newCol)) {
      const targetPiece = board[newRow][newCol]
      let pieceColor = '', targetColor = ''
      if (targetPiece) {
        pieceColor = getPiece(piece!).color
        targetColor = getPiece(targetPiece).color
      }

      if (!targetPiece || targetColor !== pieceColor) {
        moves.push([newRow, newCol])
      }
    }
  }

  return moves
}

// Function to generate legal moves for a bishop
function generateBishopMoves(board: Board, row: number, col: number) {
  const moves: [number, number][] = []
  const piece = board[row][col]
  const directions: [number, number][] = [
    [-1, -1], [-1, 1], [1, -1], [1, 1],
  ]

  for (const [rowDelta, colDelta] of directions) {
    let newRow = row + rowDelta
    let newCol = col + colDelta

    while (isWithinBounds(newRow, newCol)) {
      const targetPiece = board[newRow][newCol]

      if (!targetPiece || targetPiece[0] !== piece[0]) {
        moves.push([newRow, newCol])
      }

      if (targetPiece) {
        break
      }

      newRow += rowDelta
      newCol += colDelta
    }
  }

  return moves
}

// Function to generate legal moves for a rook
function generateRookMoves(board: Board, row: number, col: number) {
  const moves: [number, number][] = []
  const piece = board[row][col]
  const directions: [number, number][] = [
    [-1, 0], [1, 0], [0, -1], [0, 1],
  ]

  for (const [rowDelta, colDelta] of directions) {
    let newRow = row + rowDelta
    let newCol = col + colDelta

    while (isWithinBounds(newRow, newCol)) {
      const targetPiece = board[newRow][newCol]

      if (!targetPiece || targetPiece[0] !== piece[0]) {
        moves.push([newRow, newCol])
      }

      if (targetPiece) {
        break
      }

      newRow += rowDelta
      newCol += colDelta
    }
  }

  return moves
}

// Function to generate legal moves for a queen
function generateQueenMoves(board: Board, row: number, col: number) {
  const moves: [number, number][] = []
  const piece = board[row][col]
  const directions: [number, number][] = [
    [-1, -1], [-1, 1], [1, -1], [1, 1],
    [-1, 0], [1, 0], [0, -1], [0, 1],
  ]

  for (const [rowDelta, colDelta] of directions) {
    let newRow = row + rowDelta
    let newCol = col + colDelta

    while (isWithinBounds(newRow, newCol)) {
      const targetPiece = board[newRow][newCol]

      if (!targetPiece || targetPiece[0] !== piece[0]) {
        moves.push([newRow, newCol])
      }

      if (targetPiece) {
        break
      }

      newRow += rowDelta
      newCol += colDelta
    }
  }

  return moves
}

// Function to generate legal moves for a king
function generateKingMoves(board: Board, row: number, col: number) {
  const moves: [number, number][] = []
  const piece = board[row][col]
  const directions: [number, number][] = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1], [0, 1],
    [1, -1], [1, 0], [1, 1],
  ]

  for (const [rowDelta, colDelta] of directions) {
    const newRow = row + rowDelta
    const newCol = col + colDelta

    if (isWithinBounds(newRow, newCol)) {
      const targetPiece = board[newRow][newCol]

      if (!targetPiece || targetPiece[0] !== piece[0]) {
        moves.push([newRow, newCol])
      }
    }
  }

  return moves
}

function getPiece(pieceWithColor: string) {
  const [pieceName, color] = pieceWithColor.split('-')
  return { pieceName, color }
}
