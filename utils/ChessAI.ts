import { getPiece, isCheckmate, isKingInCheck, validateMoves } from "./ChessGameplay"
import { generateLegalMoves, generatePieceMoves } from "./ChessMoves"

type Piece = string | null
type Board = Piece[][]
type Move = {
  fromRow: number,
  fromCol: number,
  toRow: number,
  toCol: number
}

export function findBestAIMove(board: Board, maximizingPlayer: boolean) {
  const legalMoves = generateLegalAIMoves(board, 'black')

  let bestMove: Move | null = null
  let bestValue = maximizingPlayer ? -Infinity : Infinity;

  for (const move of legalMoves) {
    const newBoard = makeMove(board, move)
    const value = minimax(newBoard, 4, !maximizingPlayer, -Infinity, Infinity)

    if ((maximizingPlayer && value > bestValue) || (!maximizingPlayer && value < bestValue)) {
      bestValue = value
      bestMove = move
    }
  }

  return bestMove
}

export function generateLegalAIMoves(board: Board, playerColor: string): Move[] {
  const legalMoves: Move[] = []

  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 5; col++) {
      const currentPiece = board[row][col]
      if (!currentPiece) continue

      const { pieceName: piece, color } = getPiece(currentPiece)

      let pieceMoves: [number, number][] = []
      if (piece && color === playerColor)
        pieceMoves = generateLegalMoves(currentPiece, board, row, col)

      for (const [newRow, newCol] of pieceMoves) {
        legalMoves.push({ fromRow: row, fromCol: col, toRow: newRow, toCol: newCol })
      }
    }
  }

  let validMoves: Move[] = []

  for(const move of legalMoves) {
    const tempBoard = [...board.map((row) => [...row])]
    tempBoard[move.toRow][move.toCol] = tempBoard[move.fromRow][move.fromCol]
    tempBoard[move.fromRow][move.fromCol] = null // Move the piece    if(!isCheckmate(newBoard, 'white')) {
    
    if(!isKingInCheck(tempBoard, 'black')) {
      validMoves.push(move)
    }
  }

  return validMoves;
}


function makeMove(board: Board, move: Move) {
  const { fromRow, fromCol, toRow, toCol } = move

  const newBoard = [...board.map((row) => [...row])]
  newBoard[toRow][toCol] = newBoard[fromRow][fromCol]
  newBoard[fromRow][fromCol] = null

  return newBoard
}

function isTerminal(board: Board, color: string): boolean {
  return isCheckmate(board, color)
  // also add stalemate condition, and probably 50-move limit
}

const evaluateBoard = (board: (string | null)[][], maximizingPlayer: boolean): number => {
  const pieceValues: { [key: string]: number } = {
    'pawn': 1,
    'knight': 3,
    'bishop': 3,
    'rook': 5,
    'queen': 9,
  };

  let evaluationScore = 0;

  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 5; col++) {
      const piece = board[row][col];
      if (piece) {
        const isPieceBlack = piece.includes('black');

        const pieceValue = pieceValues[piece.split('-')[0].toLowerCase()] || 0;

        const positionScore = getPositionScore(row, col, !isPieceBlack);

        evaluationScore += isPieceBlack === maximizingPlayer ? pieceValue + positionScore : -pieceValue - positionScore;

        const playercolor: string = isPieceBlack ? 'black' : 'white';

        // Call calculatePieceMobility with the correct playerColor
        const mobilityScore = getMobility(board, playercolor);

        // evaluationScore += isPieceBlack === maximizingPlayer ? mobilityScore : -mobilityScore;

        // king safety evaluation
        const playerColor = maximizingPlayer ? 'black' : 'white'
        const kingSafetyScore = getKingSafetyScore(board, playerColor)
        evaluationScore += kingSafetyScore
      }
    }
  }


  return evaluationScore
};

function getMobility(board: Board, playerColor: string): number {
  let mobilityScore = 0;

  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 5; col++) {
      const piece = board[row][col];
      if (piece?.includes(playerColor)) {
        const pieceMobility = calculatePieceMobility(piece, row, col, board, playerColor);
        mobilityScore += pieceMobility;
      }
    }
  }

  return mobilityScore;
}

function calculatePieceMobility(piece: string | null, row: number, col: number, board: Board, playerColor: string): number {
  // If there's no piece or if it's not the expected color, return 0 mobility.
  if (!piece?.includes(playerColor)) {
    return 0;
  }

  // Generate legal moves for the piece at the given position.
  const legalMoves = generatePieceMoves(piece, board, row, col);

  // The mobility is simply the count of legal moves.
  return legalMoves.length;
}


// king safety evaluation
const getKingSafetyScore = (board: (string | null)[][], playerColor: string): number => {
  // Find the position of the player's king
  let kingRow = -1;
  let kingCol = -1;

  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 5; col++) {
      const piece = board[row][col];
      if (piece === `king-${playerColor}`) {
        kingRow = row;
        kingCol = col;
        break;
      }
    }
    if (kingRow !== -1) break;
  }

  if (kingRow === -1 || kingCol === -1) {
    return 0; // King not found (should not happen)
  }

  // Evaluate pawn shield
  const pawnShieldScore = evaluatePawnShield(board, kingRow, kingCol, playerColor);

  // Evaluate open files (files with no pawns)
  const openFilesScore = evaluateOpenFiles(board, kingCol);

  // Evaluate piece threats to the king
  const pieceThreatsScore = evaluatePieceThreats(board, kingRow, kingCol, playerColor);

  // Combine the scores and return
  const totalScore = pawnShieldScore + openFilesScore + pieceThreatsScore;
  return totalScore;
};

const evaluatePawnShield = (board: (string | null)[][], kingRow: number, kingCol: number, playerColor: string): number => {
  // Evaluate pawn shield for king safety
  //color code alright? is it going to be white?
  const pawnShieldRows = playerColor === 'black' ? [kingRow - 1, kingRow - 2] : [kingRow + 1, kingRow + 2];
  const pawnShieldCols = [kingCol - 1, kingCol, kingCol + 1];

  let pawnShieldScore = 0;

  for (const row of pawnShieldRows) {
    for (const col of pawnShieldCols) {
      if (isWithinBounds(row, col) && board[row][col]?.includes('pawn')) {
        // Add a positive score for each pawn in the shield
        pawnShieldScore += 1;
      }
    }
  }

  return pawnShieldScore;
};

const evaluateOpenFiles = (board: (string | null)[][], kingCol: number): number => {
  // Evaluate open files (files with no pawns)
  const openFilesScore = board.every((row) => !row[kingCol]?.includes('pawn')) ? 1 : 0;

  return openFilesScore;
};

const evaluatePieceThreats = (board: (string | null)[][], kingRow: number, kingCol: number, playerColor: string): number => {
  // Evaluate piece threats to the king
  const opponentColor = playerColor === 'white' ? 'black' : 'white';
  let pieceThreatsScore = 0;

  // Define the possible directions for piece threats
  const directions: [number, number][] = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1], /* King is not threatened from its own position */[0, 1],
    [1, -1], [1, 0], [1, 1],
  ];

  for (const [rowDelta, colDelta] of directions) {
    const newRow = kingRow + rowDelta;
    const newCol = kingCol + colDelta;

    if (isWithinBounds(newRow, newCol) && board[newRow][newCol]?.includes(opponentColor)) {
      // Add a negative score for each threatening opponent piece
      pieceThreatsScore -= 1;
    }
  }

  return pieceThreatsScore;
};

const isWithinBounds = (row: number, col: number): boolean => {
  return row >= 0 && row < 6 && col >= 0 && col < 5;
};


const getPositionScore = (row: number, col: number, isWhite: boolean): number => {
  const positionWeights = [
    [0, 0, 0, 0, 0],
    [5, 5, 5, 5, 5],
    [1, 2, 3, 2, 1],
    [1, 2, 4, 2, 1],
    [5, 5, 5, 5, 5],
    [0, 0, 0, 0, 0],
  ]

  const score = isWhite ? positionWeights[row][col] : -positionWeights[row][col];
  return score
}

const minimax = (board: Board, depth: number, maximizingPlayer: boolean, alpha: number, beta: number) => {
  let playerColor = maximizingPlayer ? 'black' : 'white'
  if (depth === 0 || isTerminal(board, playerColor)) {
    return evaluateBoard(board, maximizingPlayer)
  }

  const legalMoves = generateLegalAIMoves(board, 'black')

  if (maximizingPlayer) {
    let maxEval = -Infinity
    for (const move of legalMoves) {
      const newBoard = makeMove(board, move)
      const score = minimax(newBoard, depth - 1, false, alpha, beta)

      maxEval = Math.max(maxEval, score)
      alpha = Math.max(alpha, score)

      if (beta <= alpha) break
    }
    return maxEval
  }
  else {
    let minEval = Infinity

    for (const move of legalMoves) {
      const newBoard = makeMove(board, move)
      const score = minimax(newBoard, depth - 1, true, alpha, beta)

      minEval = Math.min(minEval, score)
      beta = Math.min(beta, score)

      if (beta <= alpha) break
    }
    return minEval
  }
}